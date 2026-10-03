/**
 * Pointer-driven row reordering for IndexTable.
 *
 * Native HTML5 drag-and-drop can't start from a <button> (Firefox never does,
 * Chrome is inconsistent) and gives no control over the preview, so rows are
 * dragged with pointer events instead:
 *
 * - a copy of the row floats under the pointer,
 * - the row itself becomes a dashed placeholder that slides to the drop slot,
 * - the rows in between slide out of the way.
 *
 * Everything during the drag is DOM transforms — React only re-renders once,
 * when `onDrop` reports the move.
 */

/** Marks a top-level, draggable row with its index. */
export const DRAG_INDEX_ATTRIBUTE = "data-cx-it-drag-index";
/** Wrapper holding a row's expanded sub-rows; it moves with that row. */
const SUB_ROWS_CLASS = "cx-it__subrows";

function isBodyRow(element: HTMLElement): boolean {
  return element.classList.contains("cx-it__row--body");
}

function isSubRows(element: HTMLElement): boolean {
  return element.classList.contains(SUB_ROWS_CLASS);
}

const SHIFT_TRANSITION = "transform 160ms cubic-bezier(0.2, 0, 0, 1)";

type BlockType = {
  /** The row followed by its expanded sub-rows, which move with it. */
  elements: HTMLElement[];
  top: number;
  height: number;
};

/**
 * Hides the open sub-rows under the row at `fromIndex`, so a dragged parent is a
 * single row — one placeholder, one floating copy. Returns a restore function;
 * the rows come back, still expanded, once the drag ends.
 */
function collapseSubRows(grid: HTMLElement, fromIndex: number): () => void {
  const hidden: HTMLElement[] = [];
  let inDraggedBlock = false;
  for (const child of Array.from(grid.children) as HTMLElement[]) {
    if (!isBodyRow(child) && !isSubRows(child)) continue;
    if (child.hasAttribute(DRAG_INDEX_ATTRIBUTE)) {
      inDraggedBlock = child.getAttribute(DRAG_INDEX_ATTRIBUTE) === String(fromIndex);
    } else if (inDraggedBlock) {
      hidden.push(child);
      child.style.display = "none";
    }
  }
  return () => {
    for (const element of hidden) element.style.display = "";
  };
}

/** Groups the grid's body rows into blocks: a top-level row plus its sub-rows. */
function collectBlocks(grid: HTMLElement): BlockType[] {
  const blocks: BlockType[] = [];
  for (const child of Array.from(grid.children) as HTMLElement[]) {
    if (!isBodyRow(child) && !isSubRows(child)) continue;
    // Sub-rows collapsed for the drag are out of the layout.
    if (child.style.display === "none") continue;
    if (child.hasAttribute(DRAG_INDEX_ATTRIBUTE) || blocks.length === 0) {
      blocks.push({ elements: [child], top: 0, height: 0 });
    } else {
      blocks[blocks.length - 1]!.elements.push(child);
    }
  }
  for (const block of blocks) {
    const first = block.elements[0]!.getBoundingClientRect();
    const last = block.elements[block.elements.length - 1]!.getBoundingClientRect();
    block.top = first.top;
    block.height = last.bottom - first.top;
  }
  return blocks;
}

function setTransform(block: BlockType, offset: number) {
  for (const element of block.elements) {
    element.style.transform = offset ? `translateY(${offset}px)` : "";
  }
}

/** A detached copy of the row, positioned over the grid, that follows the pointer. */
function createFloatingRow(grid: HTMLElement, row: HTMLElement): HTMLElement {
  const gridRect = grid.getBoundingClientRect();
  const rowRect = row.getBoundingClientRect();
  const view = grid.ownerDocument.defaultView;

  const clone = row.cloneNode(true) as HTMLElement;
  clone.removeAttribute("id");
  clone.removeAttribute(DRAG_INDEX_ATTRIBUTE);
  clone.setAttribute("aria-hidden", "true");
  clone.classList.add("cx-it__row--floating");
  Object.assign(clone.style, {
    position: "absolute",
    top: `${rowRect.top - gridRect.top}px`,
    left: `${rowRect.left - gridRect.left}px`,
    width: `${rowRect.width}px`,
    // A detached row has no subgrid parent, so it takes the grid's resolved tracks.
    gridTemplateColumns: view?.getComputedStyle(grid).gridTemplateColumns ?? "",
    transform: "",
  });
  grid.appendChild(clone);
  return clone;
}

export type StartRowDragOptionsType = {
  grid: HTMLElement;
  /** Index of the row being dragged among the draggable rows. */
  fromIndex: number;
  /** Pointer position where the drag began. */
  startY: number;
  /** Element that received the pointerdown; listeners attach to its document. */
  source: HTMLElement;
  pointerId: number;
  onDrop: (fromIndex: number, toIndex: number) => void;
};

/** Starts a drag; returns a function that cancels it. */
export function startRowDrag({
  grid,
  fromIndex,
  startY,
  source,
  pointerId,
  onDrop,
}: StartRowDragOptionsType): () => void {
  // Collapse first: measuring afterwards gives the layout without the sub-rows.
  const restoreSubRows = collapseSubRows(grid, fromIndex);
  const blocks = collectBlocks(grid);
  const dragged = blocks[fromIndex];
  if (!dragged) {
    restoreSubRows();
    return () => {};
  }

  const doc = source.ownerDocument;
  source.setPointerCapture?.(pointerId);

  // The sub-rows wrapper carries its own inline transform/transition (it is a
  // Transition), so restore the originals rather than blanking them.
  const savedStyles = new Map<HTMLElement, { transform: string; transition: string }>();
  for (const block of blocks) {
    for (const element of block.elements) {
      savedStyles.set(element, {
        transform: element.style.transform,
        transition: element.style.transition,
      });
    }
  }

  const floating = createFloatingRow(grid, dragged.elements[0]!);
  grid.classList.add("cx-it__grid--dragging");
  for (const element of dragged.elements) element.classList.add("cx-it__row--placeholder");
  for (const block of blocks) {
    for (const element of block.elements) element.style.transition = SHIFT_TRANSITION;
  }

  let toIndex = fromIndex;

  const update = (clientY: number) => {
    const delta = clientY - startY;
    floating.style.transform = `translateY(${delta}px)`;

    const center = dragged.top + dragged.height / 2 + delta;
    let placeholderOffset = 0;
    toIndex = fromIndex;

    blocks.forEach((block, index) => {
      if (index === fromIndex) return;
      const blockCenter = block.top + block.height / 2;
      let offset = 0;
      if (index < fromIndex && center < blockCenter) {
        // Dragged above this row: it slides down into the old slot.
        offset = dragged.height;
        placeholderOffset -= block.height;
        toIndex -= 1;
      } else if (index > fromIndex && center > blockCenter) {
        offset = -dragged.height;
        placeholderOffset += block.height;
        toIndex += 1;
      }
      setTransform(block, offset);
    });
    setTransform(dragged, placeholderOffset);
  };

  const cleanup = () => {
    doc.removeEventListener("pointermove", handleMove);
    doc.removeEventListener("pointerup", handleUp);
    doc.removeEventListener("pointercancel", handleCancel);
    doc.removeEventListener("keydown", handleKeyDown);
    source.releasePointerCapture?.(pointerId);
    floating.remove();
    restoreSubRows();
    grid.classList.remove("cx-it__grid--dragging");
    for (const block of blocks) {
      for (const element of block.elements) {
        // Restore the transition first so rows snap, not animate, into the new order.
        const saved = savedStyles.get(element);
        element.style.transition = saved?.transition ?? "";
        element.style.transform = saved?.transform ?? "";
        element.classList.remove("cx-it__row--placeholder");
      }
    }
  };

  const handleMove = (event: PointerEvent) => {
    if (event.pointerId !== pointerId) return;
    event.preventDefault();
    update(event.clientY);
  };

  const handleUp = (event: PointerEvent) => {
    if (event.pointerId !== pointerId) return;
    cleanup();
    if (toIndex !== fromIndex) onDrop(fromIndex, toIndex);
  };

  const handleCancel = () => cleanup();

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === "Escape") cleanup();
  };

  doc.addEventListener("pointermove", handleMove);
  doc.addEventListener("pointerup", handleUp);
  doc.addEventListener("pointercancel", handleCancel);
  doc.addEventListener("keydown", handleKeyDown);

  return cleanup;
}

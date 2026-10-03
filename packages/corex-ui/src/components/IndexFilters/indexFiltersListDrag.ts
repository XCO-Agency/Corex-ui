/**
 * Pointer-driven reordering for the column list in `IndexFilters.ViewOptionsColumns`.
 *
 * Same model as the IndexTable row drag (native HTML5 drag-and-drop can't start
 * from a button and gives no control over the preview):
 *
 * - a copy of the item floats under the pointer, locked to the list axis,
 * - the item itself becomes a faded placeholder that slides to the drop slot,
 * - the items in between slide out of the way.
 *
 * Items that can't move (`movable[i] === false`) keep their slot: the movable
 * items are reordered among the remaining slots only. Everything during the drag
 * is DOM transforms — React only re-renders once, when `onDrop` reports the move.
 */

export type ListDragAxisType = "x" | "y";

const SHIFT_TRANSITION = "transform 160ms cubic-bezier(0.2, 0, 0, 1)";

/**
 * Returns the item order (original indices) after moving the movable item at
 * `fromSlot` to `toSlot`, where slots count movable items only.
 */
export function reorderSlots(
  movable: boolean[],
  fromSlot: number,
  toSlot: number,
): number[] {
  const order = movable.map((_, index) => index);
  const slots = order.filter((index) => movable[index]);
  const [moved] = slots.splice(fromSlot, 1);
  if (moved === undefined) return order;
  slots.splice(toSlot, 0, moved);
  let next = 0;
  return order.map((index) => (movable[index] ? slots[next++]! : index));
}

type MeasureType = { start: number; size: number };

function measure(element: HTMLElement, axis: ListDragAxisType): MeasureType {
  const rect = element.getBoundingClientRect();
  return axis === "y"
    ? { start: rect.top, size: rect.height }
    : { start: rect.left, size: rect.width };
}

export type StartListDragOptionsType = {
  /** Positioned ancestor the floating copy is appended to. */
  container: HTMLElement;
  /** Every item of the list, in rendered order. */
  items: HTMLElement[];
  /** Whether each item (same order as `items`) can be moved. */
  movable: boolean[];
  /** Index in `items` of the item being dragged. */
  fromIndex: number;
  axis: ListDragAxisType;
  /** Pointer position on `axis` where the drag began. */
  startPosition: number;
  /** Element that received the pointerdown; listeners attach to its document. */
  source: HTMLElement;
  pointerId: number;
  /** Reports the move in movable-slot positions (see `reorderSlots`). */
  onDrop: (fromSlot: number, toSlot: number) => void;
};

/** Starts a drag; returns a function that cancels it. */
export function startListDrag({
  container,
  items,
  movable,
  fromIndex,
  axis,
  startPosition,
  source,
  pointerId,
  onDrop,
}: StartListDragOptionsType): () => void {
  const dragged = items[fromIndex];
  const slotIndices = items.map((_, index) => index).filter((index) => movable[index]);
  const fromSlot = slotIndices.indexOf(fromIndex);
  if (!dragged || fromSlot < 0) return () => {};

  const doc = source.ownerDocument;
  const view = doc.defaultView;
  source.setPointerCapture?.(pointerId);

  const measures = items.map((item) => measure(item, axis));
  const first = measures[0]!;
  const last = measures[measures.length - 1]!;
  // Items are laid out with a constant gap; recover it from the overall extent.
  const totalSize = measures.reduce((sum, m) => sum + m.size, 0);
  const gap =
    items.length > 1 ? (last.start + last.size - first.start - totalSize) / (items.length - 1) : 0;

  const savedItemStyles = items.map((item) => ({
    transform: item.style.transform,
    transition: item.style.transition,
    opacity: item.style.opacity,
  }));
  const savedContainerPosition = container.style.position;
  if (view && view.getComputedStyle(container).position === "static") {
    container.style.position = "relative";
  }

  // Floating copy, positioned over the dragged item.
  const containerRect = container.getBoundingClientRect();
  const draggedRect = dragged.getBoundingClientRect();
  const floating = dragged.cloneNode(true) as HTMLElement;
  floating.removeAttribute("id");
  floating.setAttribute("aria-hidden", "true");
  Object.assign(floating.style, {
    position: "absolute",
    top: `${draggedRect.top - containerRect.top + container.scrollTop}px`,
    left: `${draggedRect.left - containerRect.left + container.scrollLeft}px`,
    width: `${draggedRect.width}px`,
    height: `${draggedRect.height}px`,
    margin: "0",
    zIndex: "1",
    pointerEvents: "none",
    background: "var(--p-color-bg-surface, #fff)",
    borderRadius: "8px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.16)",
    transform: "",
    transition: "none",
    opacity: "1",
    cursor: "grabbing",
  });
  container.appendChild(floating);

  dragged.style.opacity = "0.4";
  for (const item of items) item.style.transition = SHIFT_TRANSITION;

  const translate = (offset: number) =>
    offset ? (axis === "y" ? `translateY(${offset}px)` : `translateX(${offset}px)`) : "";

  let toSlot = fromSlot;

  const update = (position: number) => {
    const delta = position - startPosition;
    floating.style.transform = translate(delta);

    const center = measures[fromIndex]!.start + measures[fromIndex]!.size / 2 + delta;
    toSlot = fromSlot;
    slotIndices.forEach((index, slot) => {
      const m = measures[index]!;
      const itemCenter = m.start + m.size / 2;
      if (slot < fromSlot && center < itemCenter) toSlot -= 1;
      else if (slot > fromSlot && center > itemCenter) toSlot += 1;
    });

    // Lay the items out in the new order and slide each to its new start.
    let cursor = first.start;
    for (const index of reorderSlots(movable, fromSlot, toSlot)) {
      const m = measures[index]!;
      items[index]!.style.transform = translate(cursor - m.start);
      cursor += m.size + gap;
    }
  };

  const cleanup = () => {
    doc.removeEventListener("pointermove", handleMove);
    doc.removeEventListener("pointerup", handleUp);
    doc.removeEventListener("pointercancel", cleanup);
    doc.removeEventListener("keydown", handleKeyDown);
    source.releasePointerCapture?.(pointerId);
    floating.remove();
    container.style.position = savedContainerPosition;
    items.forEach((item, index) => {
      // Restore the transition first so items snap, not animate, into the new order.
      const saved = savedItemStyles[index]!;
      item.style.transition = saved.transition;
      item.style.transform = saved.transform;
      item.style.opacity = saved.opacity;
    });
  };

  const handleMove = (event: PointerEvent) => {
    if (event.pointerId !== pointerId) return;
    event.preventDefault();
    update(axis === "y" ? event.clientY : event.clientX);
  };

  const handleUp = (event: PointerEvent) => {
    if (event.pointerId !== pointerId) return;
    cleanup();
    if (toSlot !== fromSlot) onDrop(fromSlot, toSlot);
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === "Escape") cleanup();
  };

  doc.addEventListener("pointermove", handleMove);
  doc.addEventListener("pointerup", handleUp);
  doc.addEventListener("pointercancel", cleanup);
  doc.addEventListener("keydown", handleKeyDown);

  return cleanup;
}

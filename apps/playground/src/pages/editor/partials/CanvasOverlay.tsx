import * as React from "react";
import {
  ArrowUp,
  Copy,
  GripVertical,
  PanelRightClose,
  PanelRightOpen,
  Trash2,
} from "lucide-react";
import { getDefinition } from "../definitions";
import { nodeElement, startDrag, type DropPreviewType, type RectType } from "../dnd";
import { useEditor } from "../store";
import { findNode, findParent, pathTo, ROOT_ID } from "../tree";
import type { EditorNodeType } from "../types";

const ACCENT = "#2563eb";

type OverlayActionType = { label: string; open: boolean; targetId: string };

/**
 * Open/close for the overlay around the selection (Drawer, Popover…). From the
 * overlay itself or its trigger, "Open" selects its panel, which the canvas shows
 * open; from inside the panel, "Close" selects the overlay again.
 */
function overlayAction(
  root: EditorNodeType,
  selectedId: string,
): OverlayActionType | null {
  const path = pathTo(root, selectedId).map((id) => findNode(root, id)!);
  for (let index = path.length - 1; index >= 0; index -= 1) {
    const node = path[index]!;
    const definition = getDefinition(node.type);
    const panelType = definition?.overlay?.panel;
    if (!panelType) continue;
    const name = definition.label.toLowerCase();
    if (path[index + 1]?.type === panelType) {
      return { label: `Close ${name}`, open: false, targetId: node.id };
    }
    const panel = node.children?.find((child) => child.type === panelType);
    return panel ? { label: `Open ${name}`, open: true, targetId: panel.id } : null;
  }
  return null;
}

/**
 * Tracks the box of the first id in `ids` that has a canvas wrapper. Nodes under
 * `bareChildren` parents have none, so the nearest wrapped ancestor stands in.
 */
function useElementRect(doc: Document, ids: string[]) {
  const [rect, setRect] = React.useState<RectType | null>(null);
  const key = ids.join(" ");

  React.useEffect(() => {
    const candidates = key ? key.split(" ") : [];
    if (!candidates.length) {
      setRect(null);
      return;
    }
    // Layout shifts from Polaris upgrades, images and scrolling all move the
    // node, so the rect is re-read every frame and only committed on change.
    let frame = 0;
    let last = "";
    const tick = () => {
      const element = candidates.map((id) => nodeElement(doc, id)).find(Boolean);
      const box = element?.getBoundingClientRect();
      const next = box ? `${box.top}|${box.left}|${box.width}|${box.height}` : "";
      if (next !== last) {
        last = next;
        setRect(
          box
            ? { top: box.top, left: box.left, width: box.width, height: box.height }
            : null,
        );
      }
      frame = doc.defaultView!.requestAnimationFrame(tick);
    };
    tick();
    return () => doc.defaultView!.cancelAnimationFrame(frame);
  }, [doc, key]);

  return rect;
}

const boxStyle = (rect: RectType): React.CSSProperties => ({
  position: "fixed",
  top: rect.top,
  left: rect.left,
  width: rect.width,
  height: rect.height,
  pointerEvents: "none",
});

export type CanvasOverlayPropsType = {
  doc: Document;
  hoveredId: string | null;
  preview: DropPreviewType | null;
};

export function CanvasOverlay({ doc, hoveredId, preview }: CanvasOverlayPropsType) {
  const { state, dispatch } = useEditor();
  const selectedId = state.selectedId;
  const ancestry = (id: string | null) => (id ? pathTo(state.root, id).reverse() : []);
  const selectedRect = useElementRect(doc, ancestry(selectedId));
  const hoveredRect = useElementRect(
    doc,
    hoveredId !== selectedId ? ancestry(hoveredId) : [],
  );

  const selected = selectedId ? findNode(state.root, selectedId) : null;
  const hovered = hoveredId ? findNode(state.root, hoveredId) : null;
  const parent = selectedId ? findParent(state.root, selectedId) : null;
  const overlay = selectedId ? overlayAction(state.root, selectedId) : null;

  // Above the box when there is room, else below it; a box that fills the frame
  // (an open drawer panel) gets the toolbar inside its top edge.
  const viewportHeight = doc.defaultView?.innerHeight ?? Infinity;
  const toolbarPlacement: React.CSSProperties = !selectedRect
    ? {}
    : selectedRect.top >= 30
      ? { bottom: "calc(100% + 4px)" }
      : selectedRect.top + selectedRect.height + 34 <= viewportHeight
        ? { top: "calc(100% + 4px)" }
        : { top: 6, left: 6 };
  const iconButton =
    "pointer-events-auto flex size-6 cursor-pointer items-center justify-center rounded text-white/85 hover:bg-white/20 hover:text-white [&_svg]:size-3.5";

  return (
    <div
      style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 2147483000 }}
    >
      {hovered && hoveredRect && !preview && (
        <div
          style={{
            ...boxStyle(hoveredRect),
            outline: `1px dashed ${ACCENT}`,
            outlineOffset: -1,
          }}
        >
          <span
            className="absolute -top-5 left-0 rounded-t px-1.5 py-0.5 text-[10px] font-medium leading-none text-white"
            style={{ background: ACCENT, opacity: 0.85 }}
          >
            {getDefinition(hovered.type)?.label ?? hovered.type}
          </span>
        </div>
      )}

      {selected && selectedRect && (
        <div
          style={{
            ...boxStyle(selectedRect),
            outline: `2px solid ${ACCENT}`,
            outlineOffset: -1,
          }}
        >
          <div
            className="absolute left-0 flex items-center gap-0.5 rounded-md py-0.5 pr-0.5 pl-2 text-[11px] font-medium text-white shadow-md"
            style={{
              background: ACCENT,
              ...toolbarPlacement,
            }}
            onClick={(event) => event.stopPropagation()}
          >
            <span className="mr-1 whitespace-nowrap">
              {getDefinition(selected.type)?.label ?? selected.type}
            </span>
            <span
              draggable
              title="Drag to move"
              className={`${iconButton} cursor-grab`}
              onDragStart={(event) => {
                event.stopPropagation();
                startDrag(event, { kind: "move", id: selected.id });
              }}
            >
              <GripVertical />
            </span>
            {overlay && (
              <button
                type="button"
                title={overlay.label}
                aria-label={overlay.label}
                className={iconButton}
                onClick={() => dispatch({ type: "select", id: overlay.targetId })}
              >
                {overlay.open ? <PanelRightOpen /> : <PanelRightClose />}
              </button>
            )}
            {parent && parent.id !== ROOT_ID && (
              <button
                type="button"
                title="Select parent"
                className={iconButton}
                onClick={() => dispatch({ type: "select", id: parent.id })}
              >
                <ArrowUp />
              </button>
            )}
            <button
              type="button"
              title="Duplicate (⌘D)"
              className={iconButton}
              onClick={() => dispatch({ type: "duplicate", id: selected.id })}
            >
              <Copy />
            </button>
            <button
              type="button"
              title="Delete (⌫)"
              className={iconButton}
              onClick={() => dispatch({ type: "remove", id: selected.id })}
            >
              <Trash2 />
            </button>
          </div>
        </div>
      )}

      {preview && (
        <>
          <div
            style={{
              ...boxStyle(preview.container),
              outline: `1px solid ${ACCENT}`,
              outlineOffset: -1,
              background: "rgba(37, 99, 235, 0.04)",
            }}
          />
          <div
            style={{
              ...boxStyle(preview.indicator),
              ...(preview.indicator.kind === "line"
                ? {
                    background: ACCENT,
                    borderRadius: 2,
                    boxShadow: "0 0 0 2px rgba(37,99,235,0.2)",
                  }
                : {
                    outline: `2px dashed ${ACCENT}`,
                    outlineOffset: -4,
                    background: "rgba(37,99,235,0.08)",
                  }),
            }}
          />
        </>
      )}
    </div>
  );
}

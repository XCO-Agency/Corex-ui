import type * as React from "react";
import { canPlace, getDefinition } from "./definitions";
import { ancestryOf, findNode, findParent, isDescendant, ROOT_ID } from "./tree";
import type { DragPayloadType, DropTargetType, EditorNodeType } from "./types";

/*
 * `dataTransfer` is unreadable during `dragover` and does not carry objects
 * across the parent/iframe boundary, so the active payload lives here.
 */
let activePayload: DragPayloadType | null = null;

export const DRAG_MIME = "application/x-corex-editor";

export function startDrag(event: React.DragEvent, payload: DragPayloadType) {
  activePayload = payload;
  event.dataTransfer.effectAllowed = payload.kind === "new" ? "copy" : "move";
  // Firefox refuses to start a drag without data.
  event.dataTransfer.setData(DRAG_MIME, JSON.stringify(payload));
  event.dataTransfer.setData(
    "text/plain",
    payload.kind === "new" ? payload.type : payload.id,
  );
}

const endListeners = new Set<() => void>();

export const getDragPayload = () => activePayload;

export function endDrag() {
  activePayload = null;
  endListeners.forEach((listener) => listener());
}

/** Lets the canvas clear its drop preview when a drag ends anywhere, even cancelled. */
export function onDragEnded(listener: () => void) {
  endListeners.add(listener);
  return () => {
    endListeners.delete(listener);
  };
}

export type RectType = { top: number; left: number; width: number; height: number };

export type DropPreviewType = {
  target: DropTargetType;
  /** Insertion line, or the whole container when it is empty. */
  indicator: RectType & { kind: "line" | "box" };
  container: RectType;
};

const EDGE = 10;

const toRect = (rect: DOMRect): RectType => ({
  top: rect.top,
  left: rect.left,
  width: rect.width,
  height: rect.height,
});

const nodeElement = (doc: Document, id: string) =>
  doc.querySelector<HTMLElement>(`[data-cx-node="${CSS.escape(id)}"]`);

const childElements = (doc: Document, id: string) =>
  Array.from(doc.querySelectorAll<HTMLElement>(`[data-cx-parent="${CSS.escape(id)}"]`));

const axisOf = (node: EditorNodeType) => getDefinition(node.type)?.axis ?? "vertical";

function indexAt(doc: Document, container: EditorNodeType, x: number, y: number) {
  const horizontal = axisOf(container) === "horizontal";
  const children = childElements(doc, container.id);
  const index = children.findIndex((child) => {
    const rect = child.getBoundingClientRect();
    if (!horizontal) return y < rect.top + rect.height / 2;
    // Rows can wrap, so a later row always counts as "after".
    if (y < rect.top) return true;
    return y <= rect.bottom && x < rect.left + rect.width / 2;
  });
  return index === -1 ? children.length : index;
}

function siblingTarget(
  root: EditorNodeType,
  node: EditorNodeType,
  rect: DOMRect,
  x: number,
  y: number,
): DropTargetType | null {
  const parent = findParent(root, node.id);
  if (!parent) return null;
  const index = parent.children!.findIndex((child) => child.id === node.id);
  const after =
    axisOf(parent) === "horizontal"
      ? x > rect.left + rect.width / 2
      : y > rect.top + rect.height / 2;
  return { parentId: parent.id, index: after ? index + 1 : index };
}

function resolveTarget(
  doc: Document,
  root: EditorNodeType,
  element: HTMLElement | null,
  x: number,
  y: number,
): DropTargetType {
  const id = element?.dataset.cxNode ?? ROOT_ID;
  const node = findNode(root, id) ?? root;
  const rect = (element ?? doc.body).getBoundingClientRect();

  if (!getDefinition(node.type)?.isContainer) {
    return siblingTarget(root, node, rect, x, y) ?? { parentId: ROOT_ID, index: 0 };
  }

  // Near a container's edge the drop goes beside it instead of inside it.
  if (node.id !== ROOT_ID) {
    const parent = findParent(root, node.id);
    const horizontal = parent && axisOf(parent) === "horizontal";
    const start = horizontal ? x - rect.left : y - rect.top;
    const end = horizontal ? rect.right - x : rect.bottom - y;
    const edge = Math.min(EDGE, (horizontal ? rect.width : rect.height) / 4);
    if (start < edge || end < edge) {
      const target = siblingTarget(root, node, rect, x, y);
      if (target) return target;
    }
  }

  return { parentId: node.id, index: indexAt(doc, node, x, y) };
}

function indicatorFor(doc: Document, root: EditorNodeType, target: DropTargetType) {
  const parent = findNode(root, target.parentId)!;
  const parentElement = nodeElement(doc, parent.id) ?? doc.body;
  const container = toRect(parentElement.getBoundingClientRect());
  const children = childElements(doc, parent.id);

  if (!children.length) {
    return { indicator: { ...container, kind: "box" as const }, container };
  }

  const horizontal = axisOf(parent) === "horizontal";
  const reference =
    children[Math.min(target.index, children.length - 1)]!.getBoundingClientRect();
  const atEnd = target.index >= children.length;
  const line = horizontal
    ? {
        top: reference.top,
        height: reference.height,
        left: (atEnd ? reference.right : reference.left) - 2,
        width: 3,
      }
    : {
        left: reference.left,
        width: reference.width,
        top: (atEnd ? reference.bottom : reference.top) - 2,
        height: 3,
      };
  return { indicator: { ...line, kind: "line" as const }, container };
}

/**
 * Keeps parts where they belong: when `parentId` cannot hold `type` (a Table.Row
 * outside Table.Body, a Button inside a Table), the drop moves up to just after
 * the nearest ancestor whose parent can.
 */
function legalTarget(root: EditorNodeType, target: DropTargetType, type: string) {
  let parent = findNode(root, target.parentId);
  let candidate: DropTargetType | null = target;
  while (parent && candidate) {
    if (canPlace(ancestryOf(root, parent.id), type)) return candidate;
    const grandparent = findParent(root, parent.id);
    candidate = grandparent
      ? {
          parentId: grandparent.id,
          index: grandparent.children!.findIndex((child) => child.id === parent!.id) + 1,
        }
      : null;
    parent = grandparent;
  }
  return null;
}

/** Works out where a drag at (x, y) would land, or `null` when it cannot land there. */
export function computeDrop(
  doc: Document,
  root: EditorNodeType,
  hit: EventTarget | null,
  x: number,
  y: number,
): DropPreviewType | null {
  const payload = activePayload;
  if (!payload) return null;
  // `instanceof Element` fails across the iframe realm, so duck-type the hit.
  const element =
    hit && typeof (hit as Element).closest === "function"
      ? (hit as Element).closest<HTMLElement>("[data-cx-node]")
      : null;
  const type = payload.kind === "new" ? payload.type : findNode(root, payload.id)?.type;
  if (!type) return null;
  const target = legalTarget(root, resolveTarget(doc, root, element, x, y), type);
  if (!target) return null;

  if (payload.kind === "move") {
    if (
      payload.id === target.parentId ||
      isDescendant(root, payload.id, target.parentId)
    ) {
      return null;
    }
  }
  return { target, ...indicatorFor(doc, root, target) };
}

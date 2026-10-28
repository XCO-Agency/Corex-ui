import type {
  DraftNodeType,
  DropTargetType,
  EditorNodeType,
  NodePropsType,
} from "./types";

export const ROOT_ID = "root";

let counter = 0;
export const createId = () =>
  `n${Date.now().toString(36)}${(counter++).toString(36)}${Math.random().toString(36).slice(2, 5)}`;

export function findNode(root: EditorNodeType, id: string): EditorNodeType | null {
  if (root.id === id) return root;
  for (const child of root.children ?? []) {
    const found = findNode(child, id);
    if (found) return found;
  }
  return null;
}

export function findParent(root: EditorNodeType, id: string): EditorNodeType | null {
  for (const child of root.children ?? []) {
    if (child.id === id) return root;
    const found = findParent(child, id);
    if (found) return found;
  }
  return null;
}

/** Ids from the root down to `id`, inclusive. */
export function pathTo(root: EditorNodeType, id: string): string[] {
  if (root.id === id) return [root.id];
  for (const child of root.children ?? []) {
    const path = pathTo(child, id);
    if (path.length) return [root.id, ...path];
  }
  return [];
}

/** Types from the root down to `id`, inclusive, for `canPlace`. */
export function ancestryOf(root: EditorNodeType, id: string): string[] {
  return pathTo(root, id).map((nodeId) => findNode(root, nodeId)!.type);
}

export function isDescendant(root: EditorNodeType, ancestorId: string, id: string) {
  const ancestor = findNode(root, ancestorId);
  return Boolean(ancestor && findNode(ancestor, id));
}

function mapNode(
  node: EditorNodeType,
  id: string,
  update: (node: EditorNodeType) => EditorNodeType,
): EditorNodeType {
  if (node.id === id) return update(node);
  if (!node.children) return node;
  let changed = false;
  const children = node.children.map((child) => {
    const next = mapNode(child, id, update);
    if (next !== child) changed = true;
    return next;
  });
  return changed ? { ...node, children } : node;
}

export function updateProps(root: EditorNodeType, id: string, props: NodePropsType) {
  return mapNode(root, id, (node) => ({ ...node, props: { ...node.props, ...props } }));
}

export function removeNode(root: EditorNodeType, id: string): EditorNodeType {
  if (id === ROOT_ID) return root;
  const parent = findParent(root, id);
  if (!parent) return root;
  return mapNode(root, parent.id, (node) => ({
    ...node,
    children: node.children!.filter((child) => child.id !== id),
  }));
}

export function insertNode(
  root: EditorNodeType,
  { parentId, index }: DropTargetType,
  node: EditorNodeType,
): EditorNodeType {
  return mapNode(root, parentId, (parent) => {
    const children = [...(parent.children ?? [])];
    children.splice(Math.max(0, Math.min(index, children.length)), 0, node);
    return { ...parent, children };
  });
}

export function moveNode(root: EditorNodeType, id: string, target: DropTargetType) {
  if (
    id === ROOT_ID ||
    id === target.parentId ||
    isDescendant(root, id, target.parentId)
  ) {
    return root;
  }
  const node = findNode(root, id);
  const parent = findParent(root, id);
  if (!node || !parent) return root;

  // Moving forward inside the same parent: removing the node first shifts the index.
  const from = parent.children!.findIndex((child) => child.id === id);
  const index =
    parent.id === target.parentId && from < target.index
      ? target.index - 1
      : target.index;
  return insertNode(removeNode(root, id), { parentId: target.parentId, index }, node);
}

/** Deep copy with fresh ids, so duplicates and AI output never collide. */
export function cloneWithIds(node: DraftNodeType): EditorNodeType {
  return {
    id: createId(),
    type: node.type,
    props: { ...node.props },
    ...(node.children ? { children: node.children.map(cloneWithIds) } : {}),
  };
}

export function duplicateNode(root: EditorNodeType, id: string) {
  const node = findNode(root, id);
  const parent = findParent(root, id);
  if (!node || !parent) return { root, id: null };
  const copy = cloneWithIds(node);
  const index = parent.children!.findIndex((child) => child.id === id) + 1;
  return { root: insertNode(root, { parentId: parent.id, index }, copy), id: copy.id };
}

export function countNodes(node: EditorNodeType): number {
  return 1 + (node.children ?? []).reduce((sum, child) => sum + countNodes(child), 0);
}

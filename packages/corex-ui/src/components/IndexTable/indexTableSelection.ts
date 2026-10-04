import { Children, isValidElement, type ReactNode } from "react";

/**
 * Tree-aware selection for rows with `subRows`.
 *
 * A row with selectable descendants does not show its own `selected` prop: it
 * is checked when every selectable child is, indeterminate when some are. Its
 * own id still follows that state in the consumer's selection, so selecting
 * every variant also selects the product.
 */

export type SelectionNodeType = {
  id?: string;
  /** The row's own `selected` prop. */
  selected: boolean;
  /** Has an id, is not disabled, and is not `selectable={false}`. */
  selectable: boolean;
  children: SelectionNodeType[];
};

export type SelectionStateType = "all" | "some" | "none";

type RowSelectionPropsType = {
  id?: string;
  selected?: boolean;
  selectable?: boolean;
  disabled?: boolean;
  subRows?: ReactNode;
};

/** Builds a row's selection tree from its props and its `subRows` elements. */
export function buildSelectionNode(props: RowSelectionPropsType): SelectionNodeType {
  const children = Children.toArray(props.subRows)
    .filter(isValidElement)
    .map((child) => buildSelectionNode(child.props as RowSelectionPropsType));

  return {
    id: props.id,
    selected: Boolean(props.selected),
    selectable: props.selectable !== false && !props.disabled && props.id !== undefined,
    children,
  };
}

function selectableChildren(node: SelectionNodeType): SelectionNodeType[] {
  return node.children.filter((child) => child.selectable);
}

export function getSelectionState(node: SelectionNodeType): SelectionStateType {
  const kids = selectableChildren(node);
  if (kids.length === 0) return node.selected ? "all" : "none";

  const states = kids.map(getSelectionState);
  if (states.every((state) => state === "all")) return "all";
  if (states.some((state) => state !== "none")) return "some";
  return "none";
}

/** True when the row or anything under it is selected. */
export function hasAnySelected(node: SelectionNodeType): boolean {
  return node.selected || node.children.some(hasAnySelected);
}

/**
 * The selection changes needed to set `node` to `next`: the node and every
 * selectable descendant follow it, then each ancestor (nearest first) becomes
 * selected only if all its selectable children now are.
 *
 * Only ids whose value actually changes are returned.
 */
export function getToggleChanges(
  node: SelectionNodeType,
  next: boolean,
  ancestors: SelectionNodeType[],
): { id: string; selected: boolean }[] {
  const target = new Map<string, boolean>();
  const current = new Map<string, boolean>();

  const record = (n: SelectionNodeType) => {
    if (n.id !== undefined) current.set(n.id, n.selected);
    n.children.forEach(record);
  };
  [node, ...ancestors].forEach(record);

  const apply = (n: SelectionNodeType) => {
    if (n.selectable && n.id !== undefined) target.set(n.id, next);
    selectableChildren(n).forEach(apply);
  };
  apply(node);

  let branchId = node.id;
  let branchState = next;
  for (const ancestor of ancestors) {
    const allAfter = selectableChildren(ancestor).every((child) =>
      child.id === branchId ? branchState : getSelectionState(child) === "all",
    );
    if (ancestor.selectable && ancestor.id !== undefined)
      target.set(ancestor.id, allAfter);
    branchId = ancestor.id;
    branchState = allAfter;
  }

  return [...target]
    .filter(([id, selected]) => current.get(id) !== selected)
    .map(([id, selected]) => ({ id, selected }));
}

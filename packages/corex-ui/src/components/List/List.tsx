import { forwardRef } from "react";
import { createWebComponent } from "../../core/createWebComponent";
import { devWarning } from "../../utils/devWarning";
import type { ListItemPropsType, ListPropsType } from "./List.types";

const SUnorderedList = createWebComponent<HTMLElement>("s-unordered-list");
const SOrderedList = createWebComponent<HTMLElement>("s-ordered-list");
const SListItem = createWebComponent<HTMLElement>("s-list-item");

/** A list item. Only valid inside a `List`, which is what the elements accept. */
export const ListItem = forwardRef<HTMLElement, ListItemPropsType>(function ListItem(
  { children, ...rest },
  ref,
) {
  return (
    <SListItem ref={ref} {...rest}>
      {children}
    </SListItem>
  );
});

const ListRoot = forwardRef<HTMLElement, ListPropsType>(function List(
  { children, type = "bullet", gap, ...rest },
  ref,
) {
  if (gap !== undefined) {
    devWarning("List", "`gap` is ignored; the native lists own their spacing.");
  }

  const SList = type === "number" ? SOrderedList : SUnorderedList;

  return (
    <SList ref={ref} {...rest}>
      {children}
    </SList>
  );
});

export const List = Object.assign(ListRoot, { Item: ListItem });

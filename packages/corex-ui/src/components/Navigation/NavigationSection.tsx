import * as React from "react";
import { NavigationLabel } from "./NavigationLabel";
import { NavigationItem } from "./NavigationItem";
import type { NavigationSectionPropsType } from "./Navigation.types";
import { BlockStack } from "../BlockStack";

export const NavigationSection = React.forwardRef<
  HTMLDivElement,
  NavigationSectionPropsType
>(function NavigationSection({ title, action, items, children, ...rest }, ref) {
  return (
    <BlockStack ref={ref} gap="small-500" {...rest}>
      {title && <NavigationLabel action={action}>{title}</NavigationLabel>}

      {items &&
        items.length > 0 &&
        items.map((item, idx) => <NavigationItem key={item.id || idx} {...item} />)}

      {children}
    </BlockStack>
  );
});

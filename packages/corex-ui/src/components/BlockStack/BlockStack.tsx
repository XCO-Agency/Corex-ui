import {
  forwardRef,
  type ForwardRefExoticComponent,
  type RefAttributes,
} from "react";
import { createWebComponent } from "../../core/createWebComponent";
import { mapLegacyGap } from "../../core/legacySpacing";
import type { BlockStackPropsType } from "./BlockStack.types";

const SStack = createWebComponent<HTMLElement>("s-stack", {
  staticAttributes: { direction: "block" },
});

/**
 * Composed pattern: legacy `BlockStack` has no 1:1 web component. It's
 * `s-stack` pinned to `direction="block"`, matching `InlineStack`'s use of
 * the same element pinned to `direction="inline"`.
 */
export const BlockStack: ForwardRefExoticComponent<
  BlockStackPropsType & RefAttributes<HTMLElement>
> = forwardRef<HTMLElement, BlockStackPropsType>(
  function BlockStack({ children, gap, ...rest }, ref) {
    return (
      <SStack ref={ref} gap={mapLegacyGap(gap)} {...rest}>
        {children}
      </SStack>
    );
  },
);

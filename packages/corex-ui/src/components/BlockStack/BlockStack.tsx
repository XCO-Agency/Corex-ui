import { forwardRef } from "react";
import { createWebComponent } from "../../core/createWebComponent";
import type { BlockStackProps } from "./BlockStack.types";

const SStack = createWebComponent<HTMLElement>("s-stack", {
  staticAttributes: { direction: "block" },
});

/**
 * Composed pattern: legacy `BlockStack` has no 1:1 web component. It's
 * `s-stack` pinned to `direction="block"`, matching `InlineStack`'s use of
 * the same element pinned to `direction="inline"`.
 */
export const BlockStack = forwardRef<HTMLElement, BlockStackProps>(function BlockStack(
  { children, ...rest },
  ref,
) {
  return (
    <SStack ref={ref} {...rest}>
      {children}
    </SStack>
  );
});

import { forwardRef } from "react";
import { createWebComponent } from "../../core/createWebComponent";
import type { InlineStackProps } from "./InlineStack.types";

const SStack = createWebComponent<HTMLElement>("s-stack", {
  staticAttributes: { direction: "inline" },
});

/** Composed pattern: `s-stack` pinned to `direction="inline"`. See `BlockStack`. */
export const InlineStack = forwardRef<HTMLElement, InlineStackProps>(function InlineStack(
  { children, ...rest },
  ref,
) {
  return (
    <SStack ref={ref} {...rest}>
      {children}
    </SStack>
  );
});

import {
  forwardRef,
  type ForwardRefExoticComponent,
  type RefAttributes,
} from "react";
import { createWebComponent } from "../../core/createWebComponent";
import { mapLegacyGap } from "../../core/legacySpacing";
import type { InlineStackPropsType } from "./InlineStack.types";

const SStack = createWebComponent<HTMLElement>("s-stack", {
  staticAttributes: { direction: "inline" },
});

/** Composed pattern: `s-stack` pinned to `direction="inline"`. See `BlockStack`. */
export const InlineStack: ForwardRefExoticComponent<
  InlineStackPropsType & RefAttributes<HTMLElement>
> = forwardRef<HTMLElement, InlineStackPropsType>(
  function InlineStack({ children, gap, align, blockAlign, justifyContent, alignItems, ...rest }, ref) {
    return (
      <SStack
        ref={ref}
        gap={mapLegacyGap(gap)}
        justifyContent={justifyContent ?? (align as any)}
        alignItems={alignItems ?? (blockAlign as any)}
        {...rest}
      >
        {children}
      </SStack>
    );
  },
);

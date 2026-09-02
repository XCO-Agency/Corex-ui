import { Children, cloneElement, forwardRef, isValidElement } from "react";
import { createWebComponent } from "../../core/createWebComponent";
import type { ButtonGroupProps } from "./ButtonGroup.types";

const SButtonGroup = createWebComponent<HTMLElement>("s-button-group");

/** Thin wrapper: `s-button-group` accepts `<s-button>` children directly. */
export const ButtonGroup = forwardRef<HTMLElement, ButtonGroupProps>(function ButtonGroup(
  { children, fullWidth: _fullWidth, variant, gap, ...rest },
  ref,
) {
  return (
    <SButtonGroup ref={ref} gap={gap ?? (variant === "segmented" ? "none" : undefined)} {...rest}>
      {Children.map(children, (child) =>
        isValidElement(child) ? cloneElement(child, { slot: "secondary-actions" }) : child,
      )}
    </SButtonGroup>
  );
});

import { forwardRef } from "react";
import { createWebComponent } from "../../core/createWebComponent";
import type { ButtonGroupProps } from "./ButtonGroup.types";

const SButtonGroup = createWebComponent<HTMLElement>("s-button-group");

/** Thin wrapper: `s-button-group` accepts `<s-button>` children directly. */
export const ButtonGroup = forwardRef<HTMLElement, ButtonGroupProps>(function ButtonGroup(
  { children, fullWidth, ...rest },
  ref,
) {
  return (
    <SButtonGroup ref={ref} fullWidth={fullWidth} {...rest}>
      {children}
    </SButtonGroup>
  );
});

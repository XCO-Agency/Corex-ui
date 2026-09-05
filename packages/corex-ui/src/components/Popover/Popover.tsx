import { forwardRef } from "react";
import { createWebComponent } from "../../core/createWebComponent";
import type { PopoverPropsType } from "./Popover.types";

const SPopover = createWebComponent<HTMLElement>("s-popover");

/**
 * Wrapper over `<s-popover>`. Pair with an activator `Button` using `commandFor={popoverId}`.
 */
export const Popover = forwardRef<HTMLElement, PopoverPropsType>(function Popover(
  { children, ...rest },
  ref,
) {
  return (
    <SPopover ref={ref} {...rest}>
      {children}
    </SPopover>
  );
});

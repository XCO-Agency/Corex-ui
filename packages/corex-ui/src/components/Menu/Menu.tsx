import { forwardRef } from "react";
import { createWebComponent } from "../../core/createWebComponent";
import type { MenuProps } from "./Menu.types";

const SMenu = createWebComponent<HTMLElement>("s-menu");

/**
 * Thin wrapper over `s-menu`, holding `Button` children. Pair with a trigger
 * `Button` using `commandFor={menuId}` — see `docs/app-bridge.md`.
 */
export const Menu = forwardRef<HTMLElement, MenuProps>(function Menu({ children, ...rest }, ref) {
  return (
    <SMenu ref={ref} {...rest}>
      {children}
    </SMenu>
  );
});

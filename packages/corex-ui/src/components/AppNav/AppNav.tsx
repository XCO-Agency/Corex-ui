import { forwardRef } from "react";
import { createWebComponent } from "../../core/createWebComponent";
import type { AppNavProps } from "./AppNav.types";

const SAppNav = createWebComponent<HTMLElement>("s-app-nav");

/** App Bridge component (see `docs/app-bridge.md`): thin wrapper holding `Link` children. */
export const AppNav = forwardRef<HTMLElement, AppNavProps>(function AppNav({ children, ...rest }, ref) {
  return (
    <SAppNav ref={ref} {...rest}>
      {children}
    </SAppNav>
  );
});

import { forwardRef } from "react";
import { createWebComponent } from "../../core/createWebComponent";
import type { BadgeProps } from "./Badge.types";

const SBadge = createWebComponent<HTMLElement>("s-badge");

export const Badge = forwardRef<HTMLElement, BadgeProps>(function Badge(
  { children, ...rest },
  ref,
) {
  return (
    <SBadge ref={ref} {...rest}>
      {children}
    </SBadge>
  );
});

import { forwardRef } from "react";
import { createWebComponent } from "../../core/createWebComponent";
import type { BadgePropsType } from "./Badge.types";
import type { ToneType } from "../../types/common";

const SBadge = createWebComponent<HTMLElement>("s-badge");

/**
 * Badge component wrapping Polaris `<s-badge>`.
 * Translates legacy `status` values onto modern `tone` attributes while accepting `tone` directly.
 */
export const Badge = forwardRef<HTMLElement, BadgePropsType>(function Badge(
  { children, tone, status, color, icon, ...rest },
  ref,
) {
  const resolvedTone =
    tone ??
    (status === "attention"
      ? "warning"
      : status === "new"
        ? "info"
        : (status as ToneType | undefined));

  return (
    <SBadge ref={ref} tone={resolvedTone} color={color} icon={icon} {...rest}>
      {children}
    </SBadge>
  );
});

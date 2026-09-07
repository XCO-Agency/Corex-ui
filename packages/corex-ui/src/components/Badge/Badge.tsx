import { forwardRef } from "react";
import { createWebComponent } from "../../core/createWebComponent";
import type { BadgePropsType } from "./Badge.types";
import type { IconType, ToneType } from "../../types/common";

const SBadge = createWebComponent<HTMLElement>("s-badge");

/**
 * Badge component wrapping Polaris `<s-badge>`.
 * Translates legacy `status` values onto modern `tone` attributes while accepting `tone` directly.
 */
export const Badge = forwardRef<HTMLElement, BadgePropsType>(function Badge(
  { children, tone, status, color, icon, progress, ...rest },
  ref,
) {
  const resolvedTone =
    tone ??
    (status === "attention"
      ? "warning"
      : status === "new"
        ? "info"
        : (status as ToneType | undefined));

  const resolveIcon = (): IconType => {
    if (progress === "incomplete") {
      return "incomplete";
    }
    if (progress === "partiallyComplete") {
      return "in-progress";
    }
    if (progress === "complete") {
      return "enabled";
    }
    return icon;
  };

  return (
    <SBadge ref={ref} tone={resolvedTone} color={color} icon={resolveIcon()} {...rest}>
      {children}
    </SBadge>
  );
});

import { forwardRef } from "react";
import { createWebComponent } from "../../core/createWebComponent";
import type { BannerPropsType } from "./Banner.types";

const SBanner = createWebComponent<HTMLElement, { onDismiss: "dismiss" }>("s-banner", {
  events: { onDismiss: "dismiss" },
});

/**
 * Banner component wrapping Polaris `<s-banner>`.
 * Supports modern `heading`, `dismissible`, `icon` as well as legacy `title`, `status`, `onDismiss`.
 */
export const Banner = forwardRef<HTMLElement, BannerPropsType>(function Banner(
  { children, title, heading, status, tone, onDismiss, dismissible, icon, ...rest },
  ref,
) {
  const resolvedHeading = heading ?? title;
  const resolvedTone = tone ?? status;
  const resolvedDismissible = dismissible ?? (onDismiss ? true : undefined);

  return (
    <SBanner
      ref={ref}
      heading={resolvedHeading}
      tone={resolvedTone}
      dismissible={resolvedDismissible}
      icon={icon}
      onDismiss={onDismiss}
      {...rest}
    >
      {children}
    </SBanner>
  );
});

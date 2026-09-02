import { forwardRef } from "react";
import { createWebComponent } from "../../core/createWebComponent";
import type { BannerProps } from "./Banner.types";

const SBanner = createWebComponent<HTMLElement, { onDismiss: "dismiss" }>("s-banner", {
  events: { onDismiss: "dismiss" },
});

export const Banner = forwardRef<HTMLElement, BannerProps>(function Banner(
  { children, title, status, tone, onDismiss, ...rest },
  ref,
) {
  return (
    <SBanner
      ref={ref}
      heading={title}
      tone={tone ?? status}
      dismissible={onDismiss ? true : undefined}
      onDismiss={onDismiss}
      {...rest}
    >
      {children}
    </SBanner>
  );
});

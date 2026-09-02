import { forwardRef } from "react";
import { createWebComponent } from "../../core/createWebComponent";
import type { LinkProps } from "./Link.types";

const SLink = createWebComponent<HTMLElement, { onClick: "click" }>("s-link", {
  events: { onClick: "click" },
});

/** Thin wrapper: legacy `url` maps to `href`, same translation `Button` uses. */
export const Link = forwardRef<HTMLElement, LinkProps>(function Link(
  { children, url, external, ...rest },
  ref,
) {
  return (
    <SLink
      ref={ref}
      href={url}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      {...rest}
    >
      {children}
    </SLink>
  );
});

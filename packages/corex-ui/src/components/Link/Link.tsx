import { forwardRef, type CSSProperties } from "react";
import { createWebComponent } from "../../core/createWebComponent";
import type { LinkPropsType } from "./Link.types";

const SLink = createWebComponent<HTMLElement, { onClick: "click" }>("s-link", {
  events: { onClick: "click" },
});

/**
 * Link component wrapping Polaris `<s-link>`.
 * Supports modern `href`, `target`, `rel`, `download` as well as legacy `url`, `external`, `monochrome`, and `removeUnderline`.
 */
export const Link = forwardRef<HTMLElement, LinkPropsType>(function Link(
  {
    children,
    url,
    href,
    external,
    target,
    rel,
    download,
    monochrome,
    removeUnderline,
    style,
    className,
    ...rest
  },
  ref,
) {
  const resolvedHref = href ?? url;
  const resolvedTarget = target ?? (external ? "_blank" : undefined);
  const resolvedRel = rel ?? (external ? "noopener noreferrer" : undefined);
  const resolvedDownload =
    typeof download === "boolean" ? (download ? "" : undefined) : download;

  const combinedStyles: CSSProperties = {
    ...(monochrome ? { color: "inherit" } : {}),
    ...(removeUnderline ? { textDecoration: "none" } : {}),
    ...style,
  };

  return (
    <SLink
      ref={ref}
      href={resolvedHref}
      target={resolvedTarget}
      rel={resolvedRel}
      download={resolvedDownload}
      style={combinedStyles}
      className={className}
      {...rest}
    >
      {children}
    </SLink>
  );
});

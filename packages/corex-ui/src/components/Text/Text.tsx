import { forwardRef } from "react";
import { createWebComponent } from "../../core/createWebComponent";
import type { TextProps } from "./Text.types";

const SText = createWebComponent<HTMLElement>("s-text");
const SHeading = createWebComponent<HTMLElement>("s-heading");

/**
 * Thin wrapper over `s-text`. Legacy `as` (custom rendered tag) has no
 * equivalent on the web component, which always renders as its own element;
 * it's accepted for API compatibility but has no visual effect.
 */
export const Text = forwardRef<HTMLElement, TextProps>(function Text(
  { children, as: _as, truncate: _truncate, variant, ...rest },
  ref,
) {
  if (variant?.startsWith("heading")) {
    return <SHeading ref={ref} data-legacy-variant={variant} {...rest}>{children}</SHeading>;
  }

  return (
    <SText ref={ref} {...rest}>
      {children}
    </SText>
  );
});

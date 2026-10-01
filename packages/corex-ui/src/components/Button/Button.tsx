import { forwardRef } from "react";
import { childrenText } from "../../core/childrenText";
import { createWebComponent } from "../../core/createWebComponent";
import { devWarning } from "../../utils/devWarning";
import type { ButtonPropsType } from "./Button.types";

const SButton = createWebComponent<HTMLElement, { onClick: "click" }>("s-button", {
  events: { onClick: "click" },
});

/**
 * Button component wrapping Polaris `<s-button>`.
 * Translates legacy boolean flags (`primary`, `destructive`, `plain`, `outline`)
 * onto modern `variant`/`tone` attributes while accepting `variant`/`tone` directly.
 */
export const Button = forwardRef<HTMLElement, ButtonPropsType>(function Button(
  {
    children,
    primary,
    destructive,
    plain,
    outline,
    variant,
    tone,
    url,
    href,
    target,
    external,
    submit,
    type,
    accessibilityLabel,
    fullWidth,
    style,
    ...rest
  },
  ref,
) {
  if (style !== undefined) {
    devWarning("Button", "Inline styles are not supported on Button and are ignored.");
  }
  const resolvedVariant =
    variant ??
    (primary ? "primary" : plain ? "tertiary" : outline ? "secondary" : undefined);
  const resolvedTone = tone ?? (destructive ? "critical" : undefined);
  const resolvedType = type ?? (submit ? "submit" : undefined);
  const resolvedHref = href ?? url;
  const resolvedTarget = target ?? (external ? "_blank" : undefined);
  const resolvedRel = external || target == "_blank" ? "noopener noreferrer" : undefined;

  // `children` is an array whenever the button holds a glyph alongside its
  // label, so the accessible name has to come from the text found anywhere in
  // the subtree rather than from `children` being a bare string.
  const labelFromChildren = childrenText(children);
  if (!accessibilityLabel && !labelFromChildren) {
    devWarning(
      "Button",
      "A button with no text children needs an `accessibilityLabel`; screen readers have nothing to announce otherwise.",
    );
  }
  const resolvedAccessibilityLabel =
    accessibilityLabel ||
    labelFromChildren ||
    `Action${resolvedVariant ? ` ${resolvedVariant}` : ""}`;

  return (
    <SButton
      ref={ref}
      variant={resolvedVariant}
      tone={resolvedTone}
      type={resolvedType}
      href={resolvedHref}
      target={resolvedTarget}
      rel={resolvedRel}
      accessibilityLabel={resolvedAccessibilityLabel}
      inlineSize={rest.inlineSize ?? (fullWidth ? "fill" : undefined)}
      {...rest}
    >
      {children}
    </SButton>
  );
});

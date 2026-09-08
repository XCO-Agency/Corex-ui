import { forwardRef } from "react";
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
    ...rest
  },
  ref,
) {
  const resolvedVariant =
    variant ??
    (primary ? "primary" : plain ? "tertiary" : outline ? "secondary" : undefined);
  const resolvedTone = tone ?? (destructive ? "critical" : undefined);
  const resolvedType = type ?? (submit ? "submit" : undefined);
  const resolvedHref = href ?? url;
  const resolvedTarget = target ?? (external ? "_blank" : undefined);
  const resolvedRel = external || target == "_blank" ? "noopener noreferrer" : undefined;

  return (
    <SButton
      ref={ref}
      variant={resolvedVariant}
      tone={resolvedTone}
      type={resolvedType}
      href={resolvedHref}
      target={resolvedTarget}
      rel={resolvedRel}
      accessibilityLabel={
        accessibilityLabel ??
        (typeof children === "string" ? children : `Action  ${resolvedVariant}`)
      }
      inlineSize={rest.inlineSize ?? (fullWidth ? "fill" : undefined)}
      {...rest}
    >
      {children}
    </SButton>
  );
});

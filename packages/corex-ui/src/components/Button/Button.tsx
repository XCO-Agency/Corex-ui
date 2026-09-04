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
    content,
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
    pressed,
    command,
    commandFor,
    interestFor,
    ...rest
  },
  ref,
) {
  const resolvedVariant =
    variant ??
    (primary ? "primary" : plain ? "plain" : outline ? "secondary" : undefined);
  const resolvedTone = tone ?? (destructive ? "critical" : undefined);
  const resolvedType = type ?? (submit ? "submit" : undefined);
  const resolvedHref = href ?? url;
  const resolvedTarget = target ?? (external ? "_blank" : undefined);
  const resolvedRel = external ? "noopener noreferrer" : undefined;

  if (pressed !== undefined) {
    devWarning(
      "Button",
      "`pressed` has no confirmed equivalent on the Polaris web component `s-button`; verify against your installed polaris-1.js before relying on it.",
    );
  }

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
        accessibilityLabel ?? (typeof content === "string" ? content : undefined)
      }
      fullWidth={fullWidth}
      pressed={pressed}
      command={command}
      commandFor={commandFor}
      interestFor={interestFor}
      {...rest}
    >
      {content ?? children}
    </SButton>
  );
});

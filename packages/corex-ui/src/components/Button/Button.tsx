import { forwardRef } from "react";
import { createWebComponent } from "../../core/createWebComponent";
import { devWarning } from "../../utils/devWarning";
import type { ButtonProps } from "./Button.types";

const SButton = createWebComponent<HTMLElement, { onClick: "click" }>("s-button", {
  events: { onClick: "click" },
});

/**
 * Thin-wrapper pattern: legacy boolean flags (`primary`, `destructive`,
 * `plain`) are translated onto the new `variant`/`tone` attributes so
 * existing call sites keep working, while `variant`/`tone` remain available
 * directly for new code.
 */
export const Button = forwardRef<HTMLElement, ButtonProps>(function Button(
  {
    children,
    content,
    primary,
    destructive,
    plain,
    variant,
    tone,
    url,
    external,
    accessibilityLabel,
    fullWidth,
    pressed,
    ...rest
  },
  ref,
) {
  const resolvedVariant = variant ?? (primary ? "primary" : plain ? "plain" : undefined);
  const resolvedTone = tone ?? (destructive ? "critical" : undefined);

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
      href={url}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      accessibilityLabel={accessibilityLabel ?? (typeof content === "string" ? content : undefined)}
      fullWidth={fullWidth}
      pressed={pressed}
      {...rest}
    >
      {content ?? children}
    </SButton>
  );
});

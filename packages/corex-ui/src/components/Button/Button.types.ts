import type { CSSProperties, ReactNode } from "react";
import type { ButtonVariantType, PolarisPropsType } from "../../types/common";

type NativeButtonProps = PolarisPropsType<"s-button">;

export type ButtonSizeType = "micro" | "slim" | "medium" | "large";

export type ButtonPropsType = Omit<NativeButtonProps, "variant" | "tone"> & {
  variant?: ButtonVariantType;
  /**
   * v12's sizes. `s-button` has one height and the library ships no stylesheet to
   * override it, so these are accepted and ignored, with a development warning.
   * For dense rows, `variant="tertiary"` is the quiet control.
   */
  size?: ButtonSizeType;
  /**
   * `s-button`'s tones, plus v12's `success` and `magic`, which fall back to
   * `auto`: the admin does not draw a filled green or violet button.
   */
  tone?: NativeButtonProps["tone"] | "success" | "magic";
  /** Renders the button as a link to this URL (legacy alias for `href`). */
  /** @deprecated Use `href`. Kept for legacy-API compatibility. */
  url?: string;
  /** @deprecated Use `target`. Kept for legacy-API compatibility. */
  external?: boolean;
  /** Sets button type to submit. */
  submit?: boolean;
  /** @deprecated Use `variant="primary"`. Kept for legacy-API compatibility. */
  primary?: boolean;
  /** @deprecated Use `tone="critical"`. Kept for legacy-API compatibility. */
  destructive?: boolean;
  /** @deprecated Use `variant="plain"`. Kept for legacy-API compatibility. */
  plain?: boolean;
  /** @deprecated Use `variant="secondary"`. Kept for legacy-API compatibility. */
  outline?: boolean;
  /** @deprecated Kept for legacy-API compatibility. */
  monochrome?: boolean;
  /** @deprecated Use `inlineSize="fill"`. */
  fullWidth?: boolean;
  /** @deprecated Inline styles are not supported on web component Button and are stripped. */
  style?: CSSProperties;
};

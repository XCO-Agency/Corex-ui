import type { CSSProperties, ReactNode } from "react";
import type { PolarisPropsType } from "../../types/common";

type NativeButtonProps = PolarisPropsType<"s-button">;

export type ButtonPropsType = NativeButtonProps & {
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
  /** Suppresses React hydration warnings when web component attributes are mutated externally. */
  suppressHydrationWarning?: boolean;
  /** Size token supported by Polaris Button. */
  size?: import("../../types/common").SizeType;
};

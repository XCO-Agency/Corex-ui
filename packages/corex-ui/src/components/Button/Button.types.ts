import type { CSSProperties, ReactNode } from "react";
import type { PolarisPropsType } from "../../types/common";

type NativeButtonProps = PolarisPropsType<"s-button">;

export type ButtonPropsType = NativeButtonProps & {
  /** @deprecated Use children instead */
  content?: ReactNode;
  /** Renders the button as a link to this URL (legacy alias for `href`). */
  url?: string;
  /** Opens `url` in a new tab. */
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
  /** Visual pressed state indicator. */
  pressed?: boolean;
  className?: string;
  style?: CSSProperties;
};

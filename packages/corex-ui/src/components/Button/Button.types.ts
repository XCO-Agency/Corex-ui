import type { CSSProperties, ReactNode } from "react";
import type {
  ButtonVariantType,
  IconType,
  PolarisPropsType,
  SizeType,
  TargetType,
  ToneType,
} from "../../types/common";

type NativeButtonProps = PolarisPropsType<"s-button">;

export type ButtonType = "button" | "submit" | "reset" | (string & {});

export type ButtonPropsType = Omit<
  NativeButtonProps,
  "variant" | "tone" | "size" | "type" | "target" | "children"
> & {
  children?: ReactNode;
  /** Alias for `children`, matching legacy `Button` usage (`<Button content="Save" />`). */
  content?: ReactNode;
  onClick?: (event: MouseEvent) => void;
  /** Renders the button as a link to this URL (legacy alias for `href`). */
  url?: string;
  /** Target browsing context for links ('_blank' | '_self' | '_parent' | '_top'). */
  target?: TargetType;
  /** Opens `url` in a new tab. */
  external?: boolean;
  /** Sets button type to submit. */
  submit?: boolean;
  /** Button HTML type. */
  type?: ButtonType;
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
  /** Button visual variant ('primary' | 'secondary' | 'tertiary' | 'plain'). */
  variant?: ButtonVariantType;
  /** Button visual tone ('critical' | 'success' | 'neutral' | 'auto'). */
  tone?: ToneType | "auto";
  /** Button size ('small' | 'medium' | 'large'). */
  size?: SizeType;
  /** Expands button to fill full available inline width. */
  fullWidth?: boolean;
  /** Visual pressed state indicator. */
  pressed?: boolean;
  className?: string;
  style?: CSSProperties;
  /** Icon to render in the button. */
  icon?: IconType;
  [key: `aria-${string}`]: unknown;
  [key: `data-${string}`]: unknown;
};

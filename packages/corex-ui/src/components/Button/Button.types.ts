import type { CSSProperties, ReactNode } from "react";
import type {
  ButtonVariant,
  ButtonVariantType,
  Size,
  SizeType,
  TargetType,
  ToneType,
} from "../../types/common";

export type ButtonType = "button" | "submit" | "reset" | (string & {});

export type ButtonPropsType = {
  children?: ReactNode;
  /** Alias for `children`, matching legacy `Button` usage (`<Button content="Save" />`). */
  content?: ReactNode;
  onClick?: (event: MouseEvent) => void;
  /** Renders the button as a link to this URL. */
  url?: string;
  /** URL to navigate to (modern web component prop). */
  href?: string;
  /** Target browsing context for links ('_blank' | '_self' | '_parent' | '_top'). */
  target?: TargetType;
  /** Opens `url` in a new tab. */
  external?: boolean;
  disabled?: boolean;
  loading?: boolean;
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
  variant?: ButtonVariantType | ButtonVariant;
  /** Button visual tone ('critical' | 'success' | 'neutral' | 'auto'). */
  tone?: ToneType | "auto";
  /** Button size ('small' | 'medium' | 'large'). */
  size?: SizeType | Size;
  /** Expands button to fill full available inline width. */
  fullWidth?: boolean;
  /** Visual pressed state indicator. */
  pressed?: boolean;
  accessibilityLabel?: string;
  id?: string;
  className?: string;
  style?: CSSProperties;
  /** Standard HTML slot attribute, used to place this Button into a parent's named slot. */
  slot?: string;
  /** Icon to render in the button. */
  icon?: string;
  /**
   * The Invoker Commands declarative trigger pattern (e.g. `command="--show"`).
   */
  command?: string;
  /** The `id` of the element `command` acts on. */
  commandFor?: string;
  /** Popover interest trigger target ID. */
  interestFor?: string;
  /** Text alignment inside button. */
  textAlign?: "left" | "right" | "center";
  role?: string;
  ariaExpanded?: boolean;
  ariaControls?: string;
  [key: `aria-${string}`]: unknown;
  [key: `data-${string}`]: unknown;
};

export type ButtonProps = ButtonPropsType;

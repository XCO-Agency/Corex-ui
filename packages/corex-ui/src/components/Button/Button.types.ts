import type { ReactNode } from "react";
import type { ButtonVariant, Size } from "../../types/common";

export interface ButtonProps {
  children?: ReactNode;
  /** Alias for `children`, matching legacy `Button` usage (`<Button content="Save" />`). */
  content?: ReactNode;
  onClick?: (event: MouseEvent) => void;
  /** Renders the button as a link to this URL. */
  url?: string;
  /** Opens `url` in a new tab. */
  external?: boolean;
  disabled?: boolean;
  loading?: boolean;
  submit?: boolean;
  /** @deprecated Use `variant="primary"`. Kept for legacy-API compatibility. */
  primary?: boolean;
  /** @deprecated Use `tone="critical"`. Kept for legacy-API compatibility. */
  destructive?: boolean;
  /** @deprecated Use `variant="plain"`. Kept for legacy-API compatibility. */
  plain?: boolean;
  variant?: ButtonVariant;
  tone?: "critical" | "success" | "neutral";
  size?: Size;
  fullWidth?: boolean;
  pressed?: boolean;
  accessibilityLabel?: string;
  id?: string;
  className?: string;
  /** Standard HTML slot attribute, used to place this Button into a parent's named slot (e.g. a Modal's action area). */
  slot?: string;
}

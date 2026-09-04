import type { CSSProperties, ReactNode } from "react";
import type { TargetType } from "../../types/common";

export type LinkPropsType = {
  children?: ReactNode;
  /** Legacy Polaris URL prop. */
  url?: string;
  /** Modern web component href prop. */
  href?: string;
  onClick?: (event: MouseEvent) => void;
  /** Opens link in new browsing tab. */
  external?: boolean;
  /** Target browsing context ('_blank' | '_self' | '_parent' | '_top'). */
  target?: TargetType;
  /** Target link relationship (e.g. 'noopener noreferrer'). */
  rel?: string;
  /** Prompts the user to save the linked URL instead of navigating. */
  download?: boolean | string;
  /** @deprecated Kept for legacy-API compatibility. */
  monochrome?: boolean;
  /** @deprecated Kept for legacy-API compatibility. */
  removeUnderline?: boolean;
  id?: string;
  className?: string;
  style?: CSSProperties;
  /** Standard HTML slot attribute, used to place this Link into a parent's named slot. */
  slot?: string;
  accessibilityLabel?: string;
  [key: `aria-${string}`]: unknown;
  [key: `data-${string}`]: unknown;
};

export type LinkProps = LinkPropsType;

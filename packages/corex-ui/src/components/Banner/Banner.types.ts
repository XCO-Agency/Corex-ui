import type { CSSProperties, ReactNode } from "react";
import type { Tone, ToneType } from "../../types/common";

export type BannerActionType = {
  content: string;
  onAction?: () => void;
  url?: string;
  external?: boolean;
};

export type BannerPropsType = {
  children?: ReactNode;
  /** Modern Polaris web component heading prop. */
  heading?: ReactNode;
  /** Legacy Polaris banner title prop. */
  title?: ReactNode;
  /** Modern Polaris banner tone ('info' | 'success' | 'warning' | 'critical'). */
  tone?: ToneType | Tone;
  /** @deprecated Use `tone`. Kept for legacy-API compatibility. */
  status?: ToneType | Tone;
  /** Callback fired when the banner is dismissed. Automatically enables dismissible button. */
  onDismiss?: () => void;
  /** Sets whether banner displays a dismiss button. */
  dismissible?: boolean;
  /** Optional icon name for the banner. */
  icon?: string;
  /** Primary banner action. */
  action?: BannerActionType;
  /** Secondary banner action. */
  secondaryAction?: BannerActionType;
  className?: string;
  id?: string;
  style?: CSSProperties;
  [key: `aria-${string}`]: unknown;
  [key: `data-${string}`]: unknown;
};

export type BannerProps = BannerPropsType;

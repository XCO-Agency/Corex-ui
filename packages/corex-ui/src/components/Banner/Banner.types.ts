import type { CSSProperties, ReactNode } from "react";
import type { PolarisPropsType, ToneType } from "../../types/common";

type NativeBannerProps = PolarisPropsType<"s-banner">;

export type BannerActionType = {
  content: string;
  onAction?: () => void;
  url?: string;
  external?: boolean;
};

export type BannerPropsType = Omit<
  NativeBannerProps,
  "heading" | "tone" | "children"
> & {
  children?: ReactNode;
  /** Modern Polaris web component heading prop. */
  heading?: ReactNode;
  /** Legacy Polaris banner title prop. */
  title?: ReactNode;
  /** Modern Polaris banner tone ('info' | 'success' | 'warning' | 'critical'). */
  tone?: ToneType;
  /** @deprecated Use `tone`. Kept for legacy-API compatibility. */
  status?: ToneType;
  /** Custom icon to display in the banner. */
  icon?: ReactNode;
  /** Callback fired when the banner is dismissed. Automatically enables dismissible button. */
  onDismiss?: () => void;
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

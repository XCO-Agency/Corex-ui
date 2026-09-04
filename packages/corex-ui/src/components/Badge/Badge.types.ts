import type { CSSProperties, ReactNode } from "react";
import type { Size, SizeType, Tone, ToneType } from "../../types/common";

export type BadgeStatusType =
  | "success"
  | "info"
  | "attention"
  | "warning"
  | "critical"
  | "new";

export type BadgePropsType = {
  children?: ReactNode;
  /** Modern Polaris badge tone. */
  tone?: ToneType | Tone | "auto";
  /** @deprecated Use `tone`. Kept for legacy-API compatibility. */
  status?: BadgeStatusType;
  /** Badge size ('small' | 'medium' | 'large'). */
  size?: SizeType | Size;
  /** Visual indicator of progress status. */
  progress?: "incomplete" | "partiallyComplete" | "complete";
  /** Optional badge icon name. */
  icon?: string;
  /** Custom badge color or tone alias. */
  color?: string;
  accessibilityLabel?: string;
  className?: string;
  id?: string;
  style?: CSSProperties;
  /** Standard HTML slot attribute, e.g. placing a Badge into a Page's `accessory` slot. */
  slot?: string;
  [key: `aria-${string}`]: unknown;
  [key: `data-${string}`]: unknown;
};

export type BadgeProps = BadgePropsType;

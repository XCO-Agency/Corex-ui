import type { CSSProperties, ReactNode } from "react";
import type {
  PolarisPropsType,
  SizeType,
  ToneType,
} from "../../types/common";

type NativeBadgeProps = PolarisPropsType<"s-badge">;

export type BadgeStatusType =
  | "success"
  | "info"
  | "attention"
  | "warning"
  | "critical"
  | "new";

export type BadgePropsType = Omit<
  NativeBadgeProps,
  "tone" | "size" | "children"
> & {
  children?: ReactNode;
  /** Modern Polaris badge tone. */
  tone?: ToneType | "auto";
  /** @deprecated Use `tone`. Kept for legacy-API compatibility. */
  status?: BadgeStatusType;
  /** Badge size ('small' | 'medium' | 'large'). */
  size?: SizeType;
  /** Visual indicator of progress status. */
  progress?: "incomplete" | "partiallyComplete" | "complete";
  className?: string;
  id?: string;
  style?: CSSProperties;
  slot?: string;
  [key: `aria-${string}`]: unknown;
  [key: `data-${string}`]: unknown;
};

import type { CSSProperties, ReactNode } from "react";
import type { PolarisPropsType, SizeType, ToneType } from "../../types/common";

type NativeBadgeProps = PolarisPropsType<"s-badge">;

export type BadgeStatusType =
  "success" | "info" | "caution" | "warning" | "critical" | "new";

export type BadgeLegacyToneType = "attention" | "magic";

export type BadgePropsType = Omit<NativeBadgeProps, "children" | "tone"> & {
  children?: ReactNode;
  /**
   * `s-badge`'s tones, plus v12's `attention` and `magic`. `attention` is a caution
   * by another name; `magic` marked AI features and reads closest to `info`.
   */
  tone?: NativeBadgeProps["tone"] | BadgeLegacyToneType;
  /** Modern Polaris badge tone. */
  /** @deprecated Use `tone`. Kept for legacy-API compatibility. */
  status?: BadgeStatusType;
  /** Visual indicator of progress status. */
  progress?: "incomplete" | "partiallyComplete" | "complete";
  className?: string;
  id?: string;
  style?: CSSProperties;
  slot?: string;
  [key: `aria-${string}`]: unknown;
  [key: `data-${string}`]: unknown;
};

import type { CSSProperties, ReactNode } from "react";
import { IconType, ToneType, SparklineColorType } from "../../types/common";

// ─── Prop types ────────────────────────────────────────────────────────────────
export type MetricCardBadgeType = {
  value: string | number | null | undefined;
  tone?: ToneType;
  dir?: "up" | "down";
};

export type MetricCardPropsType = {
  id: string;
  title: string;
  value: ReactNode;
  tooltip?: ReactNode;
  icon?: IconType;
  iconTone?: ToneType;
  badge?: MetricCardBadgeType;
  /** Time-series — one number per day/interval, oldest first. */
  sparklineData?: number[];
  sparklineColor?: SparklineColorType;
  sparklineWidth?: number;
  sparklineHeight?: number;
  onClick?: () => void;
};

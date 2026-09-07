import type { CSSProperties, ReactNode } from "react";
import { IconType, ToneType, SparklineColorType } from "../../types/common";

export type SparklinePropsType = {
  data: number[];
  width?: number;
  height?: number;
  color?: string;
  strokeWidth?: number;
  showArea?: boolean;
  showEndpoint?: boolean;
};

// ─── Prop types ────────────────────────────────────────────────────────────────
export type MetricCardBadgeType = {
  value: string | number | null | undefined;
  tone?: ToneType;
  dir?: "up" | "down";
};

export type MetricCardPropsType = {
  id?: string;
  title: string;
  fetching?: boolean;
  /**
   * Drops this card's own border/background — use uniformly across a group
   * of cards when any one of them is expanded, so they read as one grouped
   * surface (e.g. inside a `Collapsible` wrapper) instead of each keeping
   * its own outline.
   */
  expanded?: boolean;
  /**
   * Highlights this specific card as the active/selected one within a group,
   * independent of `expanded`. Use it to mark which card's content is
   * currently shown (tab-like selection) without affecting the others.
   */
  pressed?: boolean;
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

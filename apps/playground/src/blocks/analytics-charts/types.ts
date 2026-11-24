import type { ReactNode } from "react";

export type PeriodRangeType = {
  /** First day of the previous period (YYYY-MM-DD). */
  previousFrom: string;
  /** First day of the current period (YYYY-MM-DD). */
  currentFrom: string;
  /** Last day of the current period (YYYY-MM-DD). */
  to: string;
};

export type PeriodSeriesType = {
  /** The current period's days, oldest first. */
  dates: string[];
  current: number[];
  /** The previous period's days, as many as the current one's. */
  previousDates: string[];
  /** Null when the previous period has no data at all. */
  previous: number[] | null;
};

export type ChangeIndicatorPropsType = {
  /** Percent change; nothing renders for null. */
  pct: number | null;
  /** Read out instead of the arrow, e.g. "Up 34% from the previous period". */
  label?: string;
};

export type ChartCardPropsType = {
  title: string;
  /** What the number means; shown on hover of the dotted-underlined title. */
  definition?: ReactNode;
  /** The headline figure, as shown. */
  value?: string;
  /** Percent change next to the value. */
  change?: number | null;
  /** Accessible label for the change. */
  changeLabel?: string;
  /** Rendered at the end of the title row, e.g. a button or popover. */
  action?: ReactNode;
  children: ReactNode;
};

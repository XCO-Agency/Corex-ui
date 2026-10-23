import type { CalendarDensityType } from "./Calendar.types";

export const COMPACT_BREAKPOINT = 640;

export type DensityMetricsType = {
  laneHeight: number;
  dayNumberHeight: number;
  minRowHeight: number;
  slotHeight: number;
};

export const DENSITY_METRICS: Record<CalendarDensityType, DensityMetricsType> = {
  comfortable: { laneHeight: 22, dayNumberHeight: 30, minRowHeight: 112, slotHeight: 28 },
  compact: { laneHeight: 18, dayNumberHeight: 24, minRowHeight: 84, slotHeight: 20 },
};

/** Max rendered height of the time-grid scroller when `height="auto"`. */
export const AUTO_TIME_GRID_HEIGHT = 640;

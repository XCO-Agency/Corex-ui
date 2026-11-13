import type { ReactNode } from "react";

export type ValueFormatterType = (value: number) => string;
export type DateFormatterType = (date: string) => string;

export type LineSeriesType = {
  id: string;
  label: string;
  values: number[];
  /** Overrides the default (blue for current, pale blue when `dashed`). */
  color?: string;
  /** Shopify's comparison style: a light dashed line. */
  dashed?: boolean;
  /** The days this series' values belong to, for its tooltip row. Defaults to the chart's `dates`. */
  dates?: string[];
};

export type LineChartPropsType = {
  series: LineSeriesType[];
  /** The x axis: one entry per point, passed to `formatDate`. */
  dates: string[];
  /** Accessible name of the chart. */
  ariaLabel: string;
  formatValue: ValueFormatterType;
  /** Y axis labels. Defaults to `formatValue`. */
  formatTick?: ValueFormatterType;
  formatDate: DateFormatterType;
  /** @default 220 */
  height?: number;
  /** Show the legend under the chart. @default true */
  legend?: boolean;
};

export type ColumnDatumType = {
  date: string;
  value: number;
  /** The previous period's value on the matching day, when one exists. */
  comparison?: number;
};

export type ColumnChartPropsType = {
  data: ColumnDatumType[];
  ariaLabel: string;
  /** The series' legend / tooltip label. */
  label: string;
  /** Legend label for the comparison bars. */
  comparisonLabel?: string;
  /** The comparison bars' days, aligned with `data`, for the tooltip. */
  comparisonDates?: string[];
  formatValue: ValueFormatterType;
  formatTick?: ValueFormatterType;
  formatDate: DateFormatterType;
  /** @default 220 */
  height?: number;
};

export type FunnelStageType = {
  id: string;
  label: string;
  /** What the stage counts, shown as a tooltip on its label. */
  help?: string;
  value: number;
  /** The stage's share of the first stage, in percent; null when unknown. */
  share: number | null;
  /** The share as shown ("38%", or "—"). */
  shareDisplay: string;
  /** The count as shown. */
  display: string;
  /** Below the count, e.g. "38% of the previous step". */
  note?: string;
  /** Percent change from the previous period. */
  change?: number | null;
};

export type FunnelChartPropsType = {
  stages: FunnelStageType[];
  ariaLabel: string;
};

export type BarListItemType = {
  id: string;
  label: string;
  value: number;
  /** The value as shown. */
  display: string;
  /** Percent change from the previous period, when one exists. */
  change?: number | null;
};

export type HorizontalBarListPropsType = {
  items: BarListItemType[];
  ariaLabel: string;
};

export type DonutSliceType = {
  id: string;
  label: string;
  value: number;
  /** The value as shown. */
  display: string;
};

export type DonutChartPropsType = {
  slices: DonutSliceType[];
  /** The centre figure, as shown. */
  total: string;
  /** Under the centre figure, e.g. "Total". */
  totalLabel: string;
  ariaLabel: string;
  /** @default 160 */
  size?: number;
};

export type SparklinePropsType = {
  values: number[];
  ariaLabel: string;
  /** @default 96 */
  width?: number;
  /** @default 28 */
  height?: number;
  /** @default CHART.primary */
  color?: string;
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

export type TooltipRowType = {
  color: string;
  label: string;
  value: string;
  dashed?: boolean;
};

export type ChartTooltipPropsType = {
  /** The hovered point's x, in px from the container's left. */
  x: number;
  containerWidth: number;
  heading?: string;
  rows: TooltipRowType[];
  children?: ReactNode;
};

export type LegendItemType = {
  color: string;
  label: string;
  dashed?: boolean;
};

export type ChartLegendPropsType = {
  items: LegendItemType[];
};

export type SeriesMarkerPropsType = {
  color: string;
  dashed?: boolean;
};

export type AxisLabelType = {
  x: number;
  text: string;
  anchor?: "start" | "middle" | "end";
};

export type YAxisGridPropsType = {
  ticks: number[];
  max: number;
  left: number;
  right: number;
  top: number;
  plotHeight: number;
  format: ValueFormatterType;
};

export type XAxisLabelsPropsType = {
  labels: AxisLabelType[];
  y: number;
};

export type ValueScaleType = {
  ticks: number[];
  /** The top the plot scales to (the last tick). */
  max: number;
};

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

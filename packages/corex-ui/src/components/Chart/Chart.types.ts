import type { ReactNode } from "react";

export type ChartValueFormatterType = (value: number) => string;
export type ChartDateFormatterType = (date: string) => string;

export type ChartLineSeriesType = {
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

export type ChartLinePropsType = {
  series: ChartLineSeriesType[];
  /** The x axis: one entry per point, passed to `formatDate`. */
  dates: string[];
  /** Accessible name of the chart. */
  ariaLabel: string;
  formatValue: ChartValueFormatterType;
  /** Y axis labels. Defaults to `formatValue`. */
  formatTick?: ChartValueFormatterType;
  formatDate: ChartDateFormatterType;
  /** @default 220 */
  height?: number;
  /** Show the legend under the chart. @default true */
  legend?: boolean;
};

export type ChartBarDatumType = {
  date: string;
  value: number;
  /** The previous period's value on the matching day, when one exists. */
  comparison?: number;
};

export type ChartBarPropsType = {
  data: ChartBarDatumType[];
  ariaLabel: string;
  /** The series' legend / tooltip label. */
  label: string;
  /** Legend label for the comparison bars. */
  comparisonLabel?: string;
  /** The comparison bars' days, aligned with `data`, for the tooltip. */
  comparisonDates?: string[];
  formatValue: ChartValueFormatterType;
  formatTick?: ChartValueFormatterType;
  formatDate: ChartDateFormatterType;
  /** @default 220 */
  height?: number;
};

export type ChartFunnelStageType = {
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

export type ChartFunnelPropsType = {
  stages: ChartFunnelStageType[];
  ariaLabel: string;
};

export type ChartBarListItemType = {
  id: string;
  label: string;
  value: number;
  /** The value as shown. */
  display: string;
  /** Percent change from the previous period, when one exists. */
  change?: number | null;
};

export type ChartBarListPropsType = {
  items: ChartBarListItemType[];
  ariaLabel: string;
};

export type ChartDonutSliceType = {
  id: string;
  label: string;
  value: number;
  /** The value as shown. */
  display: string;
};

export type ChartDonutPropsType = {
  slices: ChartDonutSliceType[];
  /** The centre figure, as shown. */
  total: string;
  /** Under the centre figure, e.g. "Total". */
  totalLabel: string;
  ariaLabel: string;
  /** @default 160 */
  size?: number;
};

export type ChartSparklinePropsType = {
  values: number[];
  ariaLabel: string;
  /** @default 96 */
  width?: number;
  /** @default 28 */
  height?: number;
  /** @default CHART_COLORS.primary */
  color?: string;
};

export type ChartTooltipRowType = {
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
  rows: ChartTooltipRowType[];
  children?: ReactNode;
};

export type ChartLegendItemType = {
  color: string;
  label: string;
  dashed?: boolean;
};

export type ChartLegendPropsType = {
  items: ChartLegendItemType[];
};

export type ChartSeriesMarkerPropsType = {
  color: string;
  dashed?: boolean;
};

export type ChartAxisLabelType = {
  x: number;
  text: string;
  anchor?: "start" | "middle" | "end";
};

export type ChartYAxisGridPropsType = {
  ticks: number[];
  max: number;
  left: number;
  right: number;
  top: number;
  plotHeight: number;
  format: ChartValueFormatterType;
};

export type ChartXAxisLabelsPropsType = {
  labels: ChartAxisLabelType[];
  y: number;
};

export type ChartValueScaleType = {
  ticks: number[];
  /** The top the plot scales to (the last tick). */
  max: number;
};

export type ChartChangePropsType = {
  /** Percent change; nothing renders for null. */
  pct: number | null;
  /** Read out instead of the arrow, e.g. "Up 34% from the previous period". */
  label?: string;
};

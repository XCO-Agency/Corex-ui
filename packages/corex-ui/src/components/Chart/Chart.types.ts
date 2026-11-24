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
  /**
   * `smooth` draws a curve through the points that never overshoots them;
   * `sharp` joins them with straight segments. @default "smooth"
   */
  curve?: "smooth" | "sharp";
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
  /** Extra rows in the hover card, e.g. `{ label: "Drop-off", value: "−62%" }`. */
  details?: { label: string; value: string }[];
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
  /** Shown before the label, e.g. a flag or an icon. */
  leading?: ReactNode;
};

export type ChartBarListPropsType = {
  items: ChartBarListItemType[];
  ariaLabel: string;
  /**
   * What each share is of. Defaults to the sum of `items`; pass the full
   * total when `items` is only the top few, so a row doesn't overstate its share.
   */
  total?: number;
  /**
   * Keep rows compact (label, share and bar) and show the value and change in
   * a hover card. Set `false` to print them in the row instead, for places
   * with no hover. @default true
   */
  tooltip?: boolean;
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
  /** Names the chart for assistive tech. Without it the sparkline is decorative. */
  ariaLabel?: string;
  /** @default 64 */
  width?: number;
  /** @default 20 */
  height?: number;
  /** A tone ("success", "critical", …) or any CSS colour. @default a neutral grey */
  color?: string;
  /** @default 1.8 */
  strokeWidth?: number;
  /** Show the faint gradient under the line. @default true */
  showArea?: boolean;
  /** Show the dot on the last point. @default true */
  showEndpoint?: boolean;
};

export type ChartTooltipRowType = {
  color: string;
  label: string;
  value: string;
  dashed?: boolean;
};

export type ChartTooltipPropsType = {
  /** The hovered element's centre, in px from the container's left. */
  x: number;
  /** The hovered element's width in px, so the card clears it. @default 0 (a point) */
  anchorWidth?: number;
  containerWidth: number;
  heading?: string;
  rows: ChartTooltipRowType[];
  children?: ReactNode;
  /**
   * `inside` puts the card at the top of the container, beside the anchor.
   * `above` and `below` put it outside the container's box, so the hovered
   * element stays in view. @default "inside"
   */
  placement?: "inside" | "above" | "below";
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

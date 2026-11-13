/**
 * Shopify admin analytics palette, measured from the native reports:
 * current period in blue, the comparison period pale and dashed, light
 * gridlines with a darker zero line, and grey 12px axis labels.
 */
export const CHART = {
  /** The current period's line. */
  primary: "#2c6ecb",
  /** Bars, funnel stages and ranked bars. */
  bar: "#4b8ff7",
  /** The previous period's line and bars. */
  comparison: "#a4c4f3",
  /** Funnel tracks and drop-off bands. */
  faded: "#dbe8fd",
  /** Gridlines and the empty donut ring. */
  grid: "#ebebeb",
  /** The zero line. */
  baseline: "#d4d4d4",
  axisText: "#616161",
  axisFontSize: 12,
  /** The hover guide line. */
  guide: "#8a8a8a",
  /** Donut slices, in order. */
  palette: ["#2c6ecb", "#4b8ff7", "#7fb0fa", "#b3d0fc", "#dbe8fd"],
} as const;

/** Axis labels use the admin's font, inherited from the page. */
export const CHART_FONT = "inherit";

/** Default chart height in px. */
export const CHART_HEIGHT = 220;

/** Height of the funnel's bar plot. */
export const FUNNEL_PLOT_HEIGHT = 180;

/** Of each funnel column, the share the solid bar takes; the rest is the connector. */
export const FUNNEL_BAR_SHARE = 0.56;

/** Hover card width in px. */
export const TOOLTIP_WIDTH = 200;

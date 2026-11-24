import type { ChartValueScaleType } from "./Chart.types";

/**
 * Round 0-based axis ticks for a plot whose tallest value is `max`: about
 * four steps of 1, 2 or 5 × 10ⁿ, so the top tick sits close above it.
 */
export function chartAxisTicks(max: number): number[] {
  if (!(max > 0)) return [0, 1];
  const rough = max / 4;
  const magnitude = 10 ** Math.floor(Math.log10(rough));
  const step =
    [1, 2, 5, 10].map((m) => m * magnitude).find((s) => s >= rough) ?? 10 * magnitude;
  const top = Math.ceil(max / step) * step;
  const ticks: number[] = [];
  for (let value = 0; value <= top + step / 2; value += step) {
    ticks.push(Math.round(value * 1000) / 1000);
  }
  return ticks;
}

/** 0-based ticks for every value drawn, and the top the plot scales to. */
export function chartValueScale(
  values: Array<number | null | undefined>,
): ChartValueScaleType {
  const finite = values.filter(
    (v): v is number => typeof v === "number" && Number.isFinite(v),
  );
  const ticks = chartAxisTicks(Math.max(0, ...finite));
  return { ticks, max: ticks[ticks.length - 1] || 1 };
}

/**
 * The indexes whose dates label the x axis: the first, the last and evenly
 * spaced ones between, at most `maxLabels`, as Shopify spaces them.
 */
export function chartLabelIndexes(count: number, maxLabels = 6): number[] {
  if (count <= 0) return [];
  if (count <= maxLabels) return Array.from({ length: count }, (_, i) => i);
  const step = (count - 1) / (maxLabels - 1);
  const out = new Set<number>();
  for (let i = 0; i < maxLabels; i += 1) out.add(Math.round(i * step));
  return [...out].sort((a, b) => a - b);
}

/** Roughly how wide an axis label of `text` is at 12px, for the margin. */
export function labelWidth(text: string): number {
  return Math.ceil(text.length * 7) + 4;
}

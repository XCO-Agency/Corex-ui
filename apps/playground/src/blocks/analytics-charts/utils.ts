import type { PeriodRangeType, PeriodSeriesType, ValueScaleType } from "./types";

/**
 * Round 0-based axis ticks for a plot whose tallest value is `max`: about
 * four steps of 1, 2 or 5 × 10ⁿ, so the top tick sits close above it.
 */
export function axisTicks(max: number): number[] {
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
export function valueScale(values: Array<number | null | undefined>): ValueScaleType {
  const finite = values.filter(
    (v): v is number => typeof v === "number" && Number.isFinite(v),
  );
  const ticks = axisTicks(Math.max(0, ...finite));
  return { ticks, max: ticks[ticks.length - 1] || 1 };
}

/**
 * The indexes whose dates label the x axis: the first, the last and evenly
 * spaced ones between, at most `maxLabels`, as Shopify spaces them.
 */
export function xLabelIndexes(count: number, maxLabels = 6): number[] {
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

/**
 * Change from `previous` to `current` in percent, one decimal; null when
 * there is no previous value to compare with (never invented).
 */
export function percentChange(
  current: number,
  previous: number | null | undefined,
): number | null {
  if (previous == null || !(previous > 0)) return null;
  return Math.round(((current - previous) / previous) * 1000) / 10;
}

/** Days from `from` to `to` inclusive, as YYYY-MM-DD (UTC), bounded to 800. */
export function dayRange(from: string, to: string): string[] {
  const out: string[] = [];
  const cursor = new Date(`${from.slice(0, 10)}T00:00:00Z`);
  const last = new Date(`${to.slice(0, 10)}T00:00:00Z`);
  if (Number.isNaN(cursor.getTime()) || Number.isNaN(last.getTime())) {
    return out;
  }
  for (let i = 0; cursor <= last && i < 800; i += 1) {
    out.push(cursor.toISOString().slice(0, 10));
    cursor.setUTCDate(cursor.getUTCDate() + 1);
  }
  return out;
}

/**
 * Splits daily rows into the current period and the equally long one
 * before it, each day filled (no row = 0). The previous period is null
 * when it holds no rows at all, so no flat comparison line is drawn at 0.
 */
export function periodSeries<T extends { date: string }>(
  rows: T[],
  range: PeriodRangeType,
  pick: (row: T) => number,
): PeriodSeriesType {
  const byDate = new Map<string, number>();
  for (const row of rows) {
    const key = String(row.date).slice(0, 10);
    byDate.set(key, (byDate.get(key) ?? 0) + (Number(pick(row)) || 0));
  }
  const dates = dayRange(range.currentFrom, range.to);
  const previousAll = dayRange(range.previousFrom, range.currentFrom).slice(0, -1);
  // Align the previous period to the current one's length, ending the day
  // before the current period starts.
  const previousDates = previousAll.slice(-dates.length);
  const current = dates.map((d) => byDate.get(d) ?? 0);
  const previousValues = previousDates.map((d) => byDate.get(d) ?? 0);
  const hasPrevious =
    previousDates.length === dates.length && previousDates.some((d) => byDate.has(d));
  return {
    dates,
    current,
    previousDates,
    previous: hasPrevious ? previousValues : null,
  };
}

export const sum = (values: number[]): number =>
  values.reduce((total, v) => total + (Number(v) || 0), 0);

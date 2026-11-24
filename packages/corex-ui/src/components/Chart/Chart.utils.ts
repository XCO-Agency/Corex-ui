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

/**
 * An SVG path through `points`: straight segments, or a smooth monotone
 * cubic curve that passes through every point and never overshoots between
 * them (so a line of non-negative values never dips below the zero line).
 */
export function chartLinePath(
  points: Array<{ x: number; y: number }>,
  curve: "smooth" | "sharp" = "smooth",
): string {
  const f = (n: number): string => n.toFixed(1);
  const first = points[0];
  if (!first) return "";
  if (curve === "sharp" || points.length < 3) {
    return points.map((p, i) => `${i === 0 ? "M" : "L"}${f(p.x)},${f(p.y)}`).join(" ");
  }
  // Fritsch–Carlson tangents: the slope at each point is limited so the curve stays monotone.
  const n = points.length;
  const dx: number[] = [];
  const slope: number[] = [];
  for (let i = 0; i < n - 1; i += 1) {
    const a = points[i]!;
    const b = points[i + 1]!;
    dx.push(b.x - a.x);
    slope.push(b.x === a.x ? 0 : (b.y - a.y) / (b.x - a.x));
  }
  const tangent: number[] = [slope[0]!];
  for (let i = 1; i < n - 1; i += 1) {
    const s0 = slope[i - 1]!;
    const s1 = slope[i]!;
    tangent.push(s0 * s1 <= 0 ? 0 : (s0 + s1) / 2);
  }
  tangent.push(slope[n - 2]!);
  for (let i = 0; i < n - 1; i += 1) {
    const s = slope[i]!;
    if (s === 0) {
      tangent[i] = 0;
      tangent[i + 1] = 0;
      continue;
    }
    const a = tangent[i]! / s;
    const b = tangent[i + 1]! / s;
    const h = Math.hypot(a, b);
    if (h > 3) {
      tangent[i] = (3 * a * s) / h;
      tangent[i + 1] = (3 * b * s) / h;
    }
  }
  let d = `M${f(first.x)},${f(first.y)}`;
  for (let i = 0; i < n - 1; i += 1) {
    const a = points[i]!;
    const b = points[i + 1]!;
    const w = dx[i]! / 3;
    d += ` C${f(a.x + w)},${f(a.y + tangent[i]! * w)} ${f(b.x - w)},${f(b.y - tangent[i + 1]! * w)} ${f(b.x)},${f(b.y)}`;
  }
  return d;
}

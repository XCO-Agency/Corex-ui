import { CHART } from "../constants";
import type { SparklinePropsType } from "../types";

/**
 * A small trend line for a table cell or metric, in the current-period
 * blue. Flat zero data draws a line on the baseline; no data draws nothing.
 */
export function Sparkline({
  values,
  ariaLabel,
  width = 96,
  height = 28,
  color = CHART.primary,
}: SparklinePropsType) {
  if (values.length === 0) return null;
  const max = Math.max(...values.map((v) => Number(v) || 0), 0);
  const pad = 2;
  const x = (i: number) =>
    values.length === 1 ? width / 2 : pad + (i * (width - pad * 2)) / (values.length - 1);
  const y = (v: number) =>
    max > 0 ? pad + (height - pad * 2) * (1 - (Number(v) || 0) / max) : height - pad;
  const points = values.map((v, i) => `${x(i).toFixed(1)},${y(v).toFixed(1)}`);
  const area = `M${x(0)},${height - pad} L${points.join(" L")} L${x(values.length - 1)},${height - pad} Z`;
  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      aria-label={ariaLabel}
      style={{ display: "block" }}
    >
      <path d={area} fill={color} fillOpacity={0.12} />
      <polyline
        points={points.join(" ")}
        fill="none"
        stroke={color}
        strokeWidth={1.5}
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
}

import { CHART, CHART_FONT } from "../constants";
import type { XAxisLabelsPropsType, YAxisGridPropsType } from "../types";

/** Horizontal gridlines with their value labels, Shopify style. */
export function YAxisGrid({
  ticks,
  max,
  left,
  right,
  top,
  plotHeight,
  format,
}: YAxisGridPropsType) {
  return (
    <g data-chart-y-axis="" aria-hidden>
      {ticks.map((tick) => {
        const y = top + plotHeight * (1 - tick / max);
        return (
          <g key={tick}>
            <line
              x1={left}
              x2={right}
              y1={y}
              y2={y}
              stroke={tick === 0 ? CHART.baseline : CHART.grid}
              strokeWidth={1}
              shapeRendering="crispEdges"
            />
            <text
              x={left - 8}
              y={y}
              dy="0.32em"
              textAnchor="end"
              fill={CHART.axisText}
              fontSize={CHART.axisFontSize}
              fontFamily={CHART_FONT}
            >
              {format(tick)}
            </text>
          </g>
        );
      })}
    </g>
  );
}

/** Date labels under the plot at the given x positions. */
export function XAxisLabels({ labels, y }: XAxisLabelsPropsType) {
  return (
    <g data-chart-x-axis="" aria-hidden>
      {labels.map((label, i) => (
        <text
          key={`${label.text}-${i}`}
          x={label.x}
          y={y}
          textAnchor={label.anchor ?? "middle"}
          fill={CHART.axisText}
          fontSize={CHART.axisFontSize}
          fontFamily={CHART_FONT}
        >
          {label.text}
        </text>
      ))}
    </g>
  );
}

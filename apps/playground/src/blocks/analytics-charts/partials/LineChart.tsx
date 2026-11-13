import { useId } from "react";
import { BlockStack, Box } from "@xco-agency/corex-ui";
import { CHART, CHART_HEIGHT } from "../constants";
import { useActiveIndex } from "../hooks/useActiveIndex";
import { useChartWidth } from "../hooks/useChartWidth";
import type { LineChartPropsType, LineSeriesType } from "../types";
import { labelWidth, valueScale, xLabelIndexes } from "../utils";
import { XAxisLabels, YAxisGrid } from "./Axes";
import { ChartLegend, ChartTooltip } from "./ChartTooltip";

const seriesColor = (s: LineSeriesType) =>
  s.color ?? (s.dashed ? CHART.comparison : CHART.primary);

/**
 * Shopify's line chart: a solid blue current-period line, an optional
 * light dashed previous-period line, light gridlines with value labels,
 * dates along the bottom, a legend under it, and a hover / keyboard
 * tooltip with each series' date and value.
 */
export function LineChart({
  series,
  dates,
  ariaLabel,
  formatValue,
  formatTick = formatValue,
  formatDate,
  height = CHART_HEIGHT,
  legend = true,
}: LineChartPropsType) {
  const titleId = useId();
  const [ref, width] = useChartWidth<HTMLElement>();
  const count = dates.length;
  const { ticks, max } = valueScale(series.flatMap((s) => s.values));
  const marginLeft = Math.max(...ticks.map((t) => labelWidth(formatTick(t)))) + 8;
  const marginRight = 12;
  const top = 8;
  const bottom = 28;
  const plotHeight = height - top - bottom;
  const plotWidth = Math.max(width - marginLeft - marginRight, 10);
  const x = (i: number) =>
    marginLeft + (count <= 1 ? plotWidth / 2 : (i * plotWidth) / (count - 1));
  const y = (v: number) => top + plotHeight * (1 - (Number(v) || 0) / max);
  const indexAt = (px: number) =>
    count <= 1 ? 0 : Math.round(((px - marginLeft) / plotWidth) * (count - 1));
  const { active, props } = useActiveIndex(count, indexAt);

  const path = (values: number[]) =>
    values
      .slice(0, count)
      .map((v, i) => `${i === 0 ? "M" : "L"}${x(i).toFixed(1)},${y(v).toFixed(1)}`)
      .join(" ");

  const labels = xLabelIndexes(count, width < 420 ? 4 : 6).map((i, n, all) => ({
    x: x(i),
    text: formatDate(dates[i] ?? ""),
    anchor:
      all.length > 1 && n === 0
        ? ("start" as const)
        : all.length > 1 && n === all.length - 1
          ? ("end" as const)
          : ("middle" as const),
  }));

  return (
    <BlockStack gap="small-100">
      <Box ref={ref} position="relative" style={{ width: "100%" }}>
        <svg
          width="100%"
          height={height}
          viewBox={`0 0 ${width} ${height}`}
          role="group"
          aria-labelledby={titleId}
          style={{ display: "block", overflow: "visible", outline: "none" }}
          {...props}
        >
          <title id={titleId}>{ariaLabel}</title>
          <YAxisGrid
            ticks={ticks}
            max={max}
            left={marginLeft}
            right={marginLeft + plotWidth}
            top={top}
            plotHeight={plotHeight}
            format={formatTick}
          />
          {/* Comparison lines first, so the current period draws on top. */}
          {[...series].reverse().map((s) => (
            <path
              key={s.id}
              data-series={s.id}
              d={path(s.values)}
              fill="none"
              stroke={seriesColor(s)}
              strokeWidth={2}
              strokeDasharray={s.dashed ? "5 4" : undefined}
              strokeLinejoin="round"
              strokeLinecap="round"
            />
          ))}
          {active != null && (
            <g aria-hidden>
              <line
                x1={x(active)}
                x2={x(active)}
                y1={top}
                y2={top + plotHeight}
                stroke={CHART.guide}
                strokeWidth={1}
                strokeDasharray="2 2"
              />
              {series.map((s) => (
                <circle
                  key={s.id}
                  cx={x(active)}
                  cy={y(s.values[active] ?? 0)}
                  r={4}
                  fill="#ffffff"
                  stroke={seriesColor(s)}
                  strokeWidth={2}
                />
              ))}
            </g>
          )}
          <XAxisLabels labels={labels} y={height - 8} />
        </svg>
        {active != null && (
          <ChartTooltip
            x={x(active)}
            containerWidth={width}
            rows={series.map((s) => ({
              color: seriesColor(s),
              dashed: s.dashed,
              label: formatDate((s.dates ?? dates)[active] ?? ""),
              value: formatValue(s.values[active] ?? 0),
            }))}
          />
        )}
        {/* What the tooltip shows, announced to screen readers. */}
        <Box visuallyHidden aria-live="polite">
          {active != null
            ? series
                .map(
                  (s) =>
                    `${s.label}, ${formatDate((s.dates ?? dates)[active] ?? "")}: ${formatValue(s.values[active] ?? 0)}`,
                )
                .join("; ")
            : ""}
        </Box>
      </Box>
      {legend && (
        <ChartLegend
          items={series.map((s) => ({
            label: s.label,
            color: seriesColor(s),
            dashed: s.dashed,
          }))}
        />
      )}
    </BlockStack>
  );
}

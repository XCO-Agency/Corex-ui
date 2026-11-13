import { useId } from "react";
import { BlockStack, Box } from "@xco-agency/corex-ui";
import { CHART, CHART_HEIGHT } from "../constants";
import { useActiveIndex } from "../hooks/useActiveIndex";
import { useChartWidth } from "../hooks/useChartWidth";
import type { ColumnChartPropsType } from "../types";
import { labelWidth, valueScale, xLabelIndexes } from "../utils";
import { XAxisLabels, YAxisGrid } from "./Axes";
import { ChartLegend, ChartTooltip } from "./ChartTooltip";

/**
 * Shopify's column chart: blue bars from a labelled zero, light gridlines,
 * dates under the plot, an optional pale previous-period bar beside each,
 * and a hover / keyboard tooltip.
 */
export function ColumnChart({
  data,
  ariaLabel,
  label,
  comparisonLabel,
  comparisonDates,
  formatValue,
  formatTick = formatValue,
  formatDate,
  height = CHART_HEIGHT,
}: ColumnChartPropsType) {
  const titleId = useId();
  const [ref, width] = useChartWidth<HTMLElement>();
  const count = data.length;
  const compared = data.some((d) => d.comparison != null);
  const { ticks, max } = valueScale(data.flatMap((d) => [d.value, d.comparison ?? 0]));
  const marginLeft = Math.max(...ticks.map((t) => labelWidth(formatTick(t)))) + 8;
  const marginRight = 8;
  const top = 8;
  const bottom = 28;
  const plotHeight = height - top - bottom;
  const plotWidth = Math.max(width - marginLeft - marginRight, 10);
  const slot = plotWidth / Math.max(count, 1);
  const barWidth = Math.max(
    Math.min(slot * (compared ? 0.36 : 0.62), compared ? 14 : 28),
    1,
  );
  const center = (i: number) => marginLeft + slot * (i + 0.5);
  const barHeight = (v: number) => (plotHeight * (Number(v) || 0)) / max;
  const indexAt = (px: number) => Math.floor((px - marginLeft) / slot);
  const { active, props } = useActiveIndex(count, indexAt);
  const baseline = top + plotHeight;

  const labels = xLabelIndexes(count, width < 420 ? 4 : 6).map((i) => ({
    x: center(i),
    text: formatDate(data[i]?.date ?? ""),
  }));

  const bar = (cx: number, value: number, fill: string, key: string) => {
    const h = barHeight(value);
    if (h <= 0) return null;
    const r = Math.min(2, barWidth / 2, h);
    const x0 = cx - barWidth / 2;
    const y0 = baseline - h;
    // Rounded top corners only, as Shopify draws them.
    return (
      <path
        key={key}
        d={`M${x0},${baseline} V${y0 + r} Q${x0},${y0} ${x0 + r},${y0} H${x0 + barWidth - r} Q${x0 + barWidth},${y0} ${x0 + barWidth},${y0 + r} V${baseline} Z`}
        fill={fill}
      />
    );
  };

  const current = active != null ? data[active] : undefined;

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
          {active != null && (
            <rect
              aria-hidden
              x={marginLeft + slot * active}
              y={top}
              width={slot}
              height={plotHeight}
              fill="#000000"
              fillOpacity={0.04}
            />
          )}
          <g data-chart-bars="">
            {data.map((d, i) => {
              const offset = compared ? barWidth / 2 + 1 : 0;
              return (
                <g key={`${d.date}-${i}`}>
                  {compared &&
                    d.comparison != null &&
                    bar(center(i) - offset, d.comparison, CHART.comparison, "previous")}
                  {bar(center(i) + offset, d.value, CHART.bar, "current")}
                </g>
              );
            })}
          </g>
          <XAxisLabels labels={labels} y={height - 8} />
        </svg>
        {active != null && current && (
          <ChartTooltip
            x={center(active)}
            containerWidth={width}
            heading={compared ? undefined : formatDate(current.date)}
            rows={[
              {
                color: CHART.bar,
                label: compared ? formatDate(current.date) : label,
                value: formatValue(current.value),
              },
              ...(compared && current.comparison != null
                ? [
                    {
                      color: CHART.comparison,
                      label: formatDate(comparisonDates?.[active] ?? ""),
                      value: formatValue(current.comparison),
                    },
                  ]
                : []),
            ]}
          />
        )}
        <Box visuallyHidden aria-live="polite">
          {current ? `${formatDate(current.date)}: ${formatValue(current.value)}` : ""}
        </Box>
      </Box>
      <ChartLegend
        items={[
          { color: CHART.bar, label },
          ...(compared && comparisonLabel
            ? [{ color: CHART.comparison, label: comparisonLabel }]
            : []),
        ]}
      />
    </BlockStack>
  );
}

import { useState } from "react";
import { BlockStack } from "../BlockStack";
import { Box } from "../Box";
import { Grid } from "../Grid";
import { Text } from "../Text";
import { CHART_COLORS, FUNNEL_BAR_SHARE, FUNNEL_PLOT_HEIGHT } from "./Chart.constants";
import type { ChartFunnelPropsType } from "./Chart.types";
import { ChartChange } from "./ChartChange";
import { ChartTooltip } from "./ChartTooltip";
import { useChartWidth } from "./useChartWidth";

const FADE = "opacity 150ms ease";

/**
 * Shopify's "Conversion rate breakdown": a column per stage with its label,
 * share and count over it, a solid bar for the stage, and a faded band
 * flowing from each bar's top down to the next one's (the drop-off).
 *
 * Hovering or focusing a stage (its header or its bar) highlights that
 * column, dims the rest and opens a hover card with the stage's count,
 * share, note, change and any `details` rows.
 */
export function ChartFunnel({ stages, ariaLabel }: ChartFunnelPropsType) {
  const [ref, containerWidth] = useChartWidth<HTMLElement>();
  const [active, setActive] = useState<number | null>(null);
  const plot = FUNNEL_PLOT_HEIGHT;
  const n = Math.max(stages.length, 1);
  const width = 1000;
  const column = width / n;
  const barWidth = column * FUNNEL_BAR_SHARE;
  const height = (share: number | null) =>
    Math.max(((Math.min(share ?? 0, 100) || 0) / 100) * plot, share ? 2 : 0);
  const dim = (i: number): boolean => active !== null && active !== i;
  const activeStage = active !== null ? stages[active] : undefined;
  const select = (i: number) => ({
    onMouseEnter: () => setActive(i),
    onMouseLeave: () => setActive(null),
  });

  return (
    <BlockStack gap="small-100">
      <Grid gridTemplateColumns={`repeat(${n}, minmax(0, 1fr))`} gap="small">
        {stages.map((stage, i) => (
          <Box
            key={stage.id}
            data-stage-header={stage.id}
            style={{ opacity: dim(i) ? 0.45 : 1, transition: FADE }}
            {...select(i)}
          >
            <BlockStack gap="small-400">
              <Text
                as="p"
                variant="bodySm"
                color="subdued"
                tooltip={stage.help}
                lineClamp={2}
              >
                {stage.label}
              </Text>
              <Text as="p" variant="headingLg">
                {stage.shareDisplay}
              </Text>
              <Text as="p" variant="bodySm">
                {stage.display}
              </Text>
              <ChartChange pct={stage.change ?? null} />
              {stage.note && (
                <Text as="p" variant="bodySm" color="subdued">
                  {stage.note}
                </Text>
              )}
            </BlockStack>
          </Box>
        ))}
      </Grid>
      <Box ref={ref} position="relative" style={{ width: "100%" }}>
        <svg
          width="100%"
          height={plot}
          viewBox={`0 0 ${width} ${plot}`}
          preserveAspectRatio="none"
          role="group"
          aria-label={ariaLabel}
          style={{ display: "block" }}
        >
          <line
            x1={0}
            x2={width}
            y1={plot - 0.5}
            y2={plot - 0.5}
            stroke={CHART_COLORS.baseline}
            strokeWidth={1}
            vectorEffect="non-scaling-stroke"
          />
          {stages.map((stage, i) => {
            const x = i * column;
            const h = height(stage.share);
            const next = stages[i + 1];
            const on = active === i;
            return (
              <g
                key={stage.id}
                data-stage={stage.id}
                style={{ opacity: dim(i) ? 0.45 : 1, transition: FADE }}
              >
                {/* The track the bar would fill at 100%. */}
                <rect
                  x={x}
                  y={0}
                  width={barWidth}
                  height={plot}
                  fill={CHART_COLORS.faded}
                  fillOpacity={on ? 0.8 : 0.45}
                />
                {next && (
                  <polygon
                    data-connector=""
                    points={`${x + barWidth},${plot - h} ${x + column},${plot - height(next.share)} ${x + column},${plot} ${x + barWidth},${plot}`}
                    fill={on ? CHART_COLORS.comparison : CHART_COLORS.faded}
                    fillOpacity={on ? 0.7 : 1}
                  />
                )}
                <rect
                  x={x}
                  y={plot - h}
                  width={barWidth}
                  height={h}
                  fill={on ? CHART_COLORS.primary : CHART_COLORS.bar}
                  rx={2}
                />
              </g>
            );
          })}
          {/* One hit area per column, so the whole column (bar, track and drop-off band) is hoverable and focusable. */}
          {stages.map((stage, i) => (
            <rect
              key={stage.id}
              data-stage-hit={stage.id}
              x={i * column}
              y={0}
              width={column}
              height={plot}
              fill="transparent"
              role="img"
              tabIndex={0}
              aria-label={`${stage.label}: ${stage.display}, ${stage.shareDisplay}`}
              style={{ cursor: "pointer", outline: "none" }}
              onFocus={() => setActive(i)}
              onBlur={() => setActive(null)}
              {...select(i)}
            />
          ))}
        </svg>
        {activeStage && active !== null && (
          <ChartTooltip
            x={((active * column + column / 2) / width) * containerWidth}
            anchorWidth={(column / width) * containerWidth}
            containerWidth={containerWidth}
            heading={activeStage.label}
            rows={[
              {
                color: CHART_COLORS.bar,
                label: activeStage.shareDisplay,
                value: activeStage.display,
              },
              ...(activeStage.details ?? []).map((d) => ({
                color: CHART_COLORS.comparison,
                label: d.label,
                value: d.value,
              })),
            ]}
          >
            {activeStage.note && (
              <Text as="p" variant="bodySm" color="subdued">
                {activeStage.note}
              </Text>
            )}
            <ChartChange pct={activeStage.change ?? null} />
          </ChartTooltip>
        )}
      </Box>
    </BlockStack>
  );
}

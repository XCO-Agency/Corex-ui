import { BlockStack } from "../BlockStack";
import { Grid } from "../Grid";
import { Text } from "../Text";
import { CHART_COLORS, FUNNEL_BAR_SHARE, FUNNEL_PLOT_HEIGHT } from "./Chart.constants";
import type { ChartFunnelPropsType } from "./Chart.types";
import { ChartChange } from "./ChartChange";

/**
 * Shopify's "Conversion rate breakdown": a column per stage with its label,
 * share and count over it, a solid bar for the stage, and a faded band
 * flowing from each bar's top down to the next one's (the drop-off).
 */
export function ChartFunnel({ stages, ariaLabel }: ChartFunnelPropsType) {
  const plot = FUNNEL_PLOT_HEIGHT;
  const n = Math.max(stages.length, 1);
  const width = 1000;
  const column = width / n;
  const barWidth = column * FUNNEL_BAR_SHARE;
  const height = (share: number | null) =>
    Math.max(((Math.min(share ?? 0, 100) || 0) / 100) * plot, share ? 2 : 0);

  return (
    <BlockStack gap="small-100">
      <Grid gridTemplateColumns={`repeat(${n}, minmax(0, 1fr))`} gap="small">
        {stages.map((stage) => (
          <BlockStack key={stage.id} gap="small-400">
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
        ))}
      </Grid>
      <svg
        width="100%"
        height={plot}
        viewBox={`0 0 ${width} ${plot}`}
        preserveAspectRatio="none"
        role="img"
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
          return (
            <g key={stage.id} data-stage={stage.id}>
              <title>{`${stage.label}: ${stage.display} (${stage.shareDisplay})`}</title>
              {/* The track the bar would fill at 100%. */}
              <rect
                x={x}
                y={0}
                width={barWidth}
                height={plot}
                fill={CHART_COLORS.faded}
                fillOpacity={0.45}
              />
              {next && (
                <polygon
                  data-connector=""
                  points={`${x + barWidth},${plot - h} ${x + column},${plot - height(next.share)} ${x + column},${plot} ${x + barWidth},${plot}`}
                  fill={CHART_COLORS.faded}
                />
              )}
              <rect
                x={x}
                y={plot - h}
                width={barWidth}
                height={h}
                fill={CHART_COLORS.bar}
                rx={2}
              />
            </g>
          );
        })}
      </svg>
    </BlockStack>
  );
}

import { BlockStack, Box, InlineStack, Text } from "@xco-agency/corex-ui";
import { TOOLTIP_WIDTH } from "../constants";
import type {
  ChartLegendPropsType,
  ChartTooltipPropsType,
  SeriesMarkerPropsType,
} from "../types";

/** A coloured series marker: a dot, or a short dash for the comparison. */
export function SeriesMarker({ color, dashed = false }: SeriesMarkerPropsType) {
  return (
    <svg width="12" height="12" aria-hidden focusable="false">
      {dashed ? (
        <line
          x1="0"
          y1="6"
          x2="12"
          y2="6"
          stroke={color}
          strokeWidth="2"
          strokeDasharray="3 2"
        />
      ) : (
        <circle cx="6" cy="6" r="4" fill={color} />
      )}
    </svg>
  );
}

/**
 * Shopify's hover card: a white panel over the plot with the heading and
 * each series' value, beside the point and flipped left near the edge.
 */
export function ChartTooltip({
  x,
  containerWidth,
  heading,
  rows,
  children,
}: ChartTooltipPropsType) {
  const width = TOOLTIP_WIDTH;
  const left = x + 12 + width > containerWidth ? Math.max(0, x - 12 - width) : x + 12;
  return (
    <Box
      role="presentation"
      data-chart-tooltip=""
      position="absolute"
      insetBlockStart="4px"
      insetInlineStart={`${left}px`}
      zIndex={1}
      shadow="0 4px 12px rgba(0, 0, 0, 0.12), 0 0 0 1px rgba(0, 0, 0, 0.06)"
      style={{
        width,
        pointerEvents: "none",
        background: "#ffffff",
        borderRadius: 10,
        padding: "8px 12px",
      }}
    >
      <BlockStack gap="small-300">
        {heading && (
          <Text as="p" variant="bodySm" fontWeight="semibold">
            {heading}
          </Text>
        )}
        {rows.map((row) => (
          <InlineStack
            key={`${row.label}-${row.color}`}
            justifyContent="space-between"
            alignItems="center"
            gap="small-200"
            wrap={false}
          >
            <InlineStack gap="small-300" alignItems="center" wrap={false}>
              <SeriesMarker color={row.color} dashed={row.dashed} />
              <Text as="span" variant="bodySm" color="subdued">
                {row.label}
              </Text>
            </InlineStack>
            <Text as="span" variant="bodySm" fontWeight="semibold">
              {row.value}
            </Text>
          </InlineStack>
        ))}
        {children}
      </BlockStack>
    </Box>
  );
}

/** The legend under a chart: a marker and a label per series. */
export function ChartLegend({ items }: ChartLegendPropsType) {
  return (
    <InlineStack gap="base" justifyContent="center" alignItems="center">
      {items.map((item) => (
        <InlineStack key={item.label} gap="small-300" alignItems="center" wrap={false}>
          <SeriesMarker color={item.color} dashed={item.dashed} />
          <Text as="span" variant="bodySm" color="subdued">
            {item.label}
          </Text>
        </InlineStack>
      ))}
    </InlineStack>
  );
}

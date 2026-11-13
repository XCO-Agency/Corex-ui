import { useState } from "react";
import { BlockStack, Box, InlineStack, Text } from "@xco-agency/corex-ui";
import { CHART } from "../constants";
import type { DonutChartPropsType } from "../types";
import { SeriesMarker } from "./ChartTooltip";

/**
 * Shopify's donut ("Sales by channel"): a ring of slices with the total in
 * its centre and a legend with each slice's value and share, readable
 * without hovering. Hovering a legend row highlights its slice.
 */
export function DonutChart({
  slices,
  total,
  totalLabel,
  ariaLabel,
  size = 160,
}: DonutChartPropsType) {
  const [active, setActive] = useState<string | null>(null);
  const sumValues = slices.reduce((s, slice) => s + Math.max(slice.value, 0), 0);
  const stroke = 18;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const gap = slices.length > 1 ? 2 : 0;
  let offset = 0;
  const colour = (i: number): string =>
    CHART.palette[i % CHART.palette.length] ?? CHART.bar;

  return (
    <InlineStack gap="large-100" alignItems="center" wrap>
      <Box position="relative" style={{ width: size, height: size, flex: "0 0 auto" }}>
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          role="img"
          aria-label={ariaLabel}
          style={{ display: "block", transform: "rotate(-90deg)" }}
        >
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={CHART.grid}
            strokeWidth={stroke}
          />
          {sumValues > 0 &&
            slices.map((slice, i) => {
              const length = (Math.max(slice.value, 0) / sumValues) * circumference;
              const dash = Math.max(length - gap, 0);
              const element = (
                <circle
                  key={slice.id}
                  data-slice={slice.id}
                  cx={size / 2}
                  cy={size / 2}
                  r={radius}
                  fill="none"
                  stroke={colour(i)}
                  strokeWidth={active === slice.id ? stroke + 4 : stroke}
                  strokeOpacity={active && active !== slice.id ? 0.35 : 1}
                  strokeDasharray={`${dash} ${circumference - dash}`}
                  strokeDashoffset={-offset}
                >
                  <title>{`${slice.label}: ${slice.display}`}</title>
                </circle>
              );
              offset += length;
              return element;
            })}
        </svg>
        <Box
          position="absolute"
          style={{
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            pointerEvents: "none",
          }}
        >
          <BlockStack gap="small-400" justifyContent="center">
            <Text as="span" variant="headingMd">
              {total}
            </Text>
            <Text as="span" variant="bodySm" color="subdued">
              {totalLabel}
            </Text>
          </BlockStack>
        </Box>
      </Box>
      <Box style={{ flex: "1 1 180px", minWidth: 0 }}>
        <BlockStack gap="small-200">
          {slices.map((slice, i) => (
            <Box
              key={slice.id}
              data-legend-row=""
              onMouseEnter={() => setActive(slice.id)}
              onMouseLeave={() => setActive(null)}
            >
              <InlineStack
                justifyContent="space-between"
                alignItems="center"
                gap="small-100"
                wrap={false}
              >
                <InlineStack gap="small-300" alignItems="center" wrap={false}>
                  <SeriesMarker color={colour(i)} />
                  <Text as="span" variant="bodySm" lineClamp={1}>
                    {slice.label}
                  </Text>
                </InlineStack>
                <InlineStack gap="small-200" alignItems="center" wrap={false}>
                  <Text as="span" variant="bodySm" fontWeight="semibold" numeric>
                    {slice.display}
                  </Text>
                  <Text as="span" variant="bodySm" color="subdued" numeric>
                    {sumValues > 0
                      ? `${Math.round((Math.max(slice.value, 0) / sumValues) * 100)}%`
                      : "0%"}
                  </Text>
                </InlineStack>
              </InlineStack>
            </Box>
          ))}
        </BlockStack>
      </Box>
    </InlineStack>
  );
}

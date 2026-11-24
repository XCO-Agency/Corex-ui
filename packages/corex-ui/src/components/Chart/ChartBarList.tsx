import { useState } from "react";
import { BlockStack } from "../BlockStack";
import { Box } from "../Box";
import { InlineStack } from "../InlineStack";
import { Text } from "../Text";
import { CHART_COLORS } from "./Chart.constants";
import type { ChartBarListPropsType } from "./Chart.types";
import { ChartChange } from "./ChartChange";
import { ChartTooltip } from "./ChartTooltip";
import { useChartWidth } from "./useChartWidth";

const FADE = "opacity 150ms ease";

/**
 * A ranked list ("Sessions by location"), laid out like the analytics
 * lists in Shopify and Google Analytics: each row has the label first, then
 * its share of the total on the right and a thin bar under it scaled to the
 * largest value. The value and the change live in a hover card, so rows stay
 * short; with `tooltip={false}` they are printed in the row instead.
 *
 * Hovering or focusing a row darkens its bar and dims the other rows.
 */
export function ChartBarList({
  items,
  ariaLabel,
  total,
  tooltip = true,
}: ChartBarListPropsType) {
  const [ref, width] = useChartWidth<HTMLElement>();
  const [active, setActive] = useState<string | null>(null);
  const max = Math.max(...items.map((item) => item.value), 1);
  const whole = total ?? items.reduce((s, item) => s + Math.max(item.value, 0), 0);
  const share = (value: number): string =>
    whole > 0 ? `${Math.round((Math.max(value, 0) / whole) * 1000) / 10}%` : "0%";
  const barWidth = (value: number): number =>
    Math.max((value / max) * 100, value > 0 ? 1 : 0);

  return (
    <Box ref={ref} role="list" aria-label={ariaLabel} style={{ width: "100%" }}>
      <BlockStack gap="small-200">
        {items.map((item, index) => {
          const on = active === item.id;
          const dimmed = active !== null && !on;
          return (
            <Box
              key={item.id}
              role="listitem"
              tabIndex={0}
              aria-label={`${item.label}: ${item.display}, ${share(item.value)}`}
              position="relative"
              data-row={item.id}
              style={{
                outline: "none",
                opacity: dimmed ? 0.45 : 1,
                transition: FADE,
              }}
              onMouseEnter={() => setActive(item.id)}
              onMouseLeave={() => setActive(null)}
              onFocus={() => setActive(item.id)}
              onBlur={() => setActive(null)}
            >
              <BlockStack gap="small-300">
                <InlineStack
                  gap="small-200"
                  alignItems="center"
                  justifyContent="space-between"
                  wrap={false}
                >
                  <InlineStack gap="small-200" alignItems="center" wrap={false}>
                    {item.leading}
                    <Text as="span" variant="bodySm" lineClamp={1}>
                      {item.label}
                    </Text>
                  </InlineStack>
                  <InlineStack gap="small-200" alignItems="center" wrap={false}>
                    {!tooltip && (
                      <Text as="span" variant="bodySm" fontWeight="semibold" numeric>
                        {item.display}
                      </Text>
                    )}
                    <Box style={{ minWidth: 44, textAlign: "end" }}>
                      <Text as="span" variant="bodySm" color="subdued" numeric>
                        {share(item.value)}
                      </Text>
                    </Box>
                    {!tooltip && (
                      <Box style={{ minWidth: 56, textAlign: "end" }}>
                        <ChartChange pct={item.change ?? null} />
                      </Box>
                    )}
                  </InlineStack>
                </InlineStack>
                {/* The bar sits under the text, so no content is ever drawn over it. */}
                <Box
                  aria-hidden
                  style={{
                    height: 6,
                    borderRadius: 3,
                    background: CHART_COLORS.grid,
                    overflow: "hidden",
                  }}
                >
                  <Box
                    data-bar=""
                    style={{
                      width: `${barWidth(item.value)}%`,
                      height: 6,
                      borderRadius: 3,
                      background: on ? CHART_COLORS.primary : CHART_COLORS.bar,
                      transition: "background 150ms ease",
                    }}
                  />
                </Box>
              </BlockStack>
              {on && tooltip && (
                <ChartTooltip
                  x={(barWidth(item.value) / 100) * width}
                  containerWidth={width}
                  placement={index === items.length - 1 ? "above" : "below"}
                  rows={[
                    {
                      color: CHART_COLORS.bar,
                      label: item.label,
                      value: item.display,
                    },
                  ]}
                >
                  <ChartChange pct={item.change ?? null} />
                </ChartTooltip>
              )}
            </Box>
          );
        })}
      </BlockStack>
    </Box>
  );
}

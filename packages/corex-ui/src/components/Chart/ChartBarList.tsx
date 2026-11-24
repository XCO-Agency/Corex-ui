import { BlockStack } from "../BlockStack";
import { Box } from "../Box";
import { InlineStack } from "../InlineStack";
import { Text } from "../Text";
import { CHART_COLORS } from "./Chart.constants";
import type { ChartBarListPropsType } from "./Chart.types";
import { ChartChange } from "./ChartChange";

/**
 * Shopify's ranked bar list ("Sessions by location"): each row's label,
 * a bar scaled to the largest value with the value beside it, and its
 * change.
 */
export function ChartBarList({ items, ariaLabel }: ChartBarListPropsType) {
  const max = Math.max(...items.map((item) => item.value), 1);
  return (
    <Box role="list" aria-label={ariaLabel}>
      <BlockStack gap="small-100">
        {items.map((item) => (
          <Box
            key={item.id}
            role="listitem"
            aria-label={`${item.label}: ${item.display}`}
          >
            <BlockStack gap="small-300">
              <Text as="p" variant="bodySm" lineClamp={1}>
                {item.label}
              </Text>
              <InlineStack gap="small-200" alignItems="center" wrap={false}>
                <Box aria-hidden style={{ flex: "1 1 auto", minWidth: 0 }}>
                  <Box
                    data-bar=""
                    style={{
                      width: `${Math.max((item.value / max) * 100, item.value > 0 ? 1 : 0)}%`,
                      height: 16,
                      borderRadius: 3,
                      background: CHART_COLORS.bar,
                    }}
                  />
                </Box>
                <Text as="span" variant="bodySm" fontWeight="semibold" numeric>
                  {item.display}
                </Text>
                <ChartChange pct={item.change ?? null} />
              </InlineStack>
            </BlockStack>
          </Box>
        ))}
      </BlockStack>
    </Box>
  );
}

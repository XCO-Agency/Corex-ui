import { Card, BlockStack, InlineStack, Text, ProgressBar } from "@xco-agency/corex-ui";
import type { PricingUsageMeterPropsType } from "../types";

export function PricingUsageMeter({ limits }: PricingUsageMeterPropsType) {
  return (
    <Card>
      <BlockStack gap="base">
        <BlockStack gap="none">
          <Text variant="base" heading>
            Current billing cycle usage
          </Text>
          <Text variant="small" tone="neutral">
            Track resource consumption against your current plan limits.
          </Text>
        </BlockStack>

        <BlockStack gap="base">
          {limits.map((item) => {
            const { limit } = item;
            const percent =
              limit === null ? 0 : Math.min(100, Math.round((item.used / limit) * 100));
            const isHighUsage = percent >= 80;

            return (
              <BlockStack key={item.key} gap="small-200">
                <InlineStack justifyContent="space-between" alignItems="center">
                  <Text variant="small" heading>
                    {item.label}
                  </Text>
                  <Text variant="small" tone={isHighUsage ? "warning" : "neutral"}>
                    {limit === null
                      ? `${item.used.toLocaleString()} ${item.unit} (unlimited)`
                      : `${item.used.toLocaleString()} / ${limit.toLocaleString()} ${item.unit} (${percent}%)`}
                  </Text>
                </InlineStack>

                {limit === null ? null : (
                  <ProgressBar
                    value={item.used}
                    max={limit}
                    accessibilityLabel={item.label}
                    tone={isHighUsage ? "caution" : "success"}
                  />
                )}
              </BlockStack>
            );
          })}
        </BlockStack>
      </BlockStack>
    </Card>
  );
}

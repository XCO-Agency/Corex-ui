import * as React from "react";
import {
  Card,
  BlockStack,
  InlineStack,
  Text,
  ProgressBar,
} from "@xco-agency/corex-ui";
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
          {limits.map((item, idx) => {
            const percent = Math.min(
              100,
              Math.round((item.used / item.limit) * 100),
            );
            const isHighUsage = percent >= 80;

            return (
              <BlockStack key={idx} gap="small-200">
                <InlineStack
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Text variant="small" heading>
                    {item.label}
                  </Text>
                  <Text variant="small" tone={isHighUsage ? "warning" : "neutral"}>
                    {item.used.toLocaleString()} / {item.limit.toLocaleString()}{" "}
                    {item.unit} ({percent}%)
                  </Text>
                </InlineStack>

                <ProgressBar
                  progress={percent}
                  size="sm"
                  borderRadius="full"
                  tone={isHighUsage ? "caution" : "success"}
                />
              </BlockStack>
            );
          })}
        </BlockStack>
      </BlockStack>
    </Card>
  );
}

import * as React from "react";
import {
  Card,
  BlockStack,
  InlineStack,
  Text,
  Badge,
  ProgressBar,
  Divider,
} from "@xco-agency/corex-ui";
import type { UsageQuotaType } from "../types";

type UsageMetersCardPropsType = {
  usage: UsageQuotaType[];
  cycleEndDate: string;
};

export function UsageMetersCard({
  usage,
  cycleEndDate,
}: UsageMetersCardPropsType) {
  return (
    <Card>
      <BlockStack gap="base">
        <InlineStack justifyContent="space-between" alignItems="center">
          <BlockStack gap="small-400">
            <Text as="h3" fontWeight="semibold">
              Current Billing Cycle Resource Quotas
            </Text>
            <Text color="subdued" variant="bodySm">
              Real-time consumption meters. Quota resets on {cycleEndDate}.
            </Text>
          </BlockStack>
          <Badge tone="neutral">Monthly Usage Metering</Badge>
        </InlineStack>

        <Divider />

        <BlockStack gap="base">
          {usage.map((quota) => {
            const percentage = Math.round((quota.used / quota.total) * 100);
            const isNearLimit = percentage >= quota.warningThreshold;
            const tone =
              percentage >= 90
                ? "critical"
                : percentage >= quota.warningThreshold
                  ? "caution"
                  : "success";

            return (
              <BlockStack key={quota.resource} gap="small-400">
                <InlineStack justifyContent="space-between" alignItems="center">
                  <InlineStack gap="small-200" alignItems="center">
                    <Text fontWeight="semibold" variant="bodySm">
                      {quota.resource}
                    </Text>
                    {isNearLimit && (
                      <Badge tone={tone}>
                        {percentage >= 90 ? "High Usage Alert" : "Approaching Limit"}
                      </Badge>
                    )}
                  </InlineStack>
                  <Text variant="bodySm" fontWeight="medium">
                    {quota.used.toLocaleString()} / {quota.total.toLocaleString()} {quota.unit} ({percentage}%)
                  </Text>
                </InlineStack>

                <ProgressBar
                  progress={percentage}
                  tone={tone}
                  size="base"
                />
              </BlockStack>
            );
          })}
        </BlockStack>
      </BlockStack>
    </Card>
  );
}

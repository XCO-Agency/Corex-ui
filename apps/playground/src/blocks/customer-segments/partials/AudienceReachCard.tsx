import * as React from "react";
import {
  Card,
  BlockStack,
  InlineStack,
  Text,
  Badge,
  Box,
  Divider,
} from "@xco-agency/corex-ui";

type AudienceReachCardPropsType = {
  matchingCount: number;
  totalCustomers: number;
  averageLtv: number;
};

export function AudienceReachCard({
  matchingCount,
  totalCustomers,
  averageLtv,
}: AudienceReachCardPropsType) {
  const percentage = ((matchingCount / totalCustomers) * 100).toFixed(1);

  return (
    <BlockStack gap="base">
      <Card>
        <BlockStack gap="base">
          <Text as="h3" fontWeight="semibold">
            Estimated Audience Reach
          </Text>

          <Box padding="small" background="subdued" borderRadius="base">
            <BlockStack gap="small-400">
              <Text color="subdued" variant="bodySm">
                Matching Customers
              </Text>
              <Text as="h2" fontWeight="bold">
                {matchingCount.toLocaleString()}
              </Text>
              <InlineStack gap="small-200" alignItems="center">
                <Badge tone="success">{percentage}% of total base</Badge>
                <Text color="subdued" variant="bodySm">
                  ({totalCustomers.toLocaleString()} total)
                </Text>
              </InlineStack>
            </BlockStack>
          </Box>

          <Divider />

          <BlockStack gap="small-200">
            <InlineStack justifyContent="space-between">
              <Text color="subdued" variant="bodySm">
                Average Segment LTV
              </Text>
              <Text fontWeight="bold" variant="bodySm">
                ${averageLtv.toFixed(2)}
              </Text>
            </InlineStack>

            <InlineStack justifyContent="space-between">
              <Text color="subdued" variant="bodySm">
                Cohort Repeat Rate
              </Text>
              <Text fontWeight="bold" variant="bodySm">
                78.4%
              </Text>
            </InlineStack>

            <InlineStack justifyContent="space-between">
              <Text color="subdued" variant="bodySm">
                Sync Status
              </Text>
              <Badge tone="info">Live Dynamic</Badge>
            </InlineStack>
          </BlockStack>
        </BlockStack>
      </Card>
    </BlockStack>
  );
}

import * as React from "react";
import {
  Card,
  BlockStack,
  InlineStack,
  Text,
  Badge,
  Button,
  Divider,
  Box,
} from "@xco-agency/corex-ui";

type UpsellSummarySidebarCardPropsType = {
  enabled: boolean;
  selectedAddonCount: number;
  placement: string;
  milestoneEnabled: boolean;
  onToggleEnabled: (enabled: boolean) => void;
};

export function UpsellSummarySidebarCard({
  enabled,
  selectedAddonCount,
  placement,
  milestoneEnabled,
  onToggleEnabled,
}: UpsellSummarySidebarCardPropsType) {
  return (
    <BlockStack gap="base">
      <Card>
        <BlockStack gap="base">
          <Text as="h3" fontWeight="semibold">
            Status & Deployment
          </Text>

          <InlineStack justifyContent="space-between" alignItems="center">
            <Text color="subdued" variant="bodySm">
              Offer Status
            </Text>
            <Badge tone={enabled ? "success" : "neutral"}>
              {enabled ? "Active on Store" : "Draft / Paused"}
            </Badge>
          </InlineStack>

          <Button
            variant={enabled ? "secondary" : "primary"}
            onClick={() => onToggleEnabled(!enabled)}
          >
            {enabled ? "Deactivate Offer" : "Activate Offer"}
          </Button>

          <Divider />

          <BlockStack gap="small-200">
            <InlineStack justifyContent="space-between">
              <Text color="subdued" variant="bodySm">
                Placement
              </Text>
              <Text fontWeight="semibold" variant="bodySm">
                {placement.replace("_", " ")}
              </Text>
            </InlineStack>

            <InlineStack justifyContent="space-between">
              <Text color="subdued" variant="bodySm">
                Active Add-ons
              </Text>
              <Text fontWeight="semibold" variant="bodySm">
                {selectedAddonCount} products
              </Text>
            </InlineStack>

            <InlineStack justifyContent="space-between">
              <Text color="subdued" variant="bodySm">
                Reward Meter
              </Text>
              <Text fontWeight="semibold" variant="bodySm">
                {milestoneEnabled ? "Enabled" : "Disabled"}
              </Text>
            </InlineStack>
          </BlockStack>
        </BlockStack>
      </Card>

      <Card>
        <BlockStack gap="small">
          <Text as="h3" fontWeight="semibold">
            Estimated Impact
          </Text>
          <Box padding="small" background="subdued" borderRadius="base">
            <BlockStack gap="small-400">
              <Text variant="bodySm" color="subdued">
                Projected Average Order Value Boost
              </Text>
              <Text as="h2" fontWeight="bold">
                +$6.85 / order
              </Text>
              <Text variant="bodySm" color="subdued">
                Based on store checkout conversion history.
              </Text>
            </BlockStack>
          </Box>
        </BlockStack>
      </Card>
    </BlockStack>
  );
}

import * as React from "react";
import {
  Card,
  BlockStack,
  InlineStack,
  Text,
  Badge,
  Switch,
  Button,
  IconTile,
  Divider,
} from "@xco-agency/corex-ui";
import type { IntegrationCardPropsType } from "../types";

export function IntegrationCard({
  integration,
  onToggleSync,
  onConfigure,
}: IntegrationCardPropsType) {
  const isConnected = integration.status === "connected";

  return (
    <Card>
      <BlockStack gap="base">
        {/* Top: Icon Tile, Title, Status Badge */}
        <InlineStack
          justifyContent="space-between"
          alignItems="flex-start"
          gap="small-200"
        >
          <InlineStack gap="small-300" alignItems="center">
            <IconTile
              tone={integration.iconTone}
              color="base"
              size="md"
              borderRadius="base"
            >
              <span style={{ fontWeight: 700, fontSize: "14px" }}>
                {integration.name.slice(0, 2).toUpperCase()}
              </span>
            </IconTile>

            <BlockStack gap="none">
              <Text variant="base" heading>
                {integration.name}
              </Text>
              <Text variant="xs" tone="neutral">
                {integration.category.toUpperCase()}
              </Text>
            </BlockStack>
          </InlineStack>

          <Badge tone={isConnected ? "success" : "neutral"}>
            {isConnected ? "Connected" : "Disconnected"}
          </Badge>
        </InlineStack>

        <Text variant="small" tone="neutral">
          {integration.description}
        </Text>

        {isConnected && integration.lastSyncedAt && (
          <Text variant="xs" tone="neutral">
            Last sync: {integration.lastSyncedAt}
          </Text>
        )}
      </BlockStack>

      <BlockStack gap="small" paddingBlockStart="base">
        <Divider />

        <InlineStack justifyContent="space-between" alignItems="center" gap="small-200">
          {isConnected ? (
            <InlineStack gap="small-200" alignItems="center">
              <Switch
                label="Sync events"
                checked={integration.syncEnabled}
                onChange={(checked) => onToggleSync(integration.id, checked)}
              />
              <Text variant="xs" tone="neutral">
                {integration.syncEnabled ? "Syncing active" : "Sync paused"}
              </Text>
            </InlineStack>
          ) : (
            <Text variant="xs" tone="neutral">
              Not configured yet
            </Text>
          )}

          <Button
            variant={isConnected ? "secondary" : "primary"}
            onClick={() => onConfigure(integration)}
          >
            {isConnected ? "Configure" : "Connect"}
          </Button>
        </InlineStack>
      </BlockStack>
    </Card>
  );
}

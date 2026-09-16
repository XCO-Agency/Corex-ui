import * as React from "react";
import {
  Card,
  Box,
  BlockStack,
  InlineStack,
  Text,
  Badge,
  Button,
} from "@xco-agency/corex-ui";
import { AppIconBadge } from "../partials/AppIconBadge";
import { DEFAULT_APPS_LIST } from "../constants";
import type { AppCrossSellItemType } from "../types";

export function AppCrossSellCompactExample() {
  const [apps, setApps] = React.useState<AppCrossSellItemType[]>(
    DEFAULT_APPS_LIST.slice(0, 3)
  );

  const handleInstall = (id: string) => {
    setApps((current) =>
      current.map((a) => (a.id === id ? { ...a, installed: true } : a))
    );
  };

  const installedCount = apps.filter((a) => a.installed).length;

  return (
    <Box maxInlineSize="440px">
      <Card>
        <BlockStack gap="base">
          {/* Header */}
          <InlineStack justifyContent="space-between" alignItems="center">
            <BlockStack gap="small-500">
              <Text variant="headingSm" as="h3" fontWeight="bold">
                Ecosystem Partner Apps
              </Text>
              <Text variant="bodySm" tone="subdued">
                Save up to 30% by installing complementary apps
              </Text>
            </BlockStack>
            <Badge tone="success">Up to 30% off</Badge>
          </InlineStack>

          {/* Mini Tier Indicator */}
          <Box
            padding="small-200 base"
            background="bg-surface-secondary"
            borderRadius="small"
          >
            <InlineStack justifyContent="space-between" alignItems="center">
              <Text variant="bodySm" tone="subdued">
                {installedCount} of 3 active on store
              </Text>
              <Text variant="bodySm" fontWeight="semibold" tone="success">
                {installedCount >= 2 ? "15% Discount Active" : "Install 1 more for 10% off"}
              </Text>
            </InlineStack>
          </Box>

          {/* Compact App Rows */}
          <Box
            borderWidth="small-100"
            borderColor="border"
            borderRadius="base"
            overflow="hidden"
          >
            {apps.map((app, index) => (
              <Box
                key={app.id}
                padding="small-200 base"
                borderBlockEndWidth={index < apps.length - 1 ? "small-100" : "none"}
                borderColor="border-subdued"
                background="bg-surface"
              >
                <InlineStack justifyContent="space-between" alignItems="center" gap="base">
                  <InlineStack gap="small-300" alignItems="center">
                    <AppIconBadge
                      type={app.iconType}
                      bg={app.iconBg}
                      name={app.name}
                      size={32}
                    />

                    <BlockStack gap="none">
                      <Text variant="bodySm" fontWeight="semibold" truncate>
                        {app.name}
                      </Text>
                      <Text variant="bodySm" tone="subdued" truncate>
                        {app.category}
                      </Text>
                    </BlockStack>
                  </InlineStack>

                  <InlineStack shrink={false}>
                    {app.installed ? (
                      <Badge tone="success" size="small">
                        Installed
                      </Badge>
                    ) : (
                      <Button
                        size="small"
                        variant="secondary"
                        onClick={() => handleInstall(app.id)}
                      >
                        Install
                      </Button>
                    )}
                  </InlineStack>
                </InlineStack>
              </Box>
            ))}
          </Box>

          {/* Footer Link */}
          <InlineStack justifyContent="center">
            <Button variant="tertiary">
              View all 15 partner apps &rarr;
            </Button>
          </InlineStack>
        </BlockStack>
      </Card>
    </Box>
  );
}

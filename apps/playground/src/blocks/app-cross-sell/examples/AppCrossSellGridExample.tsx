import * as React from "react";
import {
  Card,
  Box,
  BlockStack,
  InlineStack,
  Grid,
  Text,
  Badge,
  Button,
} from "@xco-agency/corex-ui";
import { AppIconBadge } from "../partials/AppIconBadge";
import { AppCrossSellTierProgress } from "../partials/AppCrossSellTierProgress";
import { DEFAULT_APPS_LIST, DEFAULT_DISCOUNT_TIERS } from "../constants";
import type { AppCrossSellItemType } from "../types";

export function AppCrossSellGridExample() {
  const [apps, setApps] = React.useState<AppCrossSellItemType[]>(DEFAULT_APPS_LIST);

  const installedCount = apps.filter((a) => a.installed).length;
  const displayedApps = apps.slice(0, 6);

  const handleInstall = (id: string) => {
    setApps((current) =>
      current.map((a) => (a.id === id ? { ...a, installed: true } : a))
    );
  };

  return (
    <BlockStack gap="base">
      <Card>
        <BlockStack gap="base">
          {/* Header */}
          <BlockStack gap="small-300">
            <Text variant="headingMd" as="h2" fontWeight="bold">
              Get more from every customer and save up to 30%
            </Text>
            <Text variant="bodySm" tone="subdued" as="p">
              The more apps you install, the higher your revenue, the bigger your discount on all of them.
            </Text>
          </BlockStack>

          {/* Stepper progress */}
          <AppCrossSellTierProgress
            tiers={DEFAULT_DISCOUNT_TIERS}
            installedCount={installedCount}
          />

          {/* 3-Column App Cards Grid */}
          <Grid columns={{ sm: 1, md: 2, lg: 3 }} gap="base">
            {displayedApps.map((app) => (
              <Box
                key={app.id}
                borderWidth="small-100"
                borderColor="border"
                borderRadius="base"
                padding="base"
                background="bg-surface"
              >
                <BlockStack gap="base">
                  <BlockStack gap="small-300">
                    <InlineStack justifyContent="space-between" alignItems="flex-start">
                      <AppIconBadge
                        type={app.iconType}
                        bg={app.iconBg}
                        name={app.name}
                        size={44}
                      />

                      {app.installed ? (
                        <Badge tone="success" size="small">
                          Installed
                        </Badge>
                      ) : app.builtForShopify ? (
                        <Badge tone="info" size="small">
                          Built for Shopify
                        </Badge>
                      ) : null}
                    </InlineStack>

                    <BlockStack gap="small-500">
                      <Text variant="bodyMd" fontWeight="bold">
                        {app.name}
                      </Text>

                      {app.rating && (
                        <InlineStack gap="small-400" alignItems="center">
                          <Text variant="bodySm" fontWeight="semibold">
                            ★ {app.rating.toFixed(1)}
                          </Text>
                          {app.reviewsCount && (
                            <Text variant="bodySm" tone="subdued">
                              ({app.reviewsCount})
                            </Text>
                          )}
                          {app.pricingBadge && (
                            <Text variant="bodySm" tone="subdued">
                              • {app.pricingBadge}
                            </Text>
                          )}
                        </InlineStack>
                      )}
                    </BlockStack>

                    <Text variant="bodySm" tone="subdued" as="p">
                      {app.category}
                    </Text>
                  </BlockStack>

                  <Box
                    borderBlockStartWidth="small-100"
                    borderColor="border-subdued"
                    paddingBlockStart="small-200"
                  >
                    {app.installed ? (
                      <Button fullWidth disabled>
                        Installed on store
                      </Button>
                    ) : (
                      <Button
                        fullWidth
                        variant="primary"
                        onClick={() => handleInstall(app.id)}
                      >
                        {app.unlockDiscountText || "Install app"}
                      </Button>
                    )}
                  </Box>
                </BlockStack>
              </Box>
            ))}
          </Grid>
        </BlockStack>
      </Card>
    </BlockStack>
  );
}

import * as React from "react";
import {
  Card,
  Box,
  BlockStack,
  InlineStack,
  Grid,
  Page,
  Text,
  Badge,
  Button,
} from "@xco-agency/corex-ui";
import { AppIconBadge } from "../partials/AppIconBadge";
import { AppCrossSellTierProgress } from "../partials/AppCrossSellTierProgress";
import { DEFAULT_APPS_LIST, DEFAULT_DISCOUNT_TIERS } from "../constants";
import type { AppCrossSellItemType } from "../types";
import { getMaxDiscount, getNextTier } from "../utils";

export function AppCrossSellGridExample() {
  const [apps, setApps] = React.useState<AppCrossSellItemType[]>(DEFAULT_APPS_LIST);

  const installedCount = apps.filter((a) => a.installed).length;
  const displayedApps = apps.slice(0, 6);
  const nextTier = getNextTier(DEFAULT_DISCOUNT_TIERS, installedCount);
  const installLabel = nextTier
    ? `Install to unlock ${nextTier.discountPercent}% off`
    : "Install app";

  const handleInstall = (id: string) => {
    setApps((current) =>
      current.map((a) => (a.id === id ? { ...a, installed: true } : a)),
    );
  };

  return (
    <Page heading="Partner apps" inlineSize="large">
      <Card>
        <BlockStack gap="base">
          {/* Header */}
          <BlockStack gap="small-300">
            <Text variant="headingMd" as="h2" fontWeight="bold">
              {`Get more from every customer and save up to ${getMaxDiscount(DEFAULT_DISCOUNT_TIERS)}%`}
            </Text>
            <Text variant="bodySm" color="subdued" as="p">
              The more apps you install, the higher your revenue, the bigger your discount
              on all of them.
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
                        <Badge tone="success">Installed</Badge>
                      ) : app.builtForShopify ? (
                        <Badge tone="info">Built for Shopify</Badge>
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
                            <Text variant="bodySm" color="subdued">
                              ({app.reviewsCount})
                            </Text>
                          )}
                          {app.pricingBadge && (
                            <Text variant="bodySm" color="subdued">
                              • {app.pricingBadge}
                            </Text>
                          )}
                        </InlineStack>
                      )}
                    </BlockStack>

                    <Text variant="bodySm" color="subdued" as="p">
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
                        {installLabel}
                      </Button>
                    )}
                  </Box>
                </BlockStack>
              </Box>
            ))}
          </Grid>
        </BlockStack>
      </Card>
    </Page>
  );
}

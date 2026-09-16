import * as React from "react";
import {
  Card,
  Box,
  BlockStack,
  InlineStack,
  Text,
  Button,
} from "@xco-agency/corex-ui";
import type { AppCrossSellPropsType } from "./types";
import { DEFAULT_APPS_LIST, DEFAULT_DISCOUNT_TIERS } from "./constants";
import { AppCrossSellTierProgress } from "./partials/AppCrossSellTierProgress";
import { AppCrossSellRow } from "./partials/AppCrossSellRow";

export function AppCrossSell({
  title = "Get more from every customer and save up to 30%",
  description = "The more apps you install, the higher your revenue, the bigger your discount on all of them.",
  tiers = DEFAULT_DISCOUNT_TIERS,
  apps = DEFAULT_APPS_LIST,
  onInstall,
  onDismiss,
  installedCount,
}: AppCrossSellPropsType) {
  const [showAll, setShowAll] = React.useState(false);

  const currentInstalledCount =
    installedCount !== undefined
      ? installedCount
      : apps.filter((app) => app.installed).length;

  // Compute next unlockable discount percentage
  const nextDiscount =
    currentInstalledCount < 2 ? "10%" : currentInstalledCount < 3 ? "20%" : "30%";

  const displayedApps = showAll ? apps : apps.slice(0, 5);

  return (
    <Card>
      <BlockStack gap="base">
        {/* Header with Title, Description, and Close Button */}
        <InlineStack justifyContent="space-between" alignItems="flex-start" gap="base">
          <BlockStack gap="small-300">
            <Text variant="headingMd" as="h2" fontWeight="bold">
              {title}
            </Text>
            <Text variant="bodySm" tone="subdued" as="p">
              {description}
            </Text>
          </BlockStack>

          {onDismiss && (
            <Button
              variant="tertiary"
              icon="cancel"
              accessibilityLabel="Dismiss promotion"
              onClick={onDismiss}
            />
          )}
        </InlineStack>

        {/* Milestone Discount Stepper */}
        <AppCrossSellTierProgress
          tiers={tiers}
          installedCount={currentInstalledCount}
        />

        {/* Bordered Apps Container */}
        <Box
          borderWidth="small-100"
          borderColor="border"
          borderRadius="base"
          background="bg-surface"
          overflow="hidden"
        >
          {displayedApps.map((app, index) => {
            const formattedApp = {
              ...app,
              unlockDiscountText:
                app.unlockDiscountText || `Install to unlock ${nextDiscount} off`,
            };

            return (
              <AppCrossSellRow
                key={app.id}
                app={formattedApp}
                onInstall={onInstall}
                isLast={index === displayedApps.length - 1 && (!apps.length || apps.length <= 5 || showAll)}
              />
            );
          })}

          {apps.length > 5 && (
            <Box
              padding="small-200 base"
              borderBlockStartWidth="small-100"
              borderColor="border-subdued"
              background="bg-surface-secondary"
            >
              <InlineStack justifyContent="center">
                <Button variant="tertiary" onClick={() => setShowAll(!showAll)}>
                  {showAll ? "Show fewer apps" : `View all ${apps.length} available apps`}
                </Button>
              </InlineStack>
            </Box>
          )}
        </Box>
      </BlockStack>
    </Card>
  );
}

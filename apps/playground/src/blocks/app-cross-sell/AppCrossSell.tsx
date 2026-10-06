import * as React from "react";
import { Card, Box, BlockStack, InlineStack, Text, Button } from "@xco-agency/corex-ui";
import type { AppCrossSellPropsType } from "./types";
import { DEFAULT_APPS_LIST, DEFAULT_DISCOUNT_TIERS } from "./constants";
import { AppCrossSellTierProgress } from "./partials/AppCrossSellTierProgress";
import { AppCrossSellRow } from "./partials/AppCrossSellRow";
import { getMaxDiscount, getNextTier } from "./utils";

const COLLAPSED_APP_COUNT = 5;

export function AppCrossSell({
  title,
  description = "The more apps you install, the higher your revenue, the bigger your discount on all of them.",
  tiers = DEFAULT_DISCOUNT_TIERS,
  apps = DEFAULT_APPS_LIST,
  onInstall,
  onDismiss,
  installedCount,
}: AppCrossSellPropsType) {
  const [showAll, setShowAll] = React.useState(false);
  const [installingId, setInstallingId] = React.useState<string | null>(null);

  const currentInstalledCount =
    installedCount !== undefined
      ? installedCount
      : apps.filter((app) => app.installed).length;

  const resolvedTitle =
    title ?? `Get more from every customer and save up to ${getMaxDiscount(tiers)}%`;
  const nextTier = getNextTier(tiers, currentInstalledCount);
  const installLabel = nextTier
    ? `Install to unlock ${nextTier.discountPercent}% off`
    : "Install";

  // Apps still to install come first, so the collapsed list shows what matters.
  const sortedApps = [...apps].sort((a, b) => Number(a.installed) - Number(b.installed));
  const displayedApps = showAll ? sortedApps : sortedApps.slice(0, COLLAPSED_APP_COUNT);

  const handleInstall = async (appId: string) => {
    setInstallingId(appId);
    try {
      await onInstall?.(appId);
    } finally {
      setInstallingId(null);
    }
  };

  return (
    <Card>
      <BlockStack gap="base">
        <InlineStack justifyContent="space-between" alignItems="flex-start" gap="base">
          <BlockStack gap="small-300">
            <Text variant="headingMd" as="h2" fontWeight="bold">
              {resolvedTitle}
            </Text>
            <Text variant="bodySm" color="subdued" as="p">
              {description}
            </Text>
          </BlockStack>

          {onDismiss && (
            <Button
              variant="tertiary"
              icon="x"
              accessibilityLabel="Dismiss promotion"
              onClick={onDismiss}
            />
          )}
        </InlineStack>

        <AppCrossSellTierProgress tiers={tiers} installedCount={currentInstalledCount} />

        <Box
          borderWidth="small-100"
          borderColor="border"
          borderRadius="base"
          background="bg-surface"
          overflow="hidden"
        >
          {displayedApps.map((app, index) => (
            <AppCrossSellRow
              key={app.id}
              app={app}
              installLabel={installLabel}
              installing={installingId === app.id}
              onInstall={handleInstall}
              isLast={
                index === displayedApps.length - 1 && !(apps.length > COLLAPSED_APP_COUNT)
              }
            />
          ))}

          {apps.length > COLLAPSED_APP_COUNT && (
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

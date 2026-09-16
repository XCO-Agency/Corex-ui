import * as React from "react";
import { Box, BlockStack, InlineStack, Button, Text } from "@xco-agency/corex-ui";
import { AppCrossSell } from "../AppCrossSell";
import { DEFAULT_APPS_LIST, DEFAULT_DISCOUNT_TIERS } from "../constants";
import type { AppCrossSellItemType } from "../types";

export function AppCrossSellExample() {
  const [apps, setApps] = React.useState<AppCrossSellItemType[]>(DEFAULT_APPS_LIST);
  const [isDismissed, setIsDismissed] = React.useState(false);

  const installedCount = apps.filter((a) => a.installed).length;

  const handleInstall = (appId: string) => {
    setApps((current) =>
      current.map((app) => (app.id === appId ? { ...app, installed: true } : app))
    );
  };

  const handleReset = () => {
    setApps(DEFAULT_APPS_LIST);
    setIsDismissed(false);
  };

  return (
    <BlockStack gap="base">
      {!isDismissed ? (
        <AppCrossSell
          apps={apps}
          tiers={DEFAULT_DISCOUNT_TIERS}
          installedCount={installedCount}
          onInstall={handleInstall}
          onDismiss={() => setIsDismissed(true)}
        />
      ) : (
        <Box
          padding="base"
          background="subdued"
          borderRadius="base"
        >
          <InlineStack justifyContent="space-between" alignItems="center">
            <Text color="subdued">Cross-sell promotion banner was dismissed.</Text>
            <Button variant="secondary" onClick={() => setIsDismissed(false)}>
              Restore Banner
            </Button>
          </InlineStack>
        </Box>
      )}

      {/* Demo Controls */}
      <InlineStack justifyContent="space-between" alignItems="center">
        <Text variant="bodySm" color="subdued">
          Interactive demo: Click &quot;Install&quot; on any app to unlock higher discounts ({installedCount} of {apps.length} active).
        </Text>
        <Button variant="tertiary" onClick={handleReset}>
          Reset Apps State
        </Button>
      </InlineStack>
    </BlockStack>
  );
}

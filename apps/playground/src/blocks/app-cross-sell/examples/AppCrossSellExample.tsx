import * as React from "react";
import { Box, BlockStack, InlineStack, Button, Page, Text } from "@xco-agency/corex-ui";
import { AppCrossSell } from "../AppCrossSell";
import { DEFAULT_APPS_LIST, DEFAULT_DISCOUNT_TIERS } from "../constants";
import type { AppCrossSellItemType } from "../types";

export function AppCrossSellExample() {
  const [apps, setApps] = React.useState<AppCrossSellItemType[]>(DEFAULT_APPS_LIST);
  const [isDismissed, setIsDismissed] = React.useState(false);

  const installedCount = apps.filter((app) => app.installed).length;

  // Stand-in for the real install round trip, so the row shows its loading state.
  const handleInstall = (appId: string) =>
    new Promise<void>((resolve) => {
      setTimeout(() => {
        setApps((current) =>
          current.map((app) => (app.id === appId ? { ...app, installed: true } : app)),
        );
        resolve();
      }, 700);
    });

  const handleReset = () => {
    setApps(DEFAULT_APPS_LIST);
    setIsDismissed(false);
  };

  return (
    <Page
      heading="Partner apps"
      subtitle="Install more apps from the same team and save on all of them."
      inlineSize="large"
      secondaryActions={[{ content: "Reset demo", onAction: handleReset }]}
    >
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
          <Box padding="base" background="subdued" borderRadius="base">
            <InlineStack justifyContent="space-between" alignItems="center">
              <Text color="subdued">Cross-sell promotion banner was dismissed.</Text>
              <Button variant="secondary" onClick={() => setIsDismissed(false)}>
                Restore banner
              </Button>
            </InlineStack>
          </Box>
        )}
      </BlockStack>
    </Page>
  );
}

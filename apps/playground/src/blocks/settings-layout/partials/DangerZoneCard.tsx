import * as React from "react";
import {
  Card,
  BlockStack,
  InlineStack,
  Banner,
  Button,
  Text,
} from "@xco-agency/corex-ui";

export type DangerZoneCardPropsType = {
  onReset?: () => void;
};

export function DangerZoneCard({ onReset }: DangerZoneCardPropsType) {
  const [confirming, setConfirming] = React.useState(false);

  return (
    <Card title="Danger zone">
      <BlockStack gap="400">
        <Banner title="Reset all configuration to defaults" tone="critical">
          <Text as="p" variant="bodySm">
            This action will revoke active API tokens, reset notification webhook
            bindings, and restore original store preferences. This action cannot be
            undone.
          </Text>
        </Banner>

        <InlineStack align="start" gap="300">
          {confirming ? (
            <InlineStack gap="200">
              <Button
                variant="primary"
                tone="critical"
                onClick={() => {
                  setConfirming(false);
                  onReset?.();
                }}
              >
                Yes, confirm reset
              </Button>
              <Button variant="secondary" onClick={() => setConfirming(false)}>
                Cancel
              </Button>
            </InlineStack>
          ) : (
            <Button
              variant="secondary"
              tone="critical"
              onClick={() => setConfirming(true)}
            >
              Reset store settings
            </Button>
          )}
        </InlineStack>
      </BlockStack>
    </Card>
  );
}

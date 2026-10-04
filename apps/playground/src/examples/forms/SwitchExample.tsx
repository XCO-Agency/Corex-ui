import { useState } from "react";
import { BlockStack, Card, Switch, Text } from "@xco-agency/corex-ui";

export function SwitchExample() {
  const [enabled, setEnabled] = useState(true);

  return (
    <Card>
      <BlockStack gap="base">
        <Switch
          label="Enable automatic order notifications"
          checked={enabled}
          onChange={(checked) => setEnabled(checked)}
          details="Send email updates to customers when order fulfillment status changes."
        />
        <Text color="subdued">
          Notifications are currently {enabled ? "active" : "disabled"}.
        </Text>
      </BlockStack>
    </Card>
  );
}

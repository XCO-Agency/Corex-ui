import { useState } from "react";
import { BlockStack, Grid, PasswordField, Text } from "@xco-agency/corex-ui";

export function PasswordFieldExample() {
  const [apiKey, setApiKey] = useState("shpat_123456789abcdef");
  const [webhookSecret, setWebhookSecret] = useState("");

  return (
    <Grid columns={2} gap="base">
      <Grid.Item>
        <BlockStack gap="base">
          <PasswordField
            label="Shopify Admin API access token"
            value={apiKey}
            details="Masked for security. Used to authenticate webhook listeners"
            onChange={(val) => setApiKey(val)}
          />
          <Text variant="small" tone="subdued">
            Token length: {apiKey.length} chars
          </Text>
        </BlockStack>
      </Grid.Item>

      <Grid.Item>
        <BlockStack gap="base">
          <PasswordField
            label="Webhook signing secret"
            value={webhookSecret}
            placeholder="Enter private signing secret"
            minLength={8}
            details="Used to verify HMAC signatures of incoming events"
            onChange={(val) => setWebhookSecret(val)}
          />
          <Text variant="small" tone="subdued">
            Secret configured: {webhookSecret ? "Yes" : "No"}
          </Text>
        </BlockStack>
      </Grid.Item>
    </Grid>
  );
}

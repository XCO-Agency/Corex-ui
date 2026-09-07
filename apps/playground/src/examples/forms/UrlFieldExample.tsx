import { useState } from "react";
import { BlockStack, Grid, UrlField, Text } from "@xco-agency/corex-ui";

export function UrlFieldExample() {
  const [storeUrl, setStoreUrl] = useState("https://my-awesome-store.myshopify.com");
  const [webhookUrl, setWebhookUrl] = useState("https://api.example.com/webhooks/orders");

  return (
    <Grid columns={2} gap="base">
      <Grid.Item>
        <BlockStack gap="base">
          <UrlField
            label="Custom store domain"
            value={storeUrl}
            placeholder="https://example.com"
            details="The public address where customers visit your storefront"
            onChange={(val) => setStoreUrl(val)}
          />
          <Text variant="small" tone="subdued">Domain: {storeUrl}</Text>
        </BlockStack>
      </Grid.Item>

      <Grid.Item>
        <BlockStack gap="base">
          <UrlField
            label="Webhook callback URL"
            value={webhookUrl}
            placeholder="https://your-api.com/webhook"
            details="Shopify will POST event payloads to this HTTPS endpoint"
            onChange={(val) => setWebhookUrl(val)}
          />
          <Text variant="small" tone="subdued">Endpoint: {webhookUrl}</Text>
        </BlockStack>
      </Grid.Item>
    </Grid>
  );
}

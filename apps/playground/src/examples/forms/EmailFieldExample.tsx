import { useState } from "react";
import { BlockStack, Grid, EmailField, Text } from "@xco-agency/corex-ui";

export function EmailFieldExample() {
  const [supportEmail, setSupportEmail] = useState("support@myshopify.com");
  const [billingEmail, setBillingEmail] = useState("");

  return (
    <Grid columns={2} gap="base">
      <Grid.Item>
        <BlockStack gap="base">
          <EmailField
            label="Customer support email"
            value={supportEmail}
            autoComplete="email"
            details="Customers will see this address in automated receipt emails"
            onChange={(val) => setSupportEmail(val)}
          />
          <Text variant="small" tone="subdued">
            Current: {supportEmail}
          </Text>
        </BlockStack>
      </Grid.Item>

      <Grid.Item>
        <BlockStack gap="base">
          <EmailField
            label="Billing contact email"
            value={billingEmail}
            placeholder="billing@example.com"
            requiredIndicator
            details="Invoices and payout statements will be sent here"
            onChange={(val) => setBillingEmail(val)}
          />
          <Text variant="small" tone="subdued">
            Current: {billingEmail || "(empty)"}
          </Text>
        </BlockStack>
      </Grid.Item>
    </Grid>
  );
}

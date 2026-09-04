import { Card, BlockStack, Banner, Checkbox, Select, Divider } from "@xco-agency/corex-ui";
import type { NotificationSettingsFormType } from "../types";

export type NotificationSettingsCardPropsType = {
  data: NotificationSettingsFormType;
  onChange: <K extends keyof NotificationSettingsFormType>(
    field: K,
    value: NotificationSettingsFormType[K]
  ) => void;
};

export function NotificationSettingsCard({
  data,
  onChange,
}: NotificationSettingsCardPropsType) {
  return (
    <Card title="Customer notifications">
      <BlockStack gap="400">
        <Banner title="Shopify notifications active" tone="info">
          Automated customer emails are processed directly through Shopify&apos;s webhook
          infrastructure with high deliverability guarantees.
        </Banner>

        <BlockStack gap="300">
          <Checkbox
            label="Send order confirmation emails"
            checked={data.orderConfirmationEmail}
            onChange={(checked) => onChange("orderConfirmationEmail", checked)}
            helpText="Sends an immediate receipt to the buyer once payment completes."
          />

          <Checkbox
            label="Send shipping updates via SMS"
            checked={data.shippingUpdatesSms}
            onChange={(checked) => onChange("shippingUpdatesSms", checked)}
            helpText="Notifies customers on carrier tracking updates and delivery milestones."
          />

          <Checkbox
            label="Low inventory notifications"
            checked={data.inventoryAlerts}
            onChange={(checked) => onChange("inventoryAlerts", checked)}
            helpText="Triggers an alert when a product variant drops below 5 units."
          />
        </BlockStack>

        <Divider />

        <BlockStack gap="300">
          <Checkbox
            label="Weekly performance digest"
            checked={data.weeklyDigest}
            onChange={(checked) => onChange("weeklyDigest", checked)}
            helpText="Receive a curated summary of sales, refunds, and cart conversions."
          />

          {data.weeklyDigest && (
            <Select
              label="Delivery schedule"
              value={data.digestFrequency}
              onChange={(val) => onChange("digestFrequency", val)}
              options={[
                { label: "Every Monday at 9:00 AM", value: "monday_morning" },
                { label: "Every Friday at 5:00 PM", value: "friday_afternoon" },
                { label: "First day of each month", value: "monthly" },
              ]}
            />
          )}
        </BlockStack>
      </BlockStack>
    </Card>
  );
}

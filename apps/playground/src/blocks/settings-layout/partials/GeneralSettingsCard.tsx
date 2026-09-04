import {
  Card,
  BlockStack,
  InlineStack,
  Box,
  TextField,
  Select,
  Badge,
  Text,
} from "@xco-agency/corex-ui";
import type { GeneralSettingsFormType } from "../types";

export type GeneralSettingsCardPropsType = {
  data: GeneralSettingsFormType;
  onChange: (field: keyof GeneralSettingsFormType, value: string) => void;
};

export function GeneralSettingsCard({ data, onChange }: GeneralSettingsCardPropsType) {
  return (
    <Card title="Store profile">
      <BlockStack gap="400">
        <InlineStack gap="200" align="start" blockAlign="center">
          <Text as="span" variant="bodySm" tone="neutral">
            Store status:
          </Text>
          <Badge tone="success">Active</Badge>
        </InlineStack>

        <TextField
          label="Store name"
          value={data.storeName}
          onChange={(val) => onChange("storeName", val)}
          helpText="This name will appear on receipts and customer invoices."
        />

        <InlineStack gap="400">
          <Box width="100%">
            <TextField
              label="Account email"
              type="email"
              value={data.accountEmail}
              onChange={(val) => onChange("accountEmail", val)}
              helpText="Shopify will use this to contact you."
            />
          </Box>
          <Box width="100%">
            <TextField
              label="Sender phone"
              type="tel"
              value={data.senderPhone}
              onChange={(val) => onChange("senderPhone", val)}
              placeholder="+1 (555) 000-0000"
            />
          </Box>
        </InlineStack>

        <InlineStack gap="400">
          <Box width="100%">
            <Select
              label="Store currency"
              value={data.storeCurrency}
              onChange={(val) => onChange("storeCurrency", val)}
              options={[
                { label: "USD ($) - United States Dollar", value: "USD" },
                { label: "EUR (€) - Euro", value: "EUR" },
                { label: "GBP (£) - British Pound", value: "GBP" },
                { label: "CAD ($) - Canadian Dollar", value: "CAD" },
                { label: "AUD ($) - Australian Dollar", value: "AUD" },
              ]}
            />
          </Box>
          <Box width="100%">
            <Select
              label="Standards and formats"
              value={data.unitSystem}
              onChange={(val) => onChange("unitSystem", val)}
              options={[
                { label: "Metric system (kg, cm)", value: "metric" },
                { label: "Imperial system (lb, in)", value: "imperial" },
              ]}
            />
          </Box>
        </InlineStack>

        <Select
          label="Timezone"
          value={data.timezone}
          onChange={(val) => onChange("timezone", val)}
          options={[
            { label: "(GMT-05:00) Eastern Time (US & Canada)", value: "America/New_York" },
            { label: "(GMT-08:00) Pacific Time (US & Canada)", value: "America/Los_Angeles" },
            { label: "(GMT+00:00) UTC", value: "UTC" },
            { label: "(GMT+01:00) London, Lisbon, Casablanca", value: "Europe/London" },
            { label: "(GMT+02:00) Paris, Berlin, Rome", value: "Europe/Paris" },
            { label: "(GMT+09:00) Tokyo, Osaka", value: "Asia/Tokyo" },
          ]}
        />
      </BlockStack>
    </Card>
  );
}

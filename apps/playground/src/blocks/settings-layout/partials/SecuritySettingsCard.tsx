import {
  Card,
  BlockStack,
  InlineStack,
  TextField,
  Checkbox,
  Badge,
  Button,
  Divider,
  Text,
} from "@xco-agency/corex-ui";
import type { SecuritySettingsFormType } from "../types";

export type SecuritySettingsCardPropsType = {
  data: SecuritySettingsFormType;
  onChange: <K extends keyof SecuritySettingsFormType>(
    field: K,
    value: SecuritySettingsFormType[K],
  ) => void;
};

export function SecuritySettingsCard({ data, onChange }: SecuritySettingsCardPropsType) {
  return (
    <Card title="Security & API credentials">
      <BlockStack gap="400">
        <InlineStack gap="200" align="start" blockAlign="center">
          <Text as="span" variant="bodySm" tone="neutral">
            Environment mode:
          </Text>
          <Badge tone="info">Production</Badge>
        </InlineStack>

        <BlockStack gap="300">
          <Checkbox
            label="Enforce two-factor authentication (2FA) for staff"
            checked={data.requireTwoFactor}
            onChange={(checked) => onChange("requireTwoFactor", checked)}
            helpText="All collaborator accounts must have an authenticator app linked."
          />

          <Checkbox
            label="Enable REST & GraphQL API access"
            checked={data.apiAccessEnabled}
            onChange={(checked) => onChange("apiAccessEnabled", checked)}
            helpText="Permits external webhook subscribers and headless storefront queries."
          />
        </BlockStack>

        <Divider />

        <BlockStack gap="200">
          <TextField
            label="Webhook signing secret"
            value={data.webhookSecret}
            onChange={(val) => onChange("webhookSecret", val)}
            helpText="Used to verify HMAC SHA256 signatures on incoming payload headers."
          />
          <InlineStack align="start">
            <Button
              variant="secondary"
              onClick={() => {
                const randomSecret = `whsec_${Math.random().toString(36).slice(2, 18)}`;
                onChange("webhookSecret", randomSecret);
              }}
            >
              Rotate secret key
            </Button>
          </InlineStack>
        </BlockStack>

        <TextField
          label="IP Whitelist (optional)"
          value={data.ipWhitelist}
          onChange={(val) => onChange("ipWhitelist", val)}
          placeholder="192.168.1.1, 10.0.0.0/24"
          helpText="Comma-separated list of IPv4 or CIDR blocks authorized for admin API calls."
        />
      </BlockStack>
    </Card>
  );
}

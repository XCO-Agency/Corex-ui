import * as React from "react";
import {
  Modal,
  BlockStack,
  TextField,
  Text,
  Badge,
  InlineStack,
  Button,
} from "@xco-agency/corex-ui";
import type { IntegrationConfigModalPropsType } from "../types";

export function IntegrationConfigModal({
  open,
  integration,
  onClose,
  onSave,
  onTestConnection,
}: IntegrationConfigModalPropsType) {
  const [keyOrUrl, setKeyOrUrl] = React.useState("");
  const [testing, setTesting] = React.useState(false);
  const [testResult, setTestResult] = React.useState<"success" | "error" | null>(null);

  React.useEffect(() => {
    if (integration) {
      setKeyOrUrl(integration.apiKey ?? integration.webhookUrl ?? "");
      setTestResult(null);
    }
  }, [integration]);

  if (!integration) return null;

  const isWebhook = integration.category === "webhooks";

  const handleTest = async () => {
    setTesting(true);
    const ok = await onTestConnection(integration.id);
    setTesting(false);
    setTestResult(ok ? "success" : "error");
  };

  const handleSave = () => {
    if (isWebhook) {
      onSave(integration.id, { webhookUrl: keyOrUrl });
    } else {
      onSave(integration.id, { apiKey: keyOrUrl });
    }
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={`Configure ${integration.name}`}
      primaryAction={{
        content: "Save configuration",
        onAction: handleSave,
      }}
      secondaryActions={[
        {
          content: "Cancel",
          onAction: onClose,
        },
      ]}
    >
      <BlockStack gap="base">
        <Text variant="small" tone="neutral">
          {integration.description}
        </Text>

        <TextField
          label={isWebhook ? "Webhook endpoint URL" : "Private API Key / Token"}
          value={keyOrUrl}
          onChange={(val) => {
            setKeyOrUrl(val);
            setTestResult(null);
          }}
          placeholder={
            isWebhook
              ? "https://api.yourdomain.com/webhooks/orders"
              : "e.g. pk_live_..."
          }
          helpText="Credentials are encrypted at rest using AES-256."
        />

        <InlineStack
          justifyContent="space-between"
          alignItems="center"
          gap="small-200"
        >
          <Button
            variant="secondary"
            loading={testing}
            disabled={!keyOrUrl.trim()}
            onClick={handleTest}
          >
            Test connection
          </Button>

          {testResult === "success" && (
            <Badge tone="success">Connection verified (200 OK)</Badge>
          )}
          {testResult === "error" && (
            <Badge tone="critical">Connection failed (Timed out)</Badge>
          )}
        </InlineStack>
      </BlockStack>
    </Modal>
  );
}

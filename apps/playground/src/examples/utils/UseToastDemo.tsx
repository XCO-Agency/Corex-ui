import { useState } from "react";
import {
  Badge,
  Banner,
  BlockStack,
  Button,
  Card,
  Divider,
  InlineStack,
  Text,
  TextField,
  useToast,
} from "@xco-agency/corex-ui";

export function UseToastDemo() {
  const toast = useToast();
  const [message, setMessage] = useState("Settings saved successfully");
  const [activeToast, setActiveToast] = useState<{
    text: string;
    isError?: boolean;
  } | null>(null);

  const showNotification = (msg: string, isError = false, duration = 3000) => {
    // App Bridge native toast call
    toast.show(msg, { isError, duration });

    // Local preview banner
    setActiveToast({ text: msg, isError });
    setTimeout(() => {
      setActiveToast(null);
    }, duration);
  };

  return (
    <Card>
      <BlockStack gap="base">
        <InlineStack gap="base" justifyContent="space-between" blockAlign="center">
          <BlockStack gap="small-200">
            <Text as="h3" variant="base" heading>
              App Bridge Toast Notifier
            </Text>
            <Text as="p" color="subdued">
              Dispatches native, non-blocking Shopify App Bridge toast confirmations
              across the admin.
            </Text>
          </BlockStack>
          <Badge tone="info">Native App Bridge</Badge>
        </InlineStack>

        {activeToast && (
          <Banner
            tone={activeToast.isError ? "critical" : "success"}
            title={activeToast.isError ? "Toast Error" : "Toast Notification"}
          >
            {activeToast.text}
          </Banner>
        )}

        <TextField
          label="Custom Message"
          value={message}
          onChange={setMessage}
          helpText="Customize the notification text to test different messages."
        />

        <Divider />

        <InlineStack gap="small-200" wrap>
          <Button
            variant="primary"
            onClick={() => showNotification(message || "Operation succeeded", false)}
          >
            Show Success Toast
          </Button>

          <Button
            tone="critical"
            onClick={() =>
              showNotification(
                message ? `Error: ${message}` : "Failed to update inventory",
                true,
              )
            }
          >
            Show Error Toast
          </Button>

          <Button
            onClick={() =>
              showNotification(
                message ? `${message} (stays 6s)` : "Extended duration message",
                false,
                6000,
              )
            }
          >
            Show 6s Toast
          </Button>
        </InlineStack>
      </BlockStack>
    </Card>
  );
}

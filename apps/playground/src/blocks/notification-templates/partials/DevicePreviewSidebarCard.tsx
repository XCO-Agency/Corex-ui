import * as React from "react";
import {
  Card,
  BlockStack,
  InlineStack,
  Text,
  Badge,
  Button,
  Box,
} from "@xco-agency/corex-ui";
import { TEMPLATE_VARIABLE_TAGS } from "../constants";
import type { NotificationTemplateFormType } from "../types";

type DevicePreviewSidebarCardPropsType = {
  template: NotificationTemplateFormType;
  onSendTest: () => void;
};

export function DevicePreviewSidebarCard({
  template,
  onSendTest,
}: DevicePreviewSidebarCardPropsType) {
  // Replace placeholders with realistic customer sample data
  const interpolatedMessage = React.useMemo(() => {
    let text = template.bodyText;
    for (const tag of TEMPLATE_VARIABLE_TAGS) {
      text = text.split(tag.key).join(tag.sampleValue);
    }
    return text;
  }, [template.bodyText]);

  return (
    <BlockStack gap="base">
      <Card>
        <BlockStack gap="base">
          <InlineStack justifyContent="space-between" alignItems="center">
            <Text as="h3" fontWeight="semibold">
              Live Mockup Preview
            </Text>
            <Badge tone="info">{template.channel.toUpperCase()}</Badge>
          </InlineStack>

          <Text color="subdued" variant="bodySm">
            Real-time preview rendered with sample customer & order data.
          </Text>

          {/* Smartphone device frame */}
          <div
            style={{
              borderRadius: "24px",
              border: "8px solid #1a1a1a",
              background: "#ffffff",
              padding: "16px",
              boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
              maxWidth: "320px",
              margin: "0 auto",
              width: "100%",
              boxSizing: "border-box",
            }}
          >
            {/* Phone notch */}
            <div
              style={{
                width: "60px",
                height: "6px",
                background: "#e0e0e0",
                borderRadius: "3px",
                margin: "0 auto 12px auto",
              }}
            />

            {template.channel === "sms" ? (
              <BlockStack gap="small-200">
                <Text alignment="center" color="subdued" variant="bodySm">
                  Today 10:42 AM
                </Text>

                {/* SMS Bubble */}
                <div
                  style={{
                    background: "#007aff",
                    color: "#ffffff",
                    borderRadius: "16px",
                    borderBottomRightRadius: "4px",
                    padding: "12px 14px",
                    fontSize: "13px",
                    lineHeight: "1.4",
                    wordBreak: "break-word",
                  }}
                >
                  {interpolatedMessage}
                </div>
              </BlockStack>
            ) : (
              <BlockStack gap="small">
                <Box padding="small" background="subdued" borderRadius="base">
                  <Text fontWeight="semibold" variant="bodySm">
                    Subject: {template.subject}
                  </Text>
                  <Text color="subdued" variant="bodySm">
                    From: {template.senderName}
                  </Text>
                </Box>
                <Text variant="bodySm">{interpolatedMessage}</Text>
              </BlockStack>
            )}
          </div>

          <Button variant="secondary" icon="send" onClick={onSendTest}>
            Send Test to My Phone / Email
          </Button>
        </BlockStack>
      </Card>
    </BlockStack>
  );
}

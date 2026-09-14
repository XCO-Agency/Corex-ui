import * as React from "react";
import { Modal, BlockStack, Text, Badge, InlineStack } from "@xco-agency/corex-ui";
import type { ActivityPayloadModalPropsType } from "../types";

export function ActivityPayloadModal({
  open,
  item,
  onClose,
}: ActivityPayloadModalPropsType) {
  const [copied, setCopied] = React.useState(false);

  if (!item || !item.payload) return null;

  const jsonString = JSON.stringify(item.payload, null, 2);

  const handleCopy = () => {
    navigator.clipboard?.writeText(jsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={`Event Payload: ${item.title}`}
      primaryAction={{
        content: copied ? "Copied to clipboard!" : "Copy payload JSON",
        onAction: handleCopy,
      }}
      secondaryActions={[
        {
          content: "Close",
          onAction: onClose,
        },
      ]}
    >
      <BlockStack gap="base">
        <InlineStack gap="small-200" alignItems="center">
          <Badge tone={item.badgeTone}>{item.badgeText}</Badge>
          <Text variant="small" tone="neutral">
            Event ID: {item.id} • {item.timestamp}
          </Text>
        </InlineStack>

        <pre
          style={{
            background: "var(--p-color-bg-surface-secondary)",
            padding: "16px",
            borderRadius: "var(--p-border-radius-100)",
            border: "1px solid var(--p-color-border-subdued)",
            fontSize: "12px",
            fontFamily: "monospace",
            overflowX: "auto",
            margin: 0,
            lineHeight: 1.5,
          }}
        >
          {jsonString}
        </pre>
      </BlockStack>
    </Modal>
  );
}

import * as React from "react";
import {
  Card,
  BlockStack,
  InlineStack,
  Text,
  Badge,
} from "@xco-agency/corex-ui";

type TemplateEditorCardPropsType = {
  bodyText: string;
  channel: "sms" | "email";
  onChangeBodyText: (text: string) => void;
};

export function TemplateEditorCard({
  bodyText,
  channel,
  onChangeBodyText,
}: TemplateEditorCardPropsType) {
  const charCount = bodyText.length;
  const segments = Math.ceil(charCount / 160) || 1;

  return (
    <Card>
      <BlockStack gap="base">
        <InlineStack justifyContent="space-between" alignItems="center">
          <BlockStack gap="small-400">
            <Text as="h3" fontWeight="semibold">
              Message Content
            </Text>
            <Text color="subdued" variant="bodySm">
              Compose copy with personalized tags and emojis.
            </Text>
          </BlockStack>

          {channel === "sms" && (
            <InlineStack gap="small-200" alignItems="center">
              <Badge tone={segments > 1 ? "warning" : "info"}>
                {segments} SMS Segment{segments > 1 ? "s" : ""}
              </Badge>
              <Text color="subdued" variant="bodySm">
                ({charCount} characters)
              </Text>
            </InlineStack>
          )}
        </InlineStack>

        <textarea
          value={bodyText}
          onChange={(e) => onChangeBodyText(e.target.value)}
          rows={6}
          style={{
            width: "100%",
            boxSizing: "border-box",
            padding: "var(--p-space-300, 12px)",
            borderRadius: "var(--p-border-radius-base, 6px)",
            border: "1px solid var(--p-color-border, #c9cccf)",
            fontFamily: "inherit",
            fontSize: "14px",
            lineHeight: "1.5",
            color: "var(--p-color-text, #202223)",
            background: "var(--p-color-bg-surface, #ffffff)",
            resize: "vertical",
          }}
          placeholder="Type your message here..."
        />
      </BlockStack>
    </Card>
  );
}

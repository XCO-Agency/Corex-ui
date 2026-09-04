import type * as React from "react";
import { BlockStack, InlineStack, Button, Text } from "@xco-agency/corex-ui";

export type SocialSharingSectionCardPropsType = {
  sectionTitle: string;
  itemTitle: string;
  badges?: React.ReactNode;
  description: string;
  actionContent: string;
  onAction?: () => void;
};

export function SocialSharingSectionCard({
  sectionTitle,
  itemTitle,
  badges,
  description,
  actionContent,
  onAction,
}: SocialSharingSectionCardPropsType) {
  return (
    <BlockStack gap="200">
      <div style={{ paddingLeft: "4px" }}>
        <Text as="h3" variant="bodyMd">
          <span style={{ fontWeight: 600, fontSize: "14px", color: "#202223" }}>
            {sectionTitle}
          </span>
        </Text>
      </div>

      <div
        style={{
          borderRadius: "12px",
          border: "1px solid #e1e3e5",
          backgroundColor: "#ffffff",
          padding: "20px 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "16px",
          boxSizing: "border-box",
        }}
      >
        <div style={{ flex: "1 1 300px" }}>
          <BlockStack gap="100">
            <InlineStack gap="200" align="start" blockAlign="center">
              <span style={{ fontWeight: 600, fontSize: "14px", color: "#202223" }}>
                {itemTitle}
              </span>
              {badges}
            </InlineStack>

            <Text as="p" variant="bodySm" tone="neutral">
              {description}
            </Text>
          </BlockStack>
        </div>

        <div style={{ flexShrink: 0 }}>
          <Button variant="secondary" onClick={onAction}>
            {actionContent}
          </Button>
        </div>
      </div>
    </BlockStack>
  );
}

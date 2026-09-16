import * as React from "react";
import { BlockStack, InlineStack, Text, Clickable, Icon } from "@xco-agency/corex-ui";
import type { SupportQuickLinkType } from "../types";

export type SupportQuickLinksPropsType = {
  links: SupportQuickLinkType[];
};

export function SupportQuickLinks({ links }: SupportQuickLinksPropsType) {
  return (
    <BlockStack gap="base">
      {links.map((link) => (
        <Clickable
          key={link.id}
          onClick={link.onClick}
          borderWidth="small-100"
          borderColor="border"
          borderRadius="base"
          padding="large-100"
          background="bg-surface"
        >
          <InlineStack gap="base" alignItems="center" wrap={false}>
            <Icon
              type={link.iconType === "feature-request" ? "incoming" : "question-circle"}
            />

            <BlockStack gap="small-500">
              <Text variant="bodyMd" fontWeight="semibold" tone="info">
                {link.title}
              </Text>
              <Text variant="bodySm" tone="subdued" as="p">
                {link.description}
              </Text>
            </BlockStack>
          </InlineStack>
        </Clickable>
      ))}
    </BlockStack>
  );
}

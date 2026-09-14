import * as React from "react";
import {
  Card,
  BlockStack,
  InlineStack,
  Text,
  Badge,
  Thumbnail,
  Checkbox,
  Box,
  Divider,
} from "@xco-agency/corex-ui";
import type { AddonItemType } from "../types";

type AddonSelectorCardPropsType = {
  addons: AddonItemType[];
  selectedIds: string[];
  onToggleAddon: (id: string) => void;
};

export function AddonSelectorCard({
  addons,
  selectedIds,
  onToggleAddon,
}: AddonSelectorCardPropsType) {
  return (
    <Card>
      <BlockStack gap="base">
        <InlineStack justifyContent="space-between" alignItems="center">
          <BlockStack gap="small-400">
            <Text as="h3" fontWeight="semibold">
              Cart Add-On Items
            </Text>
            <Text color="subdued" variant="bodySm">
              Products or services displayed as one-click checkboxes inside the cart
              drawer.
            </Text>
          </BlockStack>
          <Badge tone="info">
            {selectedIds.length} of {addons.length} active
          </Badge>
        </InlineStack>

        <Divider />

        <BlockStack gap="small-200">
          {addons.map((addon) => {
            const isSelected = selectedIds.includes(addon.id);

            return (
              <Box
                key={addon.id}
                padding="small"
                borderRadius="base"
                borderWidth="small-100"
                borderColor={isSelected ? "base" : "subdued"}
                borderStyle="solid"
                background={isSelected ? "subdued" : "base"}
              >
                <InlineStack justifyContent="space-between" alignItems="center">
                  <InlineStack gap="base" alignItems="center">
                    <Checkbox
                      label={addon.name}
                      labelAccessibilityVisibility="exclusive"
                      checked={isSelected}
                      onChange={() => onToggleAddon(addon.id)}
                    />
                    <Thumbnail src={addon.image} alt={addon.name} size="small" />
                    <BlockStack gap="small-400">
                      <InlineStack gap="small-200" alignItems="center">
                        <Text fontWeight="semibold" variant="bodySm">
                          {addon.name}
                        </Text>
                        {addon.badge && <Badge tone="success">{addon.badge}</Badge>}
                      </InlineStack>
                      <Text color="subdued" variant="bodySm">
                        SKU: {addon.sku} · Category: {addon.category}
                      </Text>
                    </BlockStack>
                  </InlineStack>

                  <InlineStack gap="small-200" alignItems="baseline">
                    <Text fontWeight="bold" variant="bodySm">
                      ${addon.price.toFixed(2)}
                    </Text>
                    {addon.originalPrice && (
                      <span
                        style={{
                          textDecoration: "line-through",
                          color: "var(--p-color-text-subdued, #616161)",
                          fontSize: "12px",
                        }}
                      >
                        ${addon.originalPrice.toFixed(2)}
                      </span>
                    )}
                  </InlineStack>
                </InlineStack>
              </Box>
            );
          })}
        </BlockStack>
      </BlockStack>
    </Card>
  );
}

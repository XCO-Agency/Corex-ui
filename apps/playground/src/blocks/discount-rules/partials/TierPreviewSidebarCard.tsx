import * as React from "react";
import {
  Card,
  BlockStack,
  InlineStack,
  Text,
  Badge,
  Box,
  Divider,
} from "@xco-agency/corex-ui";
import type { DiscountTierType } from "../types";

type TierPreviewSidebarCardPropsType = {
  tiers: DiscountTierType[];
  method: string;
};

export function TierPreviewSidebarCard({
  tiers,
  method,
}: TierPreviewSidebarCardPropsType) {
  // Simulated base product price $40.00
  const BASE_PRICE = 40.0;

  return (
    <BlockStack gap="base">
      <Card>
        <BlockStack gap="base">
          <Text as="h3" fontWeight="semibold">
            Storefront Table Preview
          </Text>
          <Text color="subdued" variant="bodySm">
            This live widget simulates how your volume break table displays on product pages.
          </Text>

          <Box
            padding="base"
            background="subdued"
            borderRadius="base"
            borderWidth="small-100"
            borderColor="subdued"
            borderStyle="solid"
          >
            <BlockStack gap="small">
              <Text fontWeight="semibold" variant="bodySm">
                Buy More, Save More
              </Text>

              {tiers.map((t) => {
                const discountAmount =
                  t.discountType === "percentage"
                    ? (BASE_PRICE * t.discountValue) / 100
                    : t.discountValue;
                const priceEach = Math.max(0, BASE_PRICE - discountAmount);

                return (
                  <Box
                    key={t.id}
                    padding="small"
                    background="base"
                    borderRadius="base"
                    borderWidth="small-100"
                    borderColor={t.highlighted ? "base" : "subdued"}
                    borderStyle="solid"
                  >
                    <InlineStack justifyContent="space-between" alignItems="center">
                      <BlockStack gap="small-500">
                        <InlineStack gap="small-200" alignItems="center">
                          <Text fontWeight="bold" variant="bodySm">
                            Buy {t.minQuantity}+
                          </Text>
                          {t.badgeLabel && (
                            <Badge tone={t.highlighted ? "success" : "info"}>
                              {t.badgeLabel}
                            </Badge>
                          )}
                        </InlineStack>
                        <Text color="subdued" variant="bodySm">
                          {t.discountValue}
                          {t.discountType === "percentage" ? "%" : "$"} discount
                        </Text>
                      </BlockStack>

                      <BlockStack gap="small-500" alignItems="end">
                        <Text fontWeight="bold" variant="bodySm">
                          ${priceEach.toFixed(2)} / ea
                        </Text>
                        <span
                          style={{
                            textDecoration: "line-through",
                            color: "var(--p-color-text-subdued, #616161)",
                            fontSize: "11px",
                          }}
                        >
                          ${BASE_PRICE.toFixed(2)}
                        </span>
                      </BlockStack>
                    </InlineStack>
                  </Box>
                );
              })}
            </BlockStack>
          </Box>
        </BlockStack>
      </Card>

      <Card>
        <BlockStack gap="small">
          <Text as="h3" fontWeight="semibold">
            Summary
          </Text>
          <Divider />
          <InlineStack justifyContent="space-between">
            <Text color="subdued" variant="bodySm">
              Application
            </Text>
            <Text fontWeight="semibold" variant="bodySm">
              {method === "automatic" ? "Automatic in Cart" : "Via Promo Code"}
            </Text>
          </InlineStack>
          <InlineStack justifyContent="space-between">
            <Text color="subdued" variant="bodySm">
              Max Volume Break
            </Text>
            <Text fontWeight="semibold" variant="bodySm">
              {Math.max(...tiers.map((t) => t.discountValue), 0)}%
            </Text>
          </InlineStack>
        </BlockStack>
      </Card>
    </BlockStack>
  );
}

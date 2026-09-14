import * as React from "react";
import { Card, BlockStack, Text, Badge, Divider } from "@xco-agency/corex-ui";
import type { OfferSummarySidebarCardPropsType } from "../types";

export function OfferSummarySidebarCard({
  form,
  selectedCount,
}: OfferSummarySidebarCardPropsType) {
  const discountLabel =
    form.discountType === "percentage"
      ? `${form.discountValue}% off`
      : form.discountType === "fixed_amount"
        ? `$${form.discountValue} off`
        : "Free Shipping";

  const conditionLabel =
    form.triggerType === "all_orders"
      ? "All orders eligible"
      : form.triggerType === "minimum_subtotal"
        ? `Orders over $${form.minimumSubtotal}`
        : "Specific collections";

  return (
    <Card>
      <BlockStack gap="base">
        <Text variant="base" heading>
          Offer summary
        </Text>

        <BlockStack gap="small-200">
          <Text variant="xs" tone="neutral">
            PROMOTION
          </Text>
          <Text variant="small" heading>
            {form.title || "Untitled Offer"}
          </Text>
        </BlockStack>

        <Divider />

        <BlockStack gap="small-200">
          <Text variant="xs" tone="neutral">
            BENEFIT & ELIGIBILITY
          </Text>
          <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
            <Badge tone="success">{discountLabel}</Badge>
            <Badge tone="info">{conditionLabel}</Badge>
          </div>
        </BlockStack>

        <Divider />

        <BlockStack gap="small-200">
          <Text variant="xs" tone="neutral">
            TARGET PRODUCTS
          </Text>
          <Text variant="small">
            {selectedCount > 0
              ? `${selectedCount} product${selectedCount > 1 ? "s" : ""} selected for cart upsell`
              : "No products selected"}
          </Text>
        </BlockStack>
      </BlockStack>
    </Card>
  );
}

import * as React from "react";
import {
  Card,
  BlockStack,
  InlineStack,
  Select,
  TextField,
  Text,
} from "@xco-agency/corex-ui";
import type {
  OfferDiscountType,
  OfferRulesCardPropsType,
  OfferTriggerType,
} from "../types";

export function OfferRulesCard({
  discountType,
  discountValue,
  triggerType,
  minimumSubtotal,
  onDiscountTypeChange,
  onDiscountValueChange,
  onTriggerTypeChange,
  onMinimumSubtotalChange,
}: OfferRulesCardPropsType) {
  const discountOptions = [
    { label: "Percentage off (%)", value: "percentage" },
    { label: "Fixed amount ($)", value: "fixed_amount" },
    { label: "Free shipping", value: "free_shipping" },
  ];

  const triggerOptions = [
    { label: "Apply to all orders", value: "all_orders" },
    { label: "Minimum cart subtotal ($)", value: "minimum_subtotal" },
    { label: "Specific collections only", value: "specific_collections" },
  ];

  return (
    <Card>
      <BlockStack gap="base">
        <BlockStack gap="none">
          <Text variant="base" heading>
            Discount & trigger conditions
          </Text>
          <Text variant="small" tone="neutral">
            Configure how and when this promotion unlocks in the customer cart.
          </Text>
        </BlockStack>

        <InlineStack gap="base" wrap>
          <div style={{ flex: 1, minWidth: "200px" }}>
            <Select
              label="Discount type"
              value={discountType}
              options={discountOptions}
              onChange={(val) => onDiscountTypeChange(val as OfferDiscountType)}
            />
          </div>

          {discountType !== "free_shipping" && (
            <div style={{ flex: 1, minWidth: "200px" }}>
              <TextField
                label={
                  discountType === "percentage"
                    ? "Discount percentage (%)"
                    : "Discount amount ($)"
                }
                value={discountValue}
                onChange={(val) => onDiscountValueChange(val)}
                placeholder={discountType === "percentage" ? "15" : "10.00"}
              />
            </div>
          )}
        </InlineStack>

        <InlineStack gap="base" wrap>
          <div style={{ flex: 1, minWidth: "200px" }}>
            <Select
              label="Trigger condition"
              value={triggerType}
              options={triggerOptions}
              onChange={(val) => onTriggerTypeChange(val as OfferTriggerType)}
            />
          </div>

          {triggerType === "minimum_subtotal" && (
            <div style={{ flex: 1, minWidth: "200px" }}>
              <TextField
                label="Minimum subtotal threshold ($)"
                value={minimumSubtotal}
                onChange={(val) => onMinimumSubtotalChange(val)}
                placeholder="50.00"
              />
            </div>
          )}
        </InlineStack>
      </BlockStack>
    </Card>
  );
}

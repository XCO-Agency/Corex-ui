import * as React from "react";
import { Modal, BlockStack, InlineStack, Text, Badge } from "@xco-agency/corex-ui";
import type { PricingUpgradeModalPropsType } from "../types";

export function PricingUpgradeModal({
  open,
  selectedPlan,
  interval,
  isProcessing,
  onClose,
  onConfirm,
}: PricingUpgradeModalPropsType) {
  if (!selectedPlan) return null;

  const price =
    interval === "annual"
      ? selectedPlan.annualPrice
      : selectedPlan.monthlyPrice;

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={`Confirm subscription: ${selectedPlan.name}`}
      primaryAction={{
        content: isProcessing
          ? "Approving with Shopify..."
          : `Approve $${price}/mo on Shopify`,
        onAction: onConfirm,
        loading: isProcessing,
      }}
      secondaryActions={[
        {
          content: "Cancel",
          onAction: onClose,
          disabled: isProcessing,
        },
      ]}
    >
      <BlockStack gap="base">
        <InlineStack
          justifyContent="space-between"
          alignItems="center"
          gap="small-200"
        >
          <BlockStack gap="none">
            <Text variant="base" heading>
              {selectedPlan.name} Plan
            </Text>
            <Text variant="small" tone="neutral">
              {interval === "annual" ? "Annual billing cycle" : "Monthly billing cycle"}
            </Text>
          </BlockStack>

          <InlineStack gap="small-100" alignItems="baseline">
            <span
              style={{
                fontSize: "24px",
                fontWeight: 700,
                color: "var(--p-color-text)",
              }}
            >
              ${price}
            </span>
            <Text as="span" variant="xs" tone="neutral">
              / mo
            </Text>
          </InlineStack>
        </InlineStack>

        <div
          style={{
            background: "var(--p-color-bg-surface-secondary)",
            padding: "12px 16px",
            borderRadius: "var(--p-border-radius-100)",
            border: "1px solid var(--p-color-border-subdued)",
          }}
        >
          <BlockStack gap="small-100">
            <InlineStack gap="small-200" alignItems="center">
              <Badge tone="info">Shopify App Billing</Badge>
              <Text variant="xs" tone="neutral">
                Direct invoicing
              </Text>
            </InlineStack>
            <Text variant="small" tone="neutral">
              By confirming, Shopify will prorate your current billing period and
              apply the new plan limits immediately to your storefront.
            </Text>
          </BlockStack>
        </div>
      </BlockStack>
    </Modal>
  );
}

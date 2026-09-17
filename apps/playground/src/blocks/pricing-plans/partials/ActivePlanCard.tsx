import * as React from "react";
import {
  Card,
  BlockStack,
  InlineStack,
  Text,
  Badge,
  Button,
  Divider,
} from "@xco-agency/corex-ui";
import { PlanAvatar } from "./PlanAvatar";
import type { ActivePlanCardPropsType } from "../types";

export function ActivePlanCard({
  plan,
  interval = "monthly",
  statusText = "Active Subscription",
  statusTone = "info",
  billingNote = "Billed natively through your Shopify unified monthly invoice. Cancel anytime.",
  nextBillingDate,
  variant = "banner",
  onChangePlan,
  onManageBilling,
}: ActivePlanCardPropsType) {
  const price = interval === "annual" ? plan.annualPrice : plan.monthlyPrice;

  if (variant === "card") {
    return (
      <Card>
        <BlockStack gap="base">
          {/* Main Header Row */}
          <InlineStack
            justifyContent="space-between"
            alignItems="center"
            gap="base"
            wrap
          >
            <InlineStack gap="base" alignItems="center">
              <PlanAvatar planId={plan.id} size={52} />

              <BlockStack gap="small-400">
                <InlineStack gap="small-200" alignItems="center" wrap>
                  <Text variant="headingMd" as="h2">
                    {plan.name} Plan
                  </Text>
                  <Badge tone={statusTone}>{statusText}</Badge>
                  {interval === "annual" && (
                    <Badge tone="success">Annual 20% Savings</Badge>
                  )}
                </InlineStack>

                <Text variant="small" tone="neutral">
                  {billingNote}
                </Text>
              </BlockStack>
            </InlineStack>

            {/* Action Buttons */}
            <InlineStack gap="small-200" alignItems="center">
              {onManageBilling && (
                <Button variant="tertiary" onClick={onManageBilling}>
                  Manage Billing
                </Button>
              )}
              {onChangePlan && (
                <Button variant="secondary" onClick={onChangePlan}>
                  Change Plan
                </Button>
              )}
            </InlineStack>
          </InlineStack>

          <Divider />

          {/* Quick Stats Strip */}
          <InlineStack
            justifyContent="space-between"
            alignItems="center"
            gap="base"
            wrap
          >
            <InlineStack gap="small-300" alignItems="baseline">
              <Text variant="small" tone="neutral">
                Current Recurring Rate:
              </Text>
              <Text variant="bodyMd" fontWeight="bold">
                ${price} / month
              </Text>
              <Text variant="small" tone="neutral">
                ({interval === "annual" ? "billed annually" : "monthly cycle"})
              </Text>
            </InlineStack>

            {nextBillingDate && (
              <InlineStack gap="small-200" alignItems="center">
                <Text variant="small" tone="neutral">
                  Next Renewal:
                </Text>
                <Text variant="small" fontWeight="semibold">
                  {nextBillingDate}
                </Text>
              </InlineStack>
            )}
          </InlineStack>
        </BlockStack>
      </Card>
    );
  }

  // Default Banner Variant (matches user reference layout)
  return (
    <Card>
      <InlineStack
        justifyContent="space-between"
        alignItems="center"
        gap="base"
        wrap
      >
        {/* Left Side: Avatar + Plan Info */}
        <InlineStack gap="base" alignItems="center">
          <PlanAvatar planId={plan.id} size={48} />

          <BlockStack gap="small-500">
            <InlineStack gap="small-200" alignItems="center" wrap>
              <Text variant="bodyMd" fontWeight="bold">
                {plan.name} Plan
              </Text>
              <Badge tone={statusTone}>{statusText}</Badge>
            </InlineStack>

            <Text variant="small" tone="neutral">
              {billingNote}
            </Text>
          </BlockStack>
        </InlineStack>

        {/* Right Side: Action Button */}
        {onChangePlan && (
          <InlineStack alignItems="center">
            <Button variant="secondary" onClick={onChangePlan}>
              Change Plan
            </Button>
          </InlineStack>
        )}
      </InlineStack>
    </Card>
  );
}

import * as React from "react";
import {
  Card,
  BlockStack,
  InlineStack,
  Text,
  Badge,
  Button,
  ButtonGroup,
  Box,
  Divider,
} from "@xco-agency/corex-ui";
import type {
  BillingIntervalType,
  PaymentMethodType,
  PlanTierType,
} from "../types";

type ActivePlanHeroCardPropsType = {
  currentPlan: PlanTierType;
  billingInterval: BillingIntervalType;
  nextBillingDate: string;
  paymentMethod: PaymentMethodType;
  onChangeInterval: (interval: BillingIntervalType) => void;
  onUpdatePayment: () => void;
};

export function ActivePlanHeroCard({
  currentPlan,
  billingInterval,
  nextBillingDate,
  paymentMethod,
  onChangeInterval,
  onUpdatePayment,
}: ActivePlanHeroCardPropsType) {
  const currentPrice =
    billingInterval === "monthly"
      ? currentPlan.monthlyPrice
      : Math.round(currentPlan.annualPrice / 12);

  return (
    <Card>
      <BlockStack gap="base">
        <InlineStack justifyContent="space-between" alignItems="center">
          <BlockStack gap="small-400">
            <InlineStack gap="small-200" alignItems="center">
              <Text as="h2" fontWeight="bold">
                Current Subscription: {currentPlan.name} Plan
              </Text>
              <Badge tone="success">Active Status</Badge>
              {billingInterval === "annual" && (
                <Badge tone="info">Annual 20% Discount</Badge>
              )}
            </InlineStack>
            <Text color="subdued" variant="small">
              {currentPlan.description}
            </Text>
          </BlockStack>

          {/* Billing Interval Segmented Switch using Corex UI ButtonGroup */}
          <ButtonGroup variant="segmented">
            <Button
              variant={billingInterval === "monthly" ? "primary" : "secondary"}
              onClick={() => onChangeInterval("monthly")}
            >
              Monthly
            </Button>
            <Button
              variant={billingInterval === "annual" ? "primary" : "secondary"}
              onClick={() => onChangeInterval("annual")}
            >
              Annual (Save 20%)
            </Button>
          </ButtonGroup>
        </InlineStack>

        <Divider />

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "var(--p-space-400, 16px)",
          }}
        >
          {/* Rate Card */}
          <Box padding="small-300" background="subdued" borderRadius="base">
            <BlockStack gap="small-500">
              <Text color="subdued" variant="small">
                Recurring Rate
              </Text>
              <InlineStack gap="small-200" alignItems="baseline">
                <Text fontWeight="bold" variant="large">
                  ${currentPrice}
                </Text>
                <Text color="subdued" variant="small">
                  / month ({billingInterval})
                </Text>
              </InlineStack>
            </BlockStack>
          </Box>

          {/* Next Invoice Date */}
          <Box padding="small-300" background="subdued" borderRadius="base">
            <BlockStack gap="small-500">
              <Text color="subdued" variant="small">
                Next Scheduled Renewal
              </Text>
              <Text fontWeight="semibold" variant="small">
                {nextBillingDate}
              </Text>
              <Text color="subdued" variant="small">
                Automatic charge via Shopify Merchant Billing
              </Text>
            </BlockStack>
          </Box>

          {/* Payment Method */}
          <Box padding="small-300" background="subdued" borderRadius="base">
            <BlockStack gap="small-500">
              <InlineStack justifyContent="space-between" alignItems="center">
                <Text color="subdued" variant="small">
                  Card on File
                </Text>
                <Button variant="tertiary" onClick={onUpdatePayment}>
                  Update
                </Button>
              </InlineStack>
              <Text fontWeight="semibold" variant="small">
                {paymentMethod.brand} ending in {paymentMethod.last4}
              </Text>
              <Text color="subdued" variant="small">
                Expires {paymentMethod.expMonth}/{paymentMethod.expYear}
              </Text>
            </BlockStack>
          </Box>
        </div>
      </BlockStack>
    </Card>
  );
}

import * as React from "react";
import {
  Card,
  BlockStack,
  InlineStack,
  Text,
  Badge,
  Button,
  Box,
  Divider,
} from "@xco-agency/corex-ui";
import { PLAN_TIERS } from "../constants";
import type { BillingIntervalType, PlanTierType } from "../types";

type PlanSwitchComparisonCardPropsType = {
  currentPlanId: string;
  billingInterval: BillingIntervalType;
  onSelectPlan: (plan: PlanTierType) => void;
};

export function PlanSwitchComparisonCard({
  currentPlanId,
  billingInterval,
  onSelectPlan,
}: PlanSwitchComparisonCardPropsType) {
  return (
    <Card>
      <BlockStack gap="base">
        <InlineStack justifyContent="space-between" alignItems="center">
          <BlockStack gap="small-400">
            <Text as="h3" fontWeight="semibold">
              Available Subscription Tiers
            </Text>
            <Text color="subdued" variant="bodySm">
              Upgrade or downgrade your plan at any time. Prorated credits are automatically applied.
            </Text>
          </BlockStack>
          <Badge tone="info">Instant Prorated Billing</Badge>
        </InlineStack>

        <Divider />

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "var(--p-space-400, 16px)",
            alignItems: "stretch",
          }}
        >
          {PLAN_TIERS.map((tier) => {
            const isCurrent = tier.id === currentPlanId;
            const price =
              billingInterval === "monthly"
                ? tier.monthlyPrice
                : Math.round(tier.annualPrice / 12);

            return (
              <div
                key={tier.id}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  position: "relative",
                  padding: "var(--p-space-400, 16px)",
                  backgroundColor: "var(--p-color-bg-surface, #ffffff)",
                  borderRadius: "var(--p-border-radius-200, 8px)",
                  border: isCurrent
                    ? "1px solid var(--p-color-border-primary, #008060)"
                    : "1px solid var(--p-color-border-subdued, #e1e3e5)",
                  boxShadow: isCurrent
                    ? "0 0 0 1px var(--p-color-border-primary, #008060)"
                    : "none",
                }}
              >
                <BlockStack gap="base">
                  <InlineStack justifyContent="space-between" alignItems="center">
                    <Text fontWeight="bold" variant="large">
                      {tier.name}
                    </Text>
                    {tier.badge && (
                      <Badge tone={isCurrent ? "success" : "info"}>
                        {tier.badge}
                      </Badge>
                    )}
                  </InlineStack>

                  <InlineStack gap="small-200" alignItems="baseline">
                    <Text fontWeight="bold" variant="large">
                      ${price}
                    </Text>
                    <Text color="subdued" variant="bodySm">
                      / month ({billingInterval})
                    </Text>
                  </InlineStack>

                  <Text variant="bodySm" color="subdued">
                    {tier.description}
                  </Text>

                  <Divider />

                  <BlockStack gap="small-300">
                    <Text fontWeight="semibold" variant="bodySm">
                      Included features:
                    </Text>
                    {tier.features.map((feat, idx) => (
                      <div
                        key={idx}
                        style={{
                          display: "flex",
                          gap: "var(--p-space-200, 8px)",
                          alignItems: "flex-start",
                        }}
                      >
                        <span
                          style={{
                            color: "var(--p-color-text-success, #008060)",
                            fontWeight: 700,
                            lineHeight: "1.2rem",
                          }}
                        >
                          ✓
                        </span>
                        <Text variant="bodySm">{feat}</Text>
                      </div>
                    ))}
                  </BlockStack>
                </BlockStack>

                <div style={{ marginTop: "var(--p-space-500, 20px)" }}>
                  {isCurrent ? (
                    <Button variant="secondary" disabled>
                      Active Plan
                    </Button>
                  ) : (
                    <Button
                      variant={tier.id === "plan-enterprise" ? "primary" : "secondary"}
                      onClick={() => onSelectPlan(tier)}
                    >
                      {tier.monthlyPrice >
                      (PLAN_TIERS.find((p) => p.id === currentPlanId)?.monthlyPrice ?? 0)
                        ? "Upgrade to " + tier.name
                        : "Downgrade to " + tier.name}
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </BlockStack>
    </Card>
  );
}

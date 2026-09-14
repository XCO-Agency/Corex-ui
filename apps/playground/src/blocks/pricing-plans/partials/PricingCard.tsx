import * as React from "react";
import {
  Card,
  BlockStack,
  InlineStack,
  Text,
  Badge,
  Button,
  Divider,
  IconTile,
  Icon,
} from "@xco-agency/corex-ui";
import type { PricingCardPropsType } from "../types";

export function PricingCard({
  plan,
  interval,
  isCurrent,
  onSelectPlan,
}: PricingCardPropsType) {
  const price = interval === "annual" ? plan.annualPrice : plan.monthlyPrice;
  const annualTotal = plan.annualPrice * 12;

  return (
    <Card>
      <BlockStack gap="base">
        {/* Header with Title & Badges */}
        <InlineStack alignItems="center" justifyContent="space-between" gap="small-200">
          <Text variant="large" heading>
            {plan.name}
          </Text>

          {isCurrent ? (
            <Badge tone="info">Current plan</Badge>
          ) : plan.badge ? (
            <Badge tone="success">{plan.badge}</Badge>
          ) : null}
        </InlineStack>

        <Text variant="small" tone="neutral">
          {plan.description}
        </Text>

        {/* Price Display */}
        <BlockStack gap="none">
          <InlineStack alignItems="baseline" gap="small-100">
            <span
              style={{
                fontSize: "32px",
                fontWeight: 700,
                color: "var(--p-color-text)",
                lineHeight: 1.1,
              }}
            >
              ${price}
            </span>
            <Text as="span" variant="small" tone="neutral">
              / month
            </Text>
          </InlineStack>

          {interval === "annual" && (
            <Text variant="xs" tone="neutral">
              ${annualTotal} billed once per year
            </Text>
          )}
        </BlockStack>

        {/* CTA Button */}
        {isCurrent ? (
          <Button variant="secondary" disabled>
            Current active plan
          </Button>
        ) : (
          <Button
            variant={plan.isPopular ? "primary" : "secondary"}
            onClick={() => onSelectPlan(plan)}
          >
            {`Select ${plan.name}`}
          </Button>
        )}

        <Divider />

        {/* Features Checklist */}
        <BlockStack gap="small-200">
          <Text variant="xs" tone="neutral">
            INCLUDED WITH {plan.name.toUpperCase()}:
          </Text>

          {plan.features.map((feature, idx) => (
            <InlineStack key={idx} gap="small-200" alignItems="start">
              <Icon type={feature.included ? "check" : "minus"} size="small" />

              <Text as="span" type={feature.included ? "generic" : "redundant"}>
                {feature.title}
              </Text>
            </InlineStack>
          ))}
        </BlockStack>
      </BlockStack>
    </Card>
  );
}

import {
  Card,
  BlockStack,
  InlineStack,
  Text,
  Badge,
  Button,
  Divider,
  Icon,
} from "@xco-agency/corex-ui";
import type { PricingCardPropsType } from "../types";
import { formatLimit, formatMoney, getAnnualSavings, getChangeKind } from "../utils";

export function PricingCard({
  plan,
  interval,
  isCurrent,
  currentPlan,
  onSelectPlan,
}: PricingCardPropsType) {
  const price = interval === "annual" ? plan.annualPrice : plan.monthlyPrice;
  const annualTotal = plan.annualPrice * 12;
  const savings = getAnnualSavings(plan);
  const kind = getChangeKind(currentPlan, plan);

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
            <Text variant="headingXl" heading>
              {formatMoney(price)}
            </Text>
            <Text as="span" variant="small" tone="neutral">
              / month
            </Text>
          </InlineStack>

          {interval === "annual" && plan.monthlyPrice > 0 ? (
            <InlineStack gap="small-200" alignItems="center">
              <Text variant="xs" tone="neutral">
                {formatMoney(annualTotal)} billed once per year
              </Text>
              <Badge tone="success">{`Save ${formatMoney(savings)}/yr`}</Badge>
            </InlineStack>
          ) : null}
        </BlockStack>

        {/* CTA Button */}
        {isCurrent ? (
          <Button variant="secondary" disabled>
            Current active plan
          </Button>
        ) : (
          <Button
            variant={plan.isPopular && kind === "upgrade" ? "primary" : "secondary"}
            onClick={() => onSelectPlan(plan)}
          >
            {`${kind === "upgrade" ? "Upgrade" : "Downgrade"} to ${plan.name}`}
          </Button>
        )}

        <Divider />

        {/* Key limits */}
        <BlockStack gap="small-300">
          <InlineStack justifyContent="space-between">
            <Text variant="small" color="subdued">
              Tracked orders
            </Text>
            <Text variant="small" fontWeight="semibold">
              {formatLimit("orders", plan)}
            </Text>
          </InlineStack>
          <InlineStack justifyContent="space-between">
            <Text variant="small" color="subdued">
              Cart add-ons
            </Text>
            <Text variant="small" fontWeight="semibold">
              {formatLimit("addOns", plan)}
            </Text>
          </InlineStack>
        </BlockStack>

        <Divider />

        {/* Features Checklist */}
        <BlockStack gap="small-200">
          <Text variant="xs" tone="neutral">
            INCLUDED WITH {plan.name.toUpperCase()}:
          </Text>

          {plan.features.map((feature, idx) => (
            <InlineStack key={idx} gap="small-200" alignItems="start">
              <Icon type={feature.included ? "check" : "minus"} size="small" />

              <Text as="span" color={feature.included ? "base" : "subdued"}>
                {feature.title}
              </Text>
            </InlineStack>
          ))}
        </BlockStack>
      </BlockStack>
    </Card>
  );
}

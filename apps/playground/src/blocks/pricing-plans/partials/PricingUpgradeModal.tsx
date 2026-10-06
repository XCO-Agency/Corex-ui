import {
  Modal,
  Banner,
  BlockStack,
  Box,
  InlineStack,
  Text,
  Badge,
} from "@xco-agency/corex-ui";
import type { PricingUpgradeModalPropsType } from "../types";
import { formatMoney, getChangeKind, getOverLimit, getPlanPrice } from "../utils";

/**
 * Confirms a plan change. Upgrades apply now (prorated by Shopify); downgrades
 * wait for the next renewal and warn about lost features and exceeded limits.
 */
export function PricingUpgradeModal({
  open,
  selectedPlan,
  currentPlan,
  nextBillingDate,
  interval,
  isProcessing,
  onClose,
  onConfirm,
}: PricingUpgradeModalPropsType) {
  if (!selectedPlan) return null;

  const price = getPlanPrice(selectedPlan, interval);
  const kind = getChangeKind(currentPlan, selectedPlan);
  const isDowngrade = kind === "downgrade";
  const overLimit = isDowngrade ? getOverLimit(selectedPlan) : [];
  const lostFeatures = isDowngrade
    ? currentPlan.features.filter(
        (feature) =>
          feature.included &&
          !selectedPlan.features.some(
            (other) => other.included && other.title === feature.title,
          ),
      )
    : [];

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={`${isDowngrade ? "Downgrade to" : "Upgrade to"} ${selectedPlan.name}`}
      primaryAction={{
        content: isProcessing
          ? "Approving with Shopify..."
          : isDowngrade
            ? `Downgrade to ${selectedPlan.name}`
            : `Approve ${formatMoney(price)}/mo on Shopify`,
        onAction: onConfirm,
        loading: isProcessing,
        destructive: isDowngrade,
      }}
      secondaryActions={[
        { content: "Cancel", onAction: onClose, disabled: isProcessing },
      ]}
    >
      <BlockStack gap="base">
        <InlineStack justifyContent="space-between" alignItems="center" gap="small-200">
          <BlockStack gap="none">
            <Text variant="base" heading>
              {selectedPlan.name} Plan
            </Text>
            <Text variant="small" tone="neutral">
              {interval === "annual" ? "Annual billing cycle" : "Monthly billing cycle"}
            </Text>
          </BlockStack>

          <InlineStack gap="small-100" alignItems="baseline">
            <Text variant="headingLg" heading>
              {formatMoney(price)}
            </Text>
            <Text as="span" variant="xs" tone="neutral">
              / mo
            </Text>
          </InlineStack>
        </InlineStack>

        {overLimit.length > 0 ? (
          <Banner tone="warning" title="Your usage exceeds this plan's limits">
            {overLimit
              .map(
                (item) =>
                  `${item.label}: ${item.used.toLocaleString()} used, ${item.limit?.toLocaleString()} allowed`,
              )
              .join(" · ")}
          </Banner>
        ) : null}

        {lostFeatures.length > 0 ? (
          <BlockStack gap="small-200">
            <Text variant="small" heading>
              You will lose
            </Text>
            {lostFeatures.map((feature) => (
              <Text key={feature.title} variant="small" tone="neutral">
                {`• ${feature.title}`}
              </Text>
            ))}
          </BlockStack>
        ) : null}

        <Box background="subdued" padding="base" borderRadius="base">
          <BlockStack gap="small-100">
            <InlineStack gap="small-200" alignItems="center">
              <Badge tone="info">Shopify App Billing</Badge>
              <Text variant="xs" tone="neutral">
                Direct invoicing
              </Text>
            </InlineStack>
            <Text variant="small" tone="neutral">
              {isDowngrade
                ? `Your ${currentPlan.name} plan stays active until ${nextBillingDate}. The ${selectedPlan.name} plan and its limits apply from then on.`
                : "By confirming, Shopify will prorate your current billing period and apply the new plan limits immediately to your storefront."}
            </Text>
          </BlockStack>
        </Box>
      </BlockStack>
    </Modal>
  );
}

import * as React from "react";
import { Page, BlockStack, Grid, Banner } from "@xco-agency/corex-ui";
import {
  CURRENT_USAGE_LIMITS,
  PRICING_FAQS,
  PRICING_PLANS,
} from "../constants";
import { PricingCard } from "../partials/PricingCard";
import { PricingFaq } from "../partials/PricingFaq";
import { PricingIntervalToggle } from "../partials/PricingIntervalToggle";
import { PricingUpgradeModal } from "../partials/PricingUpgradeModal";
import { PricingUsageMeter } from "../partials/PricingUsageMeter";
import type {
  BillingIntervalType,
  PlanTierIdType,
  PricingPlanType,
  PricingPlansExamplePropsType,
} from "../types";

export function PricingPlansExample({
  initialPlanId = "growth",
  initialInterval = "monthly",
}: PricingPlansExamplePropsType) {
  const [currentPlanId, setCurrentPlanId] =
    React.useState<PlanTierIdType>(initialPlanId);
  const [interval, setInterval] =
    React.useState<BillingIntervalType>(initialInterval);
  const [selectedPlanForUpgrade, setSelectedPlanForUpgrade] =
    React.useState<PricingPlanType | null>(null);
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [successBanner, setSuccessBanner] = React.useState<string | null>(null);

  const handleSelectPlan = (plan: PricingPlanType) => {
    setSelectedPlanForUpgrade(plan);
  };

  const handleConfirmUpgrade = () => {
    if (!selectedPlanForUpgrade) return;
    setIsProcessing(true);

    setTimeout(() => {
      setCurrentPlanId(selectedPlanForUpgrade.id);
      setIsProcessing(false);
      setSuccessBanner(
        `Successfully subscribed to the ${selectedPlanForUpgrade.name} plan!`,
      );
      setSelectedPlanForUpgrade(null);
    }, 800);
  };

  return (
    <Page
      heading="Plans & Billing"
      subheading="Select the subscription tier that best matches your store's volume."
      inlineSize="large"
    >
      <BlockStack gap="base">
        {successBanner && (
          <Banner
            tone="success"
            title={successBanner}
            onDismiss={() => setSuccessBanner(null)}
          />
        )}

        {/* Billing Interval Toggle */}
        <PricingIntervalToggle
          interval={interval}
          discountPercentage={20}
          onChange={setInterval}
        />

        {/* 3-Tier Pricing Cards Grid */}
        <Grid columns={{ xs: 1, sm: 1, md: 3, lg: 3 }} gap="base">
          {PRICING_PLANS.map((plan) => (
            <PricingCard
              key={plan.id}
              plan={plan}
              interval={interval}
              isCurrent={plan.id === currentPlanId}
              onSelectPlan={handleSelectPlan}
            />
          ))}
        </Grid>

        {/* Current Billing Usage Meter */}
        <PricingUsageMeter limits={CURRENT_USAGE_LIMITS} />

        {/* FAQ Accordion */}
        <PricingFaq items={PRICING_FAQS} />

        {/* Upgrade / Confirmation Modal */}
        <PricingUpgradeModal
          open={selectedPlanForUpgrade !== null}
          selectedPlan={selectedPlanForUpgrade}
          interval={interval}
          isProcessing={isProcessing}
          onClose={() => setSelectedPlanForUpgrade(null)}
          onConfirm={handleConfirmUpgrade}
        />
      </BlockStack>
    </Page>
  );
}

import * as React from "react";
import { Page, BlockStack, Grid, Banner } from "@xco-agency/corex-ui";
import {
  ALL_PRICING_PLANS,
  COMPARISON_ROWS,
  FREE_PLAN,
  NEXT_BILLING_DATE,
  PRICING_FAQS,
  PRICING_PLANS,
} from "../constants";
import { ActivePlanCard } from "../partials/ActivePlanCard";
import { PricingCard } from "../partials/PricingCard";
import { PricingComparisonTable } from "../partials/PricingComparisonTable";
import { PricingEnterpriseCta } from "../partials/PricingEnterpriseCta";
import { PricingFaq } from "../partials/PricingFaq";
import { PricingIntervalToggle } from "../partials/PricingIntervalToggle";
import { PricingUpgradeModal } from "../partials/PricingUpgradeModal";
import { PricingUsageMeter } from "../partials/PricingUsageMeter";
import {
  buildUsage,
  getChangeKind,
  getMaxDiscountPercent,
  getSuggestedPlan,
} from "../utils";
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
  const [currentPlanId, setCurrentPlanId] = React.useState<PlanTierIdType>(initialPlanId);
  const [pendingPlanId, setPendingPlanId] = React.useState<PlanTierIdType | null>(null);
  const [interval, setInterval] = React.useState<BillingIntervalType>(initialInterval);
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [notice, setNotice] = React.useState<string | null>(null);

  const currentPlan: PricingPlanType =
    ALL_PRICING_PLANS.find((plan) => plan.id === currentPlanId) ?? FREE_PLAN;
  const selectedPlan =
    ALL_PRICING_PLANS.find((plan) => plan.id === pendingPlanId) ?? null;
  const discountPercentage = getMaxDiscountPercent(PRICING_PLANS);

  const handleConfirm = () => {
    if (!selectedPlan) return;
    const kind = getChangeKind(currentPlan, selectedPlan);
    setIsProcessing(true);

    // Stand-in for the Shopify billing approval round trip.
    setTimeout(() => {
      setIsProcessing(false);
      setPendingPlanId(null);
      if (kind === "upgrade") {
        setCurrentPlanId(selectedPlan.id);
        setNotice(`You are now on the ${selectedPlan.name} plan.`);
      } else {
        // A downgrade is scheduled, so the current plan stays active until renewal.
        setNotice(
          `Your plan changes to ${selectedPlan.name} on ${NEXT_BILLING_DATE}. Until then you keep ${currentPlan.name}.`,
        );
      }
    }, 600);
  };

  return (
    <Page
      heading="Plans & Billing"
      subtitle="Manage your active subscription, compare tiers, and unlock advanced revenue engines."
      inlineSize="large"
    >
      <BlockStack gap="base">
        {notice ? (
          <Banner tone="success" title={notice} onDismiss={() => setNotice(null)} />
        ) : null}

        <ActivePlanCard
          plan={currentPlan}
          interval={interval}
          annualDiscount={discountPercentage}
          nextBillingDate={NEXT_BILLING_DATE}
          onChangePlan={() => setPendingPlanId(getSuggestedPlan(currentPlan).id)}
          onManageBilling={() => setNotice("Opening the Shopify billing portal...")}
        />

        <PricingIntervalToggle
          interval={interval}
          discountPercentage={discountPercentage}
          onChange={setInterval}
        />

        <Grid columns={{ xs: 1, sm: 1, md: 3, lg: 3 }} gap="base">
          {PRICING_PLANS.map((plan) => (
            <PricingCard
              key={plan.id}
              plan={plan}
              interval={interval}
              isCurrent={plan.id === currentPlanId}
              currentPlan={currentPlan}
              onSelectPlan={(selected) => setPendingPlanId(selected.id)}
            />
          ))}
        </Grid>

        <PricingComparisonTable
          plans={ALL_PRICING_PLANS}
          rows={COMPARISON_ROWS}
          interval={interval}
          currentPlanId={currentPlanId}
        />

        <PricingUsageMeter limits={buildUsage(currentPlan)} />

        <PricingEnterpriseCta
          onContactSales={() => setNotice("Our sales team will reach out within a day.")}
        />

        <PricingFaq items={PRICING_FAQS} />

        <PricingUpgradeModal
          open={selectedPlan !== null}
          selectedPlan={selectedPlan}
          currentPlan={currentPlan}
          nextBillingDate={NEXT_BILLING_DATE}
          interval={interval}
          isProcessing={isProcessing}
          onClose={() => setPendingPlanId(null)}
          onConfirm={handleConfirm}
        />
      </BlockStack>
    </Page>
  );
}

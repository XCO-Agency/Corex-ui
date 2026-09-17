import * as React from "react";
import {
  Page,
  BlockStack,
  InlineStack,
  Grid,
  Banner,
  ButtonGroup,
  Button,
  Text,
} from "@xco-agency/corex-ui";
import {
  ALL_PRICING_PLANS,
  CURRENT_USAGE_LIMITS,
  FREE_PLAN,
  PRICING_FAQS,
  PRICING_PLANS,
} from "../constants";
import { ActivePlanCard } from "../partials/ActivePlanCard";
import { PricingCard } from "../partials/PricingCard";
import { PricingFaq } from "../partials/PricingFaq";
import { PricingIntervalToggle } from "../partials/PricingIntervalToggle";
import { PricingUpgradeModal } from "../partials/PricingUpgradeModal";
import { PricingUsageMeter } from "../partials/PricingUsageMeter";
import type {
  ActivePlanCardVariantType,
  BillingIntervalType,
  PlanTierIdType,
  PricingPlanType,
  PricingPlansExamplePropsType,
} from "../types";

export function PricingPlansExample({
  initialPlanId = "free",
  initialInterval = "monthly",
}: PricingPlansExamplePropsType) {
  const [currentPlanId, setCurrentPlanId] =
    React.useState<PlanTierIdType>(initialPlanId);
  const [interval, setInterval] =
    React.useState<BillingIntervalType>(initialInterval);
  const [variant, setVariant] =
    React.useState<ActivePlanCardVariantType>("banner");
  const [selectedPlanForUpgrade, setSelectedPlanForUpgrade] =
    React.useState<PricingPlanType | null>(null);
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [successBanner, setSuccessBanner] = React.useState<string | null>(null);

  const currentPlan: PricingPlanType =
    ALL_PRICING_PLANS.find((p) => p.id === currentPlanId) ?? FREE_PLAN;

  const handleSelectPlan = (plan: PricingPlanType) => {
    setSelectedPlanForUpgrade(plan);
  };

  const handleChangePlanClick = () => {
    // Open upgrade modal with Growth or next tier
    const nextPlan =
      PRICING_PLANS.find((p) => p.id !== currentPlanId) ?? PRICING_PLANS[1]!;
    setSelectedPlanForUpgrade(nextPlan);
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
    }, 600);
  };

  return (
    <Page
      heading="Plans & Billing"
      subheading="Manage your active subscription, compare tiers, and unlock advanced revenue engines."
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

        {/* Active Plan Component with Plan Avatar SVG */}
        <ActivePlanCard
          plan={currentPlan}
          interval={interval}
          variant={variant}
          nextBillingDate="Oct 01, 2026"
          onChangePlan={handleChangePlanClick}
          onManageBilling={() =>
            setSuccessBanner("Opening Shopify billing portal...")
          }
        />

        {/* Interactive Controls Bar: Quick Avatar Switcher & Card/Banner Style Toggle */}
        <InlineStack justifyContent="space-between" alignItems="center" gap="base" wrap>
          <InlineStack gap="small-200" alignItems="center">
            <Text variant="small" tone="neutral">
              Simulate Active Tier:
            </Text>
            <InlineStack gap="small-100" alignItems="center">
              <Button
                variant={currentPlanId === "free" ? "primary" : "secondary"}
                onClick={() => setCurrentPlanId("free")}
              >
                Free (Gem)
              </Button>
              <Button
                variant={currentPlanId === "starter" ? "primary" : "secondary"}
                onClick={() => setCurrentPlanId("starter")}
              >
                Starter (Rocket)
              </Button>
              <Button
                variant={currentPlanId === "growth" ? "primary" : "secondary"}
                onClick={() => setCurrentPlanId("growth")}
              >
                Growth (Surge)
              </Button>
              <Button
                variant={currentPlanId === "scale" ? "primary" : "secondary"}
                onClick={() => setCurrentPlanId("scale")}
              >
                Scale (Crown)
              </Button>
            </InlineStack>
          </InlineStack>

          <InlineStack gap="small-200" alignItems="center">
            <Text variant="small" tone="neutral">
              Component Style:
            </Text>
            <InlineStack gap="small-100" alignItems="center">
              <Button
                variant={variant === "banner" ? "primary" : "secondary"}
                onClick={() => setVariant("banner")}
              >
                Banner Style
              </Button>
              <Button
                variant={variant === "card" ? "primary" : "secondary"}
                onClick={() => setVariant("card")}
              >
                Card Style
              </Button>
            </InlineStack>
          </InlineStack>
        </InlineStack>

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

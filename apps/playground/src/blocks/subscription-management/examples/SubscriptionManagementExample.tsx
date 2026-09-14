import * as React from "react";
import {
  Page,
  BlockStack,
  Banner,
} from "@xco-agency/corex-ui";
import {
  INITIAL_USAGE,
  MOCK_INVOICES,
  MOCK_PAYMENT_METHOD,
  PLAN_TIERS,
} from "../constants";
import { ActivePlanHeroCard } from "../partials/ActivePlanHeroCard";
import { UsageMetersCard } from "../partials/UsageMetersCard";
import { PlanSwitchComparisonCard } from "../partials/PlanSwitchComparisonCard";
import { InvoiceHistoryCard } from "../partials/InvoiceHistoryCard";
import type {
  BillingIntervalType,
  InvoiceItemType,
  PlanTierType,
  SubscriptionStateType,
} from "../types";

export function SubscriptionManagementExample() {
  const [state, setState] = React.useState<SubscriptionStateType>({
    currentPlanId: "plan-growth",
    billingInterval: "monthly",
    nextBillingDate: "Oct 01, 2026",
    paymentMethod: MOCK_PAYMENT_METHOD,
    usage: INITIAL_USAGE,
    invoices: MOCK_INVOICES,
  });

  const [notification, setNotification] = React.useState<string | null>(null);

  const currentPlan: PlanTierType =
    PLAN_TIERS.find((p) => p.id === state.currentPlanId) ?? PLAN_TIERS[1]!;

  const handleChangeInterval = (interval: BillingIntervalType) => {
    setState((prev) => ({ ...prev, billingInterval: interval }));
    setNotification(
      `Switched to ${interval} billing cycle. ${interval === "annual" ? "20% annual savings applied!" : ""}`,
    );
  };

  const handleSelectPlan = (newPlan: PlanTierType) => {
    setState((prev) => ({ ...prev, currentPlanId: newPlan.id }));
    setNotification(
      `Successfully switched to the ${newPlan.name} plan. Prorated credits have been calculated for your remaining billing cycle.`,
    );
  };

  const handleDownloadInvoice = (invoice: InvoiceItemType) => {
    setNotification(
      `Downloading PDF receipt for invoice ${invoice.invoiceNumber} ($${invoice.amount.toFixed(2)})...`,
    );
  };

  const handleUpdatePayment = () => {
    setNotification(
      "Directing to secure Shopify Billing payment method verification...",
    );
  };

  return (
    <Page
      heading="Subscription, Quotas & Billing"
      subheading="Manage your app tier subscription, track real-time resource quota meters, and review billing invoices."
      inlineSize="large"
    >
      <BlockStack gap="base">
        {notification && (
          <Banner
            tone="success"
            title={notification}
            onDismiss={() => setNotification(null)}
          />
        )}

        {/* Current Active Subscription Banner & Rates */}
        <ActivePlanHeroCard
          currentPlan={currentPlan}
          billingInterval={state.billingInterval}
          nextBillingDate={state.nextBillingDate}
          paymentMethod={state.paymentMethod}
          onChangeInterval={handleChangeInterval}
          onUpdatePayment={handleUpdatePayment}
        />

        {/* Resource Usage Meters */}
        <UsageMetersCard
          usage={state.usage}
          cycleEndDate={state.nextBillingDate}
        />

        {/* Plan Comparison & Upgrades */}
        <PlanSwitchComparisonCard
          currentPlanId={state.currentPlanId}
          billingInterval={state.billingInterval}
          onSelectPlan={handleSelectPlan}
        />

        {/* Invoices History Table */}
        <InvoiceHistoryCard
          invoices={state.invoices}
          onDownloadInvoice={handleDownloadInvoice}
        />
      </BlockStack>
    </Page>
  );
}

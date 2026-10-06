import type * as React from "react";

export type BillingIntervalType = "monthly" | "annual";

export type PlanTierIdType = "free" | "starter" | "growth" | "scale" | "enterprise";

export type PlanFeatureType = {
  title: string;
  included: boolean;
  tooltip?: string;
};

/** Numeric plan limits; `null` means unlimited. */
export type PlanLimitsType = {
  orders: number | null;
  addOns: number | null;
  webhooks: number | null;
};

export type PlanLimitKeyType = keyof PlanLimitsType;

export type PlanChangeKindType = "upgrade" | "downgrade";

export type PricingPlanType = {
  id: PlanTierIdType;
  name: string;
  monthlyPrice: number;
  annualPrice: number;
  description: string;
  badge?: string;
  isPopular?: boolean;
  limits: PlanLimitsType;
  features: PlanFeatureType[];
};

export type PlanUsageLimitType = {
  key: PlanLimitKeyType;
  label: string;
  used: number;
  /** `null` means unlimited. */
  limit: number | null;
  unit: string;
};

export type PlanComparisonRowType = {
  label: string;
  /** Text, or a boolean rendered as an included / not included icon. */
  values: Partial<Record<PlanTierIdType, string | boolean>>;
};

export type FaqItemType = {
  id: string;
  question: string;
  answer: string;
};

export type PlanAvatarPropsType = {
  planId: PlanTierIdType | string;
  size?: number;
  customSvg?: React.ReactNode;
};

export type ActivePlanCardVariantType = "banner" | "card";

export type ActivePlanCardPropsType = {
  plan: PricingPlanType;
  interval?: BillingIntervalType;
  statusText?: string;
  statusTone?: "info" | "success" | "warning" | "neutral";
  billingNote?: string;
  nextBillingDate?: string;
  variant?: ActivePlanCardVariantType;
  /** Annual billing discount (%), shown as a badge while on annual billing. */
  annualDiscount?: number;
  onChangePlan?: () => void;
  onManageBilling?: () => void;
};

export type PricingIntervalTogglePropsType = {
  interval: BillingIntervalType;
  discountPercentage?: number;
  onChange: (interval: BillingIntervalType) => void;
};

export type PricingCardPropsType = {
  plan: PricingPlanType;
  interval: BillingIntervalType;
  isCurrent: boolean;
  /** Plan the merchant is on now; decides the upgrade / downgrade label. */
  currentPlan: PricingPlanType;
  onSelectPlan: (plan: PricingPlanType) => void;
};

export type PricingComparisonTablePropsType = {
  plans: PricingPlanType[];
  rows: PlanComparisonRowType[];
  interval: BillingIntervalType;
  currentPlanId: PlanTierIdType;
};

export type PricingEnterpriseCtaPropsType = {
  onContactSales: () => void;
};

export type PricingUsageMeterPropsType = {
  limits: PlanUsageLimitType[];
};

export type PricingFaqPropsType = {
  items: FaqItemType[];
};

export type PricingUpgradeModalPropsType = {
  open: boolean;
  selectedPlan: PricingPlanType | null;
  currentPlan: PricingPlanType;
  /** Renewal date; a downgrade takes effect then. */
  nextBillingDate: string;
  interval: BillingIntervalType;
  isProcessing: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

export type PricingPlansExamplePropsType = {
  initialPlanId?: PlanTierIdType;
  initialInterval?: BillingIntervalType;
};

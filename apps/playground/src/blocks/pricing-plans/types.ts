import type * as React from "react";

export type BillingIntervalType = "monthly" | "annual";

export type PlanTierIdType = "free" | "starter" | "growth" | "scale" | "enterprise";

export type PlanFeatureType = {
  title: string;
  included: boolean;
  tooltip?: string;
};

export type PricingPlanType = {
  id: PlanTierIdType;
  name: string;
  monthlyPrice: number;
  annualPrice: number;
  description: string;
  badge?: string;
  isPopular?: boolean;
  features: PlanFeatureType[];
};

export type PlanUsageLimitType = {
  label: string;
  used: number;
  limit: number;
  unit: string;
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
  onSelectPlan: (plan: PricingPlanType) => void;
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
  interval: BillingIntervalType;
  isProcessing: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

export type PricingPlansExamplePropsType = {
  initialPlanId?: PlanTierIdType;
  initialInterval?: BillingIntervalType;
};


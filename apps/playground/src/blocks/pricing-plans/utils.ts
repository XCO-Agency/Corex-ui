import { ALL_PRICING_PLANS, CURRENT_USAGE, USAGE_METRICS } from "./constants";
import type {
  BillingIntervalType,
  PlanChangeKindType,
  PlanUsageLimitType,
  PlanLimitKeyType,
  PricingPlanType,
} from "./types";

export const getPlanPrice = (plan: PricingPlanType, interval: BillingIntervalType) =>
  interval === "annual" ? plan.annualPrice : plan.monthlyPrice;

/** Dollars saved per year by paying annually. */
export const getAnnualSavings = (plan: PricingPlanType) =>
  (plan.monthlyPrice - plan.annualPrice) * 12;

/** Largest annual discount (%) across paid plans, for the interval toggle. */
export const getMaxDiscountPercent = (plans: PricingPlanType[]) =>
  Math.max(
    0,
    ...plans
      .filter((plan) => plan.monthlyPrice > 0)
      .map((plan) =>
        Math.round(((plan.monthlyPrice - plan.annualPrice) / plan.monthlyPrice) * 100),
      ),
  );

const tierRank = (plan: PricingPlanType) =>
  ALL_PRICING_PLANS.findIndex((item) => item.id === plan.id);

export const getChangeKind = (
  current: PricingPlanType,
  target: PricingPlanType,
): PlanChangeKindType => (tierRank(target) > tierRank(current) ? "upgrade" : "downgrade");

/** Next tier up, or the tier below when already on the top plan. */
export const getSuggestedPlan = (current: PricingPlanType) =>
  ALL_PRICING_PLANS[tierRank(current) + 1] ?? ALL_PRICING_PLANS[tierRank(current) - 1]!;

/** Usage rows measured against a plan's limits. */
export const buildUsage = (plan: PricingPlanType): PlanUsageLimitType[] =>
  USAGE_METRICS.map(({ key, label, unit }) => ({
    key,
    label,
    unit,
    used: CURRENT_USAGE[key],
    limit: plan.limits[key],
  }));

/** Metrics where current usage is above what `plan` allows. */
export const getOverLimit = (plan: PricingPlanType): PlanUsageLimitType[] =>
  buildUsage(plan).filter((item) => item.limit !== null && item.used > item.limit);

export const formatLimit = (key: PlanLimitKeyType, plan: PricingPlanType) => {
  const limit = plan.limits[key];
  return limit === null ? "Unlimited" : limit.toLocaleString();
};

export const formatMoney = (amount: number) => `$${amount.toLocaleString()}`;

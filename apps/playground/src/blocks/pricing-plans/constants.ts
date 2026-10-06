import type {
  FaqItemType,
  PlanComparisonRowType,
  PlanLimitKeyType,
  PricingPlanType,
} from "./types";

export const FREE_PLAN: PricingPlanType = {
  id: "free",
  name: "Free",
  monthlyPrice: 0,
  annualPrice: 0,
  description: "Core revenue essentials to get started with zero monthly cost.",
  limits: { orders: 100, addOns: 2, webhooks: 1000 },
  features: [
    { title: "Up to 100 monthly tracked orders", included: true },
    { title: "Standard cart drawer add-ons", included: true },
    { title: "Basic analytics & revenue tracking", included: true },
    { title: "Standard email support", included: true },
    { title: "Custom CSS & branded styling", included: false },
    { title: "Dedicated account manager", included: false },
  ],
};

export const PRICING_PLANS: PricingPlanType[] = [
  {
    id: "starter",
    name: "Starter",
    monthlyPrice: 29,
    annualPrice: 24,
    description: "Essential revenue tools for growing Shopify storefronts.",
    limits: { orders: 500, addOns: 5, webhooks: 5000 },
    features: [
      { title: "Up to 500 monthly tracked orders", included: true },
      { title: "Standard cart drawer add-ons", included: true },
      { title: "Basic analytics & revenue tracking", included: true },
      { title: "Email support (24h SLA)", included: true },
      { title: "Custom CSS & branded styling", included: false },
      { title: "Dedicated account manager", included: false },
    ],
  },
  {
    id: "growth",
    name: "Growth",
    monthlyPrice: 79,
    annualPrice: 64,
    description: "High-conversion features for scaling Shopify brands.",
    badge: "Most Popular",
    isPopular: true,
    limits: { orders: 2500, addOns: 10, webhooks: 25000 },
    features: [
      { title: "Up to 2,500 monthly tracked orders", included: true },
      { title: "All cart drawer modules & upsells", included: true },
      { title: "Advanced revenue attribution & reports", included: true },
      { title: "Priority email & chat support", included: true },
      { title: "Custom CSS & theme token overrides", included: true },
      { title: "Dedicated account manager", included: false },
    ],
  },
  {
    id: "scale",
    name: "Scale",
    monthlyPrice: 199,
    annualPrice: 159,
    description: "Maximum scale and personalized support for enterprise merchants.",
    limits: { orders: null, addOns: null, webhooks: 100000 },
    features: [
      { title: "Unlimited monthly tracked orders", included: true },
      { title: "All cart modules + VIP early access", included: true },
      { title: "Real-time webhook sync & exports", included: true },
      { title: "24/7 priority phone & Slack support", included: true },
      { title: "Custom CSS & white-label branding", included: true },
      { title: "Dedicated CSM & onboarding engineer", included: true },
    ],
  },
];

export const ALL_PRICING_PLANS: PricingPlanType[] = [FREE_PLAN, ...PRICING_PLANS];

export const USAGE_METRICS: { key: PlanLimitKeyType; label: string; unit: string }[] = [
  { key: "orders", label: "Monthly Tracked Orders", unit: "orders" },
  { key: "addOns", label: "Active Cart Add-ons", unit: "modules" },
  { key: "webhooks", label: "Monthly API Webhooks", unit: "calls" },
];

/** What the store has used so far in the current billing cycle. */
export const CURRENT_USAGE: Record<PlanLimitKeyType, number> = {
  orders: 1840,
  addOns: 4,
  webhooks: 14200,
};

export const NEXT_BILLING_DATE = "Oct 01, 2026";

export const COMPARISON_ROWS: PlanComparisonRowType[] = [
  {
    label: "Tracked orders / month",
    values: { free: "100", starter: "500", growth: "2,500", scale: "Unlimited" },
  },
  {
    label: "Cart add-on modules",
    values: { free: "2", starter: "5", growth: "10", scale: "Unlimited" },
  },
  {
    label: "API webhooks / month",
    values: { free: "1,000", starter: "5,000", growth: "25,000", scale: "100,000" },
  },
  {
    label: "Advanced revenue attribution",
    values: { free: false, starter: false, growth: true, scale: true },
  },
  {
    label: "Custom CSS & theme tokens",
    values: { free: false, starter: false, growth: true, scale: true },
  },
  {
    label: "White-label branding",
    values: { free: false, starter: false, growth: false, scale: true },
  },
  {
    label: "Support",
    values: {
      free: "Email",
      starter: "Email (24h)",
      growth: "Email & chat",
      scale: "Phone & Slack",
    },
  },
];

export const PRICING_FAQS: FaqItemType[] = [
  {
    id: "faq-1",
    question: "How does billing work through Shopify?",
    answer:
      "All subscription charges are directly invoiced through your standard Shopify monthly bill. Charges appear on your 30-day billing cycle under App charges.",
  },
  {
    id: "faq-2",
    question: "Can I upgrade or downgrade anytime?",
    answer:
      "Yes! When upgrading, Shopify instantly credits unused days of your previous plan and prorates the difference. When downgrading, new limits apply at the start of your next billing period.",
  },
  {
    id: "faq-3",
    question: "What happens if I exceed my order limit?",
    answer:
      "We will never interrupt customer checkouts or disable your active cart drawer. If you exceed plan limits for two consecutive months, our team will notify you to upgrade.",
  },
  {
    id: "faq-4",
    question: "Is there a free trial available?",
    answer:
      "Every new installation includes a 14-day full feature trial of the Growth plan so you can test all features risk-free.",
  },
];

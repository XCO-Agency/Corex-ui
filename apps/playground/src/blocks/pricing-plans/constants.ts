import type {
  FaqItemType,
  PlanUsageLimitType,
  PricingPlanType,
} from "./types";

export const FREE_PLAN: PricingPlanType = {
  id: "free",
  name: "Free",
  monthlyPrice: 0,
  annualPrice: 0,
  description: "Core revenue essentials to get started with zero monthly cost.",
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

export const ALL_PRICING_PLANS: PricingPlanType[] = [
  FREE_PLAN,
  ...PRICING_PLANS,
];

export const CURRENT_USAGE_LIMITS: PlanUsageLimitType[] = [
  {
    label: "Monthly Tracked Orders",
    used: 1840,
    limit: 2500,
    unit: "orders",
  },
  {
    label: "Active Cart Add-ons",
    used: 4,
    limit: 10,
    unit: "modules",
  },
  {
    label: "Monthly API Webhooks",
    used: 14200,
    limit: 25000,
    unit: "calls",
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

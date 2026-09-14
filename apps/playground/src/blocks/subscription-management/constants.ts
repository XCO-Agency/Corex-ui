import type {
  InvoiceItemType,
  PaymentMethodType,
  PlanTierType,
  UsageQuotaType,
} from "./types";

export const PLAN_TIERS: PlanTierType[] = [
  {
    id: "plan-starter",
    name: "Starter",
    monthlyPrice: 29,
    annualPrice: 290,
    description: "Essential merchandising toolkit for emerging direct-to-consumer storefronts.",
    features: [
      "Up to 2,000 orders / month",
      "2 staff seats with role permissions",
      "Standard email & chat support",
      "Core cart drawer & upsell widgets",
      "50,000 API calls / month",
    ],
    limits: {
      orders: 2000,
      seats: 2,
      apiCalls: 50000,
    },
  },
  {
    id: "plan-growth",
    name: "Growth",
    monthlyPrice: 79,
    annualPrice: 790,
    badge: "Most Popular",
    isCurrent: true,
    description: "Advanced automations and multi-location inventory sync for expanding brands.",
    features: [
      "Up to 10,000 orders / month",
      "5 staff seats with audit history",
      "Priority 24/7 Slack & email concierge",
      "A/B testing for upsell offers",
      "Custom CSS & theme token injection",
      "1,000,000 API calls / month",
    ],
    limits: {
      orders: 10000,
      seats: 5,
      apiCalls: 1000000,
    },
  },
  {
    id: "plan-enterprise",
    name: "Enterprise",
    monthlyPrice: 199,
    annualPrice: 1990,
    badge: "High Volume",
    description: "Unlimited scalability, dedicated server isolation, and tailored SLA contracts.",
    features: [
      "Unlimited orders / month",
      "Unlimited staff seats & SSO",
      "Dedicated merchant success manager",
      "Hourly data sync & warehouse webhooks",
      "Custom ERP & WMS integrations",
      "Unlimited API calls & high-burst limits",
    ],
    limits: {
      orders: 100000,
      seats: 50,
      apiCalls: 10000000,
    },
  },
];

export const INITIAL_USAGE: UsageQuotaType[] = [
  {
    resource: "Monthly Orders Processed",
    used: 4820,
    total: 10000,
    unit: "orders",
    warningThreshold: 85,
  },
  {
    resource: "Active Team Seats",
    used: 4,
    total: 5,
    unit: "seats",
    warningThreshold: 80,
  },
  {
    resource: "GraphQL & Webhook API Requests",
    used: 742000,
    total: 1000000,
    unit: "calls",
    warningThreshold: 75,
  },
];

export const MOCK_PAYMENT_METHOD: PaymentMethodType = {
  brand: "Visa",
  last4: "4242",
  expMonth: 11,
  expYear: 2028,
};

export const MOCK_INVOICES: InvoiceItemType[] = [
  {
    id: "inv-2026-09",
    invoiceNumber: "INV-2026-0914",
    date: "Sep 01, 2026",
    amount: 79.0,
    currency: "USD",
    status: "paid",
    downloadUrl: "#",
  },
  {
    id: "inv-2026-08",
    invoiceNumber: "INV-2026-0801",
    date: "Aug 01, 2026",
    amount: 79.0,
    currency: "USD",
    status: "paid",
    downloadUrl: "#",
  },
  {
    id: "inv-2026-07",
    invoiceNumber: "INV-2026-0701",
    date: "Jul 01, 2026",
    amount: 79.0,
    currency: "USD",
    status: "paid",
    downloadUrl: "#",
  },
  {
    id: "inv-2026-06",
    invoiceNumber: "INV-2026-0601",
    date: "Jun 01, 2026",
    amount: 79.0,
    currency: "USD",
    status: "paid",
    downloadUrl: "#",
  },
];

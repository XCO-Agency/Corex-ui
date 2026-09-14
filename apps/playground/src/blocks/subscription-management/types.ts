export type BillingIntervalType = "monthly" | "annual";

export type PlanLimitsType = {
  orders: number;
  seats: number;
  apiCalls: number;
};

export type PlanTierType = {
  id: string;
  name: string;
  monthlyPrice: number;
  annualPrice: number;
  description: string;
  badge?: string;
  isCurrent?: boolean;
  features: string[];
  limits: PlanLimitsType;
};

export type UsageQuotaType = {
  resource: string;
  used: number;
  total: number;
  unit: string;
  warningThreshold: number;
};

export type InvoiceStatusType = "paid" | "pending" | "failed";

export type InvoiceItemType = {
  id: string;
  invoiceNumber: string;
  date: string;
  amount: number;
  currency: string;
  status: InvoiceStatusType;
  downloadUrl: string;
};

export type PaymentMethodType = {
  brand: string;
  last4: string;
  expMonth: number;
  expYear: number;
};

export type SubscriptionStateType = {
  currentPlanId: string;
  billingInterval: BillingIntervalType;
  nextBillingDate: string;
  paymentMethod: PaymentMethodType;
  usage: UsageQuotaType[];
  invoices: InvoiceItemType[];
};

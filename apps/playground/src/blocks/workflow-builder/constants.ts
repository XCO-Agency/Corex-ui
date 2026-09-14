import type { WorkflowRuleFormType } from "./types";

export const WORKFLOW_TRIGGER_OPTIONS = [
  { label: "Order Created (when customer places order)", value: "order_created" },
  { label: "Order Paid (when payment is captured)", value: "order_paid" },
  { label: "Customer Created (when new signup)", value: "customer_created" },
  { label: "Inventory Low (when stock < threshold)", value: "inventory_low" },
  { label: "Refund Issued (when refund processed)", value: "refund_issued" },
];

export const CONDITION_FIELD_OPTIONS = [
  { label: "Order Total ($)", value: "order.total_price" },
  { label: "Customer Tags", value: "customer.tags" },
  { label: "Customer Order Count", value: "customer.orders_count" },
  { label: "Shipping Country Code", value: "shipping.country_code" },
  { label: "Payment Gateway", value: "payment.gateway" },
];

export const CONDITION_OPERATOR_OPTIONS = [
  { label: "is greater than", value: "greater_than" },
  { label: "is less than", value: "less_than" },
  { label: "equals exactly", value: "equals" },
  { label: "contains keyword", value: "contains" },
  { label: "is not equal to", value: "is_not" },
];

export const ACTION_TYPE_OPTIONS = [
  { label: "Add Customer Tag", value: "add_customer_tag" },
  { label: "Send Automated Merchant Email", value: "send_email" },
  { label: "Post Alert to Slack Webhook", value: "send_slack" },
  { label: "Generate Customer Loyalty Discount", value: "apply_discount" },
];

export const INITIAL_WORKFLOW_FORM: WorkflowRuleFormType = {
  name: "Auto-Tag High-Value VIP Orders",
  description: "When an order exceeds $150, apply VIP tag and alert support channel.",
  enabled: true,
  triggerEvent: "order_created",
  logicGate: "AND",
  conditions: [
    {
      id: "cond-1",
      field: "order.total_price",
      operator: "greater_than",
      value: "150",
    },
    {
      id: "cond-2",
      field: "shipping.country_code",
      operator: "equals",
      value: "US",
    },
  ],
  actions: [
    {
      id: "act-1",
      actionKey: "add_customer_tag",
      actionLabel: "Add Customer Tag",
      targetValue: "VIP-Gold",
    },
    {
      id: "act-2",
      actionKey: "send_slack",
      actionLabel: "Post Alert to Slack Webhook",
      targetValue: "#vip-sales-feed",
    },
  ],
  totalRuns: 1420,
  lastRunAt: "2 minutes ago",
};

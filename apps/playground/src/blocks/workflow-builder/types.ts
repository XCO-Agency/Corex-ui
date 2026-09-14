export type WorkflowTriggerEventType =
  | "order_created"
  | "order_paid"
  | "customer_created"
  | "inventory_low"
  | "refund_issued";

export type WorkflowConditionOperatorType =
  | "greater_than"
  | "less_than"
  | "equals"
  | "contains"
  | "is_not";

export type WorkflowConditionItemType = {
  id: string;
  field: string;
  operator: WorkflowConditionOperatorType;
  value: string;
};

export type WorkflowActionType = {
  id: string;
  actionKey: "add_customer_tag" | "send_email" | "send_slack" | "apply_discount";
  actionLabel: string;
  targetValue: string;
};

export type WorkflowRuleFormType = {
  name: string;
  description: string;
  enabled: boolean;
  triggerEvent: WorkflowTriggerEventType;
  logicGate: "AND" | "OR";
  conditions: WorkflowConditionItemType[];
  actions: WorkflowActionType[];
  totalRuns: number;
  lastRunAt: string;
};

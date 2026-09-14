export type SegmentOperatorType =
  | "greater_than"
  | "less_than"
  | "equals"
  | "contains";

export type SegmentFilterRuleType = {
  id: string;
  criterion: "orders_count" | "total_spent" | "country" | "last_order_days" | "tags";
  operator: SegmentOperatorType;
  value: string;
};

export type CustomerItemType = {
  id: string;
  name: string;
  email: string;
  ordersCount: number;
  totalSpent: number;
  tags: string[];
  location: string;
  lastOrderDate: string;
};

export type SegmentFormType = {
  name: string;
  description: string;
  rules: SegmentFilterRuleType[];
  matchingCount: number;
  totalStoreCustomers: number;
  averageLtv: number;
};

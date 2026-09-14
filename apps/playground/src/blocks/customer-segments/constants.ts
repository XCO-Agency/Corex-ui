import type { CustomerItemType, SegmentFilterRuleType } from "./types";

export const SEGMENT_CRITERION_OPTIONS = [
  { label: "Orders Placed Count", value: "orders_count" },
  { label: "Total Lifetime Spend ($)", value: "total_spent" },
  { label: "Customer Country Code", value: "country" },
  { label: "Days Since Last Order", value: "last_order_days" },
  { label: "Customer Tag", value: "tags" },
];

export const SEGMENT_OPERATOR_OPTIONS = [
  { label: "is greater than", value: "greater_than" },
  { label: "is less than", value: "less_than" },
  { label: "equals exactly", value: "equals" },
  { label: "contains", value: "contains" },
];

export const MOCK_MATCHED_CUSTOMERS: CustomerItemType[] = [
  {
    id: "cust-1",
    name: "Elena Rostova",
    email: "elena.rostova@gmail.com",
    ordersCount: 8,
    totalSpent: 642.5,
    tags: ["VIP-Gold", "Early-Adopter"],
    location: "New York, USA",
    lastOrderDate: "3 days ago",
  },
  {
    id: "cust-2",
    name: "Marcus Vance",
    email: "m.vance@techcorp.io",
    ordersCount: 5,
    totalSpent: 489.0,
    tags: ["VIP-Gold", "Wholesale"],
    location: "Toronto, Canada",
    lastOrderDate: "1 week ago",
  },
  {
    id: "cust-3",
    name: "Amina Al-Sayed",
    email: "amina.design@studio.ae",
    ordersCount: 12,
    totalSpent: 1280.0,
    tags: ["High-LTV", "VIP-Platinum"],
    location: "Dubai, UAE",
    lastOrderDate: "Yesterday",
  },
  {
    id: "cust-4",
    name: "Lucas Dupont",
    email: "lucas.dupont@orange.fr",
    ordersCount: 6,
    totalSpent: 512.2,
    tags: ["VIP-Gold", "Newsletter"],
    location: "Paris, France",
    lastOrderDate: "2 weeks ago",
  },
];

export const INITIAL_SEGMENT_RULES: SegmentFilterRuleType[] = [
  {
    id: "rule-1",
    criterion: "total_spent",
    operator: "greater_than",
    value: "400",
  },
  {
    id: "rule-2",
    criterion: "orders_count",
    operator: "greater_than",
    value: "4",
  },
];

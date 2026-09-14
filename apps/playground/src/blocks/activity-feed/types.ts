import { IconType } from "@xco-agency/corex-ui";

export type ActivityDetailFieldType = {
  label: string;
  value: string;
};

export type ActivityActionType = {
  label: string;
  variant?: "primary" | "secondary" | "tertiary";
  onClick?: () => void;
};

export type ActivityEventType =
  "all" | "order" | "payment" | "inventory" | "message" | "fulfillment";

export type ActivityItemType = {
  id: string;
  title: string;
  badgeText: string;
  badgeTone?: "info" | "success" | "warning" | "critical" | "neutral";
  timestamp: string;
  dateGroup: "Today" | "Yesterday" | "Earlier this week";
  description: string;
  icon: IconType;
  iconTone?: "info" | "success" | "warning" | "critical" | "neutral";
  details?: ActivityDetailFieldType[];
  actions?: ActivityActionType[];
  eventType: ActivityEventType;
  payload?: Record<string, unknown>;
};

export type ActivityFiltersType = {
  eventType: ActivityEventType;
};

export type ActivityFiltersPropsType = {
  activeFilter: ActivityEventType;
  onSelectFilter: (eventType: ActivityEventType) => void;
  onRefresh: () => void;
  isRefreshing?: boolean;
};

export type ActivityTimelineItemPropsType = {
  item: ActivityItemType;
  isLast?: boolean;
  onActionClick?: (actionLabel: string, item: ActivityItemType) => void;
  onViewPayload?: (item: ActivityItemType) => void;
};

export type ActivityPayloadModalPropsType = {
  open: boolean;
  item: ActivityItemType | null;
  onClose: () => void;
};

export type ActivityEmptyStatePropsType = {
  onReset: () => void;
};

import type * as React from "react";
import type { ToneType } from "@xco-agency/corex-ui";

export type IntegrationCategoryType =
  | "all"
  | "marketing"
  | "support"
  | "analytics"
  | "webhooks";

export type IntegrationStatusType = "connected" | "disconnected" | "error";

export type IntegrationItemType = {
  id: string;
  name: string;
  description: string;
  category: "marketing" | "support" | "analytics" | "webhooks";
  status: IntegrationStatusType;
  syncEnabled: boolean;
  iconTone: "success" | "neutral" | "subdued" | "caution" | "info" | "critical";
  lastSyncedAt?: string;
  apiKey?: string;
  webhookUrl?: string;
};

export type WebhookLogItemType = {
  id: string;
  topic: string;
  status: "success" | "failed";
  statusCode: number;
  timestamp: string;
  durationMs: number;
};

export type IntegrationCategoryTabsPropsType = {
  categories: { id: IntegrationCategoryType; label: string; count: number }[];
  selectedCategory: IntegrationCategoryType;
  onSelectCategory: (category: IntegrationCategoryType) => void;
};

export type IntegrationCardPropsType = {
  integration: IntegrationItemType;
  onToggleSync: (id: string, enabled: boolean) => void;
  onConfigure: (integration: IntegrationItemType) => void;
};

export type IntegrationConfigModalPropsType = {
  open: boolean;
  integration: IntegrationItemType | null;
  onClose: () => void;
  onSave: (id: string, config: { apiKey?: string; webhookUrl?: string }) => void;
  onTestConnection: (id: string) => Promise<boolean>;
};

export type WebhookLogCardPropsType = {
  logs: WebhookLogItemType[];
  onRefresh: () => void;
};

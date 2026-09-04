import type * as React from "react";

export type AnnotatedSectionPropsType = {
  title: string;
  description: string;
  action?: {
    content: string;
    url?: string;
    onAction?: () => void;
  };
  children: React.ReactNode;
};

export type GeneralSettingsFormType = {
  storeName: string;
  accountEmail: string;
  senderPhone: string;
  storeCurrency: string;
  timezone: string;
  unitSystem: string;
};

export type NotificationSettingsFormType = {
  orderConfirmationEmail: boolean;
  shippingUpdatesSms: boolean;
  inventoryAlerts: boolean;
  weeklyDigest: boolean;
  digestFrequency: string;
};

export type SecuritySettingsFormType = {
  requireTwoFactor: boolean;
  apiAccessEnabled: boolean;
  webhookSecret: string;
  ipWhitelist: string;
};

export type SettingsTabIdType = "general" | "notifications" | "security" | "danger";

export type SettingsTabType = {
  id: SettingsTabIdType;
  content: string;
  badge?: string;
};

export type SettingsLayoutPropsType = {
  children?: React.ReactNode;
};

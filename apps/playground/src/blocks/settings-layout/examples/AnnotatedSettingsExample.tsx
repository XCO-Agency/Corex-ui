import * as React from "react";
import { Page, BlockStack, Divider } from "@xco-agency/corex-ui";
import { AnnotatedSection } from "../partials/AnnotatedSection";
import { GeneralSettingsCard } from "../partials/GeneralSettingsCard";
import { NotificationSettingsCard } from "../partials/NotificationSettingsCard";
import { SecuritySettingsCard } from "../partials/SecuritySettingsCard";
import { DangerZoneCard } from "../partials/DangerZoneCard";
import { SettingsSaveBar } from "../partials/SettingsSaveBar";
import type {
  GeneralSettingsFormType,
  NotificationSettingsFormType,
  SecuritySettingsFormType,
} from "../types";

const INITIAL_GENERAL: GeneralSettingsFormType = {
  storeName: "Acme Atelier",
  accountEmail: "contact@acmeatelier.com",
  senderPhone: "+1 (415) 890-1234",
  storeCurrency: "USD",
  timezone: "America/New_York",
  unitSystem: "metric",
};

const INITIAL_NOTIFICATIONS: NotificationSettingsFormType = {
  orderConfirmationEmail: true,
  shippingUpdatesSms: true,
  inventoryAlerts: false,
  weeklyDigest: true,
  digestFrequency: "monday_morning",
};

const INITIAL_SECURITY: SecuritySettingsFormType = {
  requireTwoFactor: true,
  apiAccessEnabled: true,
  webhookSecret: "whsec_live_9f8a3c2b1e0d4a",
  ipWhitelist: "192.168.1.1/32, 10.0.0.0/16",
};

export function AnnotatedSettingsExample() {
  const [general, setGeneral] = React.useState<GeneralSettingsFormType>(INITIAL_GENERAL);
  const [notifications, setNotifications] =
    React.useState<NotificationSettingsFormType>(INITIAL_NOTIFICATIONS);
  const [security, setSecurity] =
    React.useState<SecuritySettingsFormType>(INITIAL_SECURITY);

  const [isDirty, setIsDirty] = React.useState(false);
  const [isSaving, setIsSaving] = React.useState(false);

  const handleGeneralChange = (
    field: keyof GeneralSettingsFormType,
    val: string
  ) => {
    setGeneral((prev) => ({ ...prev, [field]: val }));
    setIsDirty(true);
  };

  const handleNotificationChange = <K extends keyof NotificationSettingsFormType>(
    field: K,
    val: NotificationSettingsFormType[K]
  ) => {
    setNotifications((prev) => ({ ...prev, [field]: val }));
    setIsDirty(true);
  };

  const handleSecurityChange = <K extends keyof SecuritySettingsFormType>(
    field: K,
    val: SecuritySettingsFormType[K]
  ) => {
    setSecurity((prev) => ({ ...prev, [field]: val }));
    setIsDirty(true);
  };

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setIsDirty(false);
    }, 900);
  };

  const handleDiscard = () => {
    setGeneral(INITIAL_GENERAL);
    setNotifications(INITIAL_NOTIFICATIONS);
    setSecurity(INITIAL_SECURITY);
    setIsDirty(false);
  };

  return (
    <BlockStack gap="500">
      <Page
        title="Settings"
        subtitle="Manage store details, communication channels, and API access."
        primaryAction={{
          content: "Save changes",
          onAction: handleSave,
          disabled: !isDirty,
          loading: isSaving,
        }}
        secondaryActions={[
          {
            content: "Discard",
            disabled: !isDirty || isSaving,
            onAction: handleDiscard,
          },
        ]}
      >
        <BlockStack gap="600">
          <AnnotatedSection
            title="Store details"
            description="View and update your primary store profile, sender contacts, and regional currency standards."
            action={{
              content: "Learn more about store profiles",
              url: "https://help.shopify.com",
            }}
          >
            <GeneralSettingsCard
              data={general}
              onChange={handleGeneralChange}
            />
          </AnnotatedSection>

          <Divider />

          <AnnotatedSection
            title="Customer communications"
            description="Configure real-time notifications sent to customers regarding fulfillment and order events."
          >
            <NotificationSettingsCard
              data={notifications}
              onChange={handleNotificationChange}
            />
          </AnnotatedSection>

          <Divider />

          <AnnotatedSection
            title="Security & Integrations"
            description="Manage authentication policies, API credentials, and incoming webhook signature secrets."
          >
            <SecuritySettingsCard
              data={security}
              onChange={handleSecurityChange}
            />
          </AnnotatedSection>

          <Divider />

          <AnnotatedSection
            title="Danger zone"
            description="Destructive actions that revoke authentication tokens and reset configuration."
          >
            <DangerZoneCard onReset={handleDiscard} />
          </AnnotatedSection>
        </BlockStack>
      </Page>

      <SettingsSaveBar
        isDirty={isDirty}
        isSaving={isSaving}
        onSave={handleSave}
        onDiscard={handleDiscard}
      />
    </BlockStack>
  );
}

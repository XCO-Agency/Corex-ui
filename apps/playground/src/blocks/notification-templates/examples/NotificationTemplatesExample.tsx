import * as React from "react";
import {
  Page,
  BlockStack,
  Banner,
  SaveBar,
} from "@xco-agency/corex-ui";
import { INITIAL_TEMPLATE_FORM } from "../constants";
import { TemplateConfigCard } from "../partials/TemplateConfigCard";
import { DynamicVariablesCard } from "../partials/DynamicVariablesCard";
import { TemplateEditorCard } from "../partials/TemplateEditorCard";
import { DevicePreviewSidebarCard } from "../partials/DevicePreviewSidebarCard";
import type { NotificationTemplateFormType, TemplateChannelType } from "../types";

export function NotificationTemplatesExample() {
  const [form, setForm] = React.useState<NotificationTemplateFormType>(
    INITIAL_TEMPLATE_FORM,
  );
  const [isDirty, setIsDirty] = React.useState(false);
  const [isSaving, setIsSaving] = React.useState(false);
  const [notification, setNotification] = React.useState<string | null>(null);

  const updateField = <K extends keyof NotificationTemplateFormType>(
    field: K,
    val: NotificationTemplateFormType[K],
  ) => {
    setForm((prev) => ({ ...prev, [field]: val }));
    setIsDirty(true);
  };

  const handleInsertTag = (tag: string) => {
    updateField("bodyText", `${form.bodyText} ${tag}`);
  };

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setIsDirty(false);
      setNotification("Template published and active for automated dispatches!");
    }, 500);
  };

  const handleDiscard = () => {
    setForm(INITIAL_TEMPLATE_FORM);
    setIsDirty(false);
  };

  const handleSendTest = () => {
    setNotification(
      `Test ${form.channel.toUpperCase()} sent to registered merchant test recipient!`,
    );
  };

  return (
    <Page
      heading="Notification & Message Template Designer"
      subheading="Design high-converting SMS and Email notification copy with live Liquid tag interpolation."
      inlineSize="large"
    >
      <BlockStack gap="base">
        {notification && (
          <Banner
            tone="success"
            title={notification}
            onDismiss={() => setNotification(null)}
          />
        )}

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0, 2fr) minmax(280px, 1fr)",
            gap: "var(--p-space-400, 16px)",
            alignItems: "start",
          }}
        >
          {/* Main Column */}
          <BlockStack gap="base">
            <TemplateConfigCard
              name={form.name}
              channel={form.channel}
              senderName={form.senderName}
              subject={form.subject}
              onUpdateName={(val) => updateField("name", val)}
              onUpdateChannel={(val: TemplateChannelType) =>
                updateField("channel", val)
              }
              onUpdateSenderName={(val) => updateField("senderName", val)}
              onUpdateSubject={(val) => updateField("subject", val)}
            />

            <DynamicVariablesCard onInsertTag={handleInsertTag} />

            <TemplateEditorCard
              bodyText={form.bodyText}
              channel={form.channel}
              onChangeBodyText={(val) => updateField("bodyText", val)}
            />
          </BlockStack>

          {/* Sidebar Preview Column */}
          <DevicePreviewSidebarCard
            template={form}
            onSendTest={handleSendTest}
          />
        </div>

        {isDirty && (
          <SaveBar
            open={isDirty}
            onSave={handleSave}
            onDiscard={handleDiscard}
            loading={isSaving}
          />
        )}
      </BlockStack>
    </Page>
  );
}

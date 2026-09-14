import * as React from "react";
import {
  Page,
  BlockStack,
  Banner,
  SaveBar,
} from "@xco-agency/corex-ui";
import {
  INITIAL_SEGMENT_RULES,
  MOCK_MATCHED_CUSTOMERS,
} from "../constants";
import { SegmentFilterBuilderCard } from "../partials/SegmentFilterBuilderCard";
import { AudienceReachCard } from "../partials/AudienceReachCard";
import { MatchedCustomersTableCard } from "../partials/MatchedCustomersTableCard";
import { SegmentActionsBar } from "../partials/SegmentActionsBar";
import type { SegmentFilterRuleType, SegmentFormType } from "../types";

export function CustomerSegmentsExample() {
  const [form, setForm] = React.useState<SegmentFormType>({
    name: "VIP High-Spenders (>$400 LTV)",
    description: "Loyal repeat customers who have placed 4 or more orders with high lifetime value.",
    rules: INITIAL_SEGMENT_RULES,
    matchingCount: 1420,
    totalStoreCustomers: 7850,
    averageLtv: 582.4,
  });

  const [isDirty, setIsDirty] = React.useState(false);
  const [isSaving, setIsSaving] = React.useState(false);
  const [notification, setNotification] = React.useState<string | null>(null);

  const updateField = <K extends keyof SegmentFormType>(
    field: K,
    val: SegmentFormType[K],
  ) => {
    setForm((prev) => ({ ...prev, [field]: val }));
    setIsDirty(true);
  };

  const handleUpdateRule = (id: string, updates: Partial<SegmentFilterRuleType>) => {
    const next = form.rules.map((r) => (r.id === id ? { ...r, ...updates } : r));
    updateField("rules", next);
  };

  const handleAddRule = () => {
    const newRule: SegmentFilterRuleType = {
      id: `rule-${Date.now()}`,
      criterion: "country",
      operator: "equals",
      value: "US",
    };
    updateField("rules", [...form.rules, newRule]);
  };

  const handleRemoveRule = (id: string) => {
    updateField(
      "rules",
      form.rules.filter((r) => r.id !== id),
    );
  };

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setIsDirty(false);
      setNotification("Customer segment saved! Filter rules will automatically update membership.");
    }, 500);
  };

  const handleDiscard = () => {
    setForm({
      name: "VIP High-Spenders (>$400 LTV)",
      description: "Loyal repeat customers who have placed 4 or more orders with high lifetime value.",
      rules: INITIAL_SEGMENT_RULES,
      matchingCount: 1420,
      totalStoreCustomers: 7850,
      averageLtv: 582.4,
    });
    setIsDirty(false);
  };

  return (
    <Page
      heading="Customer Segment & Audience Filter"
      subheading="Define dynamic target customer cohorts based on orders, total spend, tags, and behavior."
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

        <SegmentActionsBar
          matchingCount={form.matchingCount}
          onExportCsv={() => setNotification("Exporting 1,420 customer records to CSV...")}
          onBulkTag={() => setNotification("Bulk tag action scheduled for segment.")}
          onSendCampaign={() => setNotification("Drafting email campaign for segment.")}
        />

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
            <SegmentFilterBuilderCard
              name={form.name}
              description={form.description}
              rules={form.rules}
              onUpdateName={(val) => updateField("name", val)}
              onUpdateDescription={(val) => updateField("description", val)}
              onUpdateRule={handleUpdateRule}
              onAddRule={handleAddRule}
              onRemoveRule={handleRemoveRule}
            />

            <MatchedCustomersTableCard customers={MOCK_MATCHED_CUSTOMERS} />
          </BlockStack>

          {/* Sidebar Column */}
          <AudienceReachCard
            matchingCount={form.matchingCount}
            totalCustomers={form.totalStoreCustomers}
            averageLtv={form.averageLtv}
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

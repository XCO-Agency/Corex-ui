import * as React from "react";
import { Page, BlockStack, Banner, SaveBar } from "@xco-agency/corex-ui";
import { INITIAL_WORKFLOW_FORM } from "../constants";
import { WorkflowTriggerCard } from "../partials/WorkflowTriggerCard";
import { WorkflowConditionsCard } from "../partials/WorkflowConditionsCard";
import { WorkflowActionsCard } from "../partials/WorkflowActionsCard";
import { WorkflowStatusSidebarCard } from "../partials/WorkflowStatusSidebarCard";
import type {
  WorkflowActionType,
  WorkflowConditionItemType,
  WorkflowRuleFormType,
  WorkflowTriggerEventType,
} from "../types";

export function WorkflowBuilderExample() {
  const [form, setForm] = React.useState<WorkflowRuleFormType>(INITIAL_WORKFLOW_FORM);
  const [isDirty, setIsDirty] = React.useState(false);
  const [isSaving, setIsSaving] = React.useState(false);
  const [notification, setNotification] = React.useState<string | null>(null);

  const updateField = <K extends keyof WorkflowRuleFormType>(
    field: K,
    val: WorkflowRuleFormType[K],
  ) => {
    setForm((prev) => ({ ...prev, [field]: val }));
    setIsDirty(true);
  };

  const handleUpdateCondition = (
    id: string,
    updates: Partial<WorkflowConditionItemType>,
  ) => {
    const next = form.conditions.map((c) => (c.id === id ? { ...c, ...updates } : c));
    updateField("conditions", next);
  };

  const handleAddCondition = () => {
    const newCond: WorkflowConditionItemType = {
      id: `cond-${Date.now()}`,
      field: "customer.orders_count",
      operator: "greater_than",
      value: "3",
    };
    updateField("conditions", [...form.conditions, newCond]);
  };

  const handleRemoveCondition = (id: string) => {
    updateField(
      "conditions",
      form.conditions.filter((c) => c.id !== id),
    );
  };

  const handleUpdateAction = (id: string, updates: Partial<WorkflowActionType>) => {
    const next = form.actions.map((a) => (a.id === id ? { ...a, ...updates } : a));
    updateField("actions", next);
  };

  const handleAddAction = () => {
    const newAction: WorkflowActionType = {
      id: `act-${Date.now()}`,
      actionKey: "send_email",
      actionLabel: "Send Automated Merchant Email",
      targetValue: "admin@store.com",
    };
    updateField("actions", [...form.actions, newAction]);
  };

  const handleRemoveAction = (id: string) => {
    updateField(
      "actions",
      form.actions.filter((a) => a.id !== id),
    );
  };

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setIsDirty(false);
      setNotification("Automation workflow deployed and active!");
    }, 500);
  };

  const handleDiscard = () => {
    setForm(INITIAL_WORKFLOW_FORM);
    setIsDirty(false);
  };

  const handleSimulateRun = () => {
    setNotification(
      "Dry run passed: All 2 conditions matched. 2 simulated actions succeeded.",
    );
  };

  return (
    <Page
      heading="Automation Workflow Builder"
      subheading="Construct trigger-condition-action flows to automate customer tags, alerts, and store logic."
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
            <WorkflowTriggerCard
              name={form.name}
              description={form.description}
              triggerEvent={form.triggerEvent}
              onUpdateName={(val) => updateField("name", val)}
              onUpdateDescription={(val) => updateField("description", val)}
              onUpdateTrigger={(val: WorkflowTriggerEventType) =>
                updateField("triggerEvent", val)
              }
            />

            <WorkflowConditionsCard
              logicGate={form.logicGate}
              conditions={form.conditions}
              onUpdateLogicGate={(gate) => updateField("logicGate", gate)}
              onUpdateCondition={handleUpdateCondition}
              onAddCondition={handleAddCondition}
              onRemoveCondition={handleRemoveCondition}
            />

            <WorkflowActionsCard
              actions={form.actions}
              onUpdateAction={handleUpdateAction}
              onAddAction={handleAddAction}
              onRemoveAction={handleRemoveAction}
            />
          </BlockStack>

          {/* Sidebar Column */}
          <WorkflowStatusSidebarCard
            enabled={form.enabled}
            totalRuns={form.totalRuns}
            lastRunAt={form.lastRunAt}
            conditionCount={form.conditions.length}
            actionCount={form.actions.length}
            onToggleEnabled={(enabled) => updateField("enabled", enabled)}
            onSimulateRun={handleSimulateRun}
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

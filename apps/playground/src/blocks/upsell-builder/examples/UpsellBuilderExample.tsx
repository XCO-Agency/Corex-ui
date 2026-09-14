import * as React from "react";
import {
  Page,
  BlockStack,
  Banner,
  SaveBar,
} from "@xco-agency/corex-ui";
import {
  INITIAL_UPSELL_FORM,
  MOCK_AVAILABLE_ADDONS,
} from "../constants";
import { MilestoneRewardCard } from "../partials/MilestoneRewardCard";
import { AddonSelectorCard } from "../partials/AddonSelectorCard";
import { TriggerRulesCard } from "../partials/TriggerRulesCard";
import { UpsellSummarySidebarCard } from "../partials/UpsellSummarySidebarCard";
import type { RewardTierType, UpsellPlacementType, UpsellRuleFormType } from "../types";

export function UpsellBuilderExample() {
  const [form, setForm] = React.useState<UpsellRuleFormType>(INITIAL_UPSELL_FORM);
  const [isDirty, setIsDirty] = React.useState(false);
  const [isSaving, setIsSaving] = React.useState(false);
  const [notification, setNotification] = React.useState<string | null>(null);

  const updateField = <K extends keyof UpsellRuleFormType>(
    field: K,
    val: UpsellRuleFormType[K],
  ) => {
    setForm((prev) => ({ ...prev, [field]: val }));
    setIsDirty(true);
  };

  const handleToggleAddon = (id: string) => {
    const next = form.selectedAddonIds.includes(id)
      ? form.selectedAddonIds.filter((item) => item !== id)
      : [...form.selectedAddonIds, id];
    updateField("selectedAddonIds", next);
  };

  const handleUpdateTier = (tierId: string, updates: Partial<RewardTierType>) => {
    const next = form.rewardTiers.map((t) =>
      t.id === tierId ? { ...t, ...updates } : t,
    );
    updateField("rewardTiers", next);
  };

  const handleAddTier = () => {
    const last = form.rewardTiers[form.rewardTiers.length - 1];
    const newThreshold = (last?.threshold ?? 100) + 50;
    const newTier: RewardTierType = {
      id: `tier-${Date.now()}`,
      threshold: newThreshold,
      rewardTitle: `Reward tier at $${newThreshold}`,
      unlockedLabel: `Unlocked reward at $${newThreshold}!`,
      icon: "gift",
    };
    updateField("rewardTiers", [...form.rewardTiers, newTier]);
  };

  const handleRemoveTier = (tierId: string) => {
    updateField(
      "rewardTiers",
      form.rewardTiers.filter((t) => t.id !== tierId),
    );
  };

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setIsDirty(false);
      setNotification("Upsell & milestone rules published to store successfully!");
    }, 500);
  };

  const handleDiscard = () => {
    setForm(INITIAL_UPSELL_FORM);
    setIsDirty(false);
  };

  return (
    <Page
      heading="Cart Upsell & Rewards Builder"
      subheading="Configure one-click add-ons and milestone rewards to boost average order value."
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
            <TriggerRulesCard
              title={form.title}
              placement={form.placement}
              minSubtotal={form.minCartSubtotal}
              discountPercentage={form.discountPercentage}
              onUpdateTitle={(val) => updateField("title", val)}
              onUpdatePlacement={(val: UpsellPlacementType) =>
                updateField("placement", val)
              }
              onUpdateMinSubtotal={(val) => updateField("minCartSubtotal", val)}
              onUpdateDiscount={(val) => updateField("discountPercentage", val)}
            />

            <MilestoneRewardCard
              enabled={form.milestoneRewardEnabled}
              tiers={form.rewardTiers}
              onToggleEnabled={(enabled) =>
                updateField("milestoneRewardEnabled", enabled)
              }
              onUpdateTier={handleUpdateTier}
              onAddTier={handleAddTier}
              onRemoveTier={handleRemoveTier}
            />

            <AddonSelectorCard
              addons={MOCK_AVAILABLE_ADDONS}
              selectedIds={form.selectedAddonIds}
              onToggleAddon={handleToggleAddon}
            />
          </BlockStack>

          {/* Sidebar Column */}
          <UpsellSummarySidebarCard
            enabled={form.enabled}
            selectedAddonCount={form.selectedAddonIds.length}
            placement={form.placement}
            milestoneEnabled={form.milestoneRewardEnabled}
            onToggleEnabled={(enabled) => updateField("enabled", enabled)}
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

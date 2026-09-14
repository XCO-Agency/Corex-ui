import * as React from "react";
import {
  Page,
  BlockStack,
  Banner,
  SaveBar,
} from "@xco-agency/corex-ui";
import { INITIAL_DISCOUNT_FORM } from "../constants";
import { DiscountGeneralCard } from "../partials/DiscountGeneralCard";
import { DiscountTiersCard } from "../partials/DiscountTiersCard";
import { TargetCollectionsCard } from "../partials/TargetCollectionsCard";
import { TierPreviewSidebarCard } from "../partials/TierPreviewSidebarCard";
import type { DiscountFormType, DiscountMethodType, DiscountTierType } from "../types";

export function DiscountRulesExample() {
  const [form, setForm] = React.useState<DiscountFormType>(INITIAL_DISCOUNT_FORM);
  const [isDirty, setIsDirty] = React.useState(false);
  const [isSaving, setIsSaving] = React.useState(false);
  const [notification, setNotification] = React.useState<string | null>(null);

  const updateField = <K extends keyof DiscountFormType>(
    field: K,
    val: DiscountFormType[K],
  ) => {
    setForm((prev) => ({ ...prev, [field]: val }));
    setIsDirty(true);
  };

  const handleUpdateTier = (id: string, updates: Partial<DiscountTierType>) => {
    const next = form.tiers.map((t) => (t.id === id ? { ...t, ...updates } : t));
    updateField("tiers", next);
  };

  const handleAddTier = () => {
    const last = form.tiers[form.tiers.length - 1];
    const nextQty = (last?.minQuantity ?? 1) + 2;
    const nextDisc = (last?.discountValue ?? 5) + 10;
    const newTier: DiscountTierType = {
      id: `tier-${Date.now()}`,
      minQuantity: nextQty,
      discountValue: nextDisc,
      discountType: "percentage",
      badgeLabel: `Save ${nextDisc}%`,
    };
    updateField("tiers", [...form.tiers, newTier]);
  };

  const handleRemoveTier = (id: string) => {
    updateField(
      "tiers",
      form.tiers.filter((t) => t.id !== id),
    );
  };

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setIsDirty(false);
      setNotification("Volume discount rules saved and published!");
    }, 500);
  };

  const handleDiscard = () => {
    setForm(INITIAL_DISCOUNT_FORM);
    setIsDirty(false);
  };

  return (
    <Page
      heading="Tiered Volume Discount Rules"
      subheading="Encourage wholesale and multi-unit purchases with progressive quantity discounts."
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
            <DiscountGeneralCard
              title={form.title}
              code={form.code}
              method={form.method}
              startsAt={form.startsAt}
              endsAt={form.endsAt}
              onUpdateTitle={(val) => updateField("title", val)}
              onUpdateCode={(val) => updateField("code", val)}
              onUpdateMethod={(val: DiscountMethodType) => updateField("method", val)}
              onUpdateStartsAt={(val) => updateField("startsAt", val)}
              onUpdateEndsAt={(val) => updateField("endsAt", val)}
            />

            <DiscountTiersCard
              tiers={form.tiers}
              onUpdateTier={handleUpdateTier}
              onAddTier={handleAddTier}
              onRemoveTier={handleRemoveTier}
            />

            <TargetCollectionsCard
              appliesTo={form.appliesTo}
              collections={form.selectedCollectionNames}
              combinesWithShipping={form.combinesWithShipping}
              combinesWithProductDiscounts={form.combinesWithProductDiscounts}
              onUpdateAppliesTo={(val) => updateField("appliesTo", val)}
              onRemoveCollection={(name) =>
                updateField(
                  "selectedCollectionNames",
                  form.selectedCollectionNames.filter((n) => n !== name),
                )
              }
              onAddCollection={() =>
                updateField("selectedCollectionNames", [
                  ...form.selectedCollectionNames,
                  "New Seasonal Collection",
                ])
              }
              onUpdateCombinesShipping={(val) =>
                updateField("combinesWithShipping", val)
              }
              onUpdateCombinesProducts={(val) =>
                updateField("combinesWithProductDiscounts", val)
              }
            />
          </BlockStack>

          {/* Sidebar Column */}
          <TierPreviewSidebarCard tiers={form.tiers} method={form.method} />
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

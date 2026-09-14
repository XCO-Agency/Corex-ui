import * as React from "react";
import { Page, BlockStack, Banner } from "@xco-agency/corex-ui";
import {
  AVAILABLE_OFFER_PRODUCTS,
  INITIAL_OFFER_FORM,
} from "../constants";
import { OfferDetailsCard } from "../partials/OfferDetailsCard";
import { OfferRulesCard } from "../partials/OfferRulesCard";
import { OfferSaveBar } from "../partials/OfferSaveBar";
import { OfferStatusSidebarCard } from "../partials/OfferStatusSidebarCard";
import { OfferSummarySidebarCard } from "../partials/OfferSummarySidebarCard";
import { OfferTargetProductsCard } from "../partials/OfferTargetProductsCard";
import type { OfferFormType } from "../types";

export function OfferEditorExample() {
  const [form, setForm] = React.useState<OfferFormType>(INITIAL_OFFER_FORM);
  const [isDirty, setIsDirty] = React.useState(false);
  const [isSaving, setIsSaving] = React.useState(false);
  const [savedNotification, setSavedNotification] = React.useState<string | null>(null);

  const selectedProducts = React.useMemo(() => {
    return AVAILABLE_OFFER_PRODUCTS.filter((p) =>
      form.selectedProductIds.includes(p.id),
    );
  }, [form.selectedProductIds]);

  const updateField = <K extends keyof OfferFormType>(
    field: K,
    value: OfferFormType[K],
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setIsDirty(true);
  };

  const handleAddProduct = (id: string) => {
    if (!form.selectedProductIds.includes(id)) {
      updateField("selectedProductIds", [...form.selectedProductIds, id]);
    }
  };

  const handleRemoveProduct = (id: string) => {
    updateField(
      "selectedProductIds",
      form.selectedProductIds.filter((pid) => pid !== id),
    );
  };

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setIsDirty(false);
      setSavedNotification("Offer changes saved successfully!");
    }, 600);
  };

  const handleDiscard = () => {
    setForm(INITIAL_OFFER_FORM);
    setIsDirty(false);
  };

  return (
    <Page
      heading="Edit Autumn Upsell Offer"
      subheading="Configure cart drawer triggers, discount amounts, and target items."
      inlineSize="large"
    >
      <BlockStack gap="base">
        {savedNotification && (
          <Banner
            tone="success"
            title={savedNotification}
            onDismiss={() => setSavedNotification(null)}
          />
        )}

        {/* 2-Column Shopify Admin Layout (2/3 Main + 1/3 Sidebar) */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: "var(--p-space-base, 16px)",
            alignItems: "start",
          }}
        >
          {/* Main 2/3 Column */}
          <div style={{ display: "flex", flexDirection: "column", gap: "16px", minWidth: 0 }}>
            <OfferDetailsCard
              data={{
                title: form.title,
                internalName: form.internalName,
                bannerText: form.bannerText,
              }}
              onChange={(field, val) => updateField(field, val)}
            />

            <OfferRulesCard
              discountType={form.discountType}
              discountValue={form.discountValue}
              triggerType={form.triggerType}
              minimumSubtotal={form.minimumSubtotal}
              onDiscountTypeChange={(val) => updateField("discountType", val)}
              onDiscountValueChange={(val) => updateField("discountValue", val)}
              onTriggerTypeChange={(val) => updateField("triggerType", val)}
              onMinimumSubtotalChange={(val) => updateField("minimumSubtotal", val)}
            />

            <OfferTargetProductsCard
              selectedProducts={selectedProducts}
              availableProducts={AVAILABLE_OFFER_PRODUCTS}
              onAddProduct={handleAddProduct}
              onRemoveProduct={handleRemoveProduct}
            />
          </div>

          {/* Sidebar 1/3 Column */}
          <div style={{ display: "flex", flexDirection: "column", gap: "16px", minWidth: 0 }}>
            <OfferStatusSidebarCard
              isActive={form.isActive}
              startDate={form.startDate}
              endDate={form.endDate}
              hasEndDate={form.hasEndDate}
              onIsActiveChange={(active) => updateField("isActive", active)}
              onStartDateChange={(val) => updateField("startDate", val)}
              onEndDateChange={(val) => updateField("endDate", val)}
              onHasEndDateChange={(val) => updateField("hasEndDate", val)}
            />

            <OfferSummarySidebarCard
              form={form}
              selectedCount={selectedProducts.length}
            />
          </div>
        </div>

        {/* Sticky Bottom Save Bar */}
        <OfferSaveBar
          isDirty={isDirty}
          isSaving={isSaving}
          onSave={handleSave}
          onDiscard={handleDiscard}
        />
      </BlockStack>
    </Page>
  );
}

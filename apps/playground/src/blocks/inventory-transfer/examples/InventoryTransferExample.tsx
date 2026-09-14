import * as React from "react";
import {
  Page,
  BlockStack,
  Banner,
  SaveBar,
} from "@xco-agency/corex-ui";
import {
  MOCK_LOCATIONS,
  MOCK_TRANSFER_ITEMS,
} from "../constants";
import { TransferOriginDestinationCard } from "../partials/TransferOriginDestinationCard";
import { TransferProductsTableCard } from "../partials/TransferProductsTableCard";
import { TransferShipmentDetailsCard } from "../partials/TransferShipmentDetailsCard";
import { TransferSummarySidebarCard } from "../partials/TransferSummarySidebarCard";
import type { TransferFormType, TransferItemType } from "../types";

export function InventoryTransferExample() {
  const [form, setForm] = React.useState<TransferFormType>({
    originLocationId: "loc-1",
    destinationLocationId: "loc-3",
    referenceNumber: "TR-2026-0891",
    notes: "Replenishing SoHo showroom stock for Q4 holiday peak season.",
    items: MOCK_TRANSFER_ITEMS,
    shipping: {
      carrier: "fedex_freight",
      trackingNumber: "7946 2948 1092",
      expectedDeliveryDate: "2026-09-22",
      shippingMethod: "ground_standard",
    },
    status: "draft",
  });

  const [isDirty, setIsDirty] = React.useState(false);
  const [isSaving, setIsSaving] = React.useState(false);
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [notification, setNotification] = React.useState<string | null>(null);

  const updateForm = <K extends keyof TransferFormType>(
    key: K,
    val: TransferFormType[K],
  ) => {
    setForm((prev) => ({ ...prev, [key]: val }));
    setIsDirty(true);
  };

  const handleQuantityChange = (id: string, qty: number) => {
    const nextItems = form.items.map((item) =>
      item.id === id ? { ...item, transferQuantity: qty } : item,
    );
    updateForm("items", nextItems);
  };

  const handleRemoveItem = (id: string) => {
    updateForm(
      "items",
      form.items.filter((item) => item.id !== id),
    );
  };

  const handleAddItem = () => {
    const newItem: TransferItemType = {
      id: `item-${Date.now()}`,
      name: "Specialty Pour-Over Filter Papers (100pk)",
      sku: "FLT-PAP-100-WHT",
      thumbnailSrc:
        "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=100&auto=format&fit=crop&q=60",
      originStock: 240,
      destinationStock: 15,
      transferQuantity: 50,
      unitCost: 8.5,
    };
    updateForm("items", [...form.items, newItem]);
  };

  const handleShippingChange = <K extends keyof TransferFormType["shipping"]>(
    field: K,
    val: TransferFormType["shipping"][K],
  ) => {
    updateForm("shipping", { ...form.shipping, [field]: val });
  };

  const handleInitiateTransfer = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      updateForm("status", "in_transit");
      setIsDirty(false);
      setNotification(
        `Transfer ${form.referenceNumber} successfully dispatched! Origin inventory reserved and carrier notified.`,
      );
    }, 800);
  };

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setIsDirty(false);
      setNotification("Transfer order draft saved successfully.");
    }, 400);
  };

  const handleDiscard = () => {
    setForm({
      originLocationId: "loc-1",
      destinationLocationId: "loc-3",
      referenceNumber: "TR-2026-0891",
      notes: "Replenishing SoHo showroom stock for Q4 holiday peak season.",
      items: MOCK_TRANSFER_ITEMS,
      shipping: {
        carrier: "fedex_freight",
        trackingNumber: "7946 2948 1092",
        expectedDeliveryDate: "2026-09-22",
        shippingMethod: "ground_standard",
      },
      status: "draft",
    });
    setIsDirty(false);
  };

  const originLocation = MOCK_LOCATIONS.find(
    (l) => l.id === form.originLocationId,
  );
  const destinationLocation = MOCK_LOCATIONS.find(
    (l) => l.id === form.destinationLocationId,
  );

  return (
    <Page
      heading="Stock & Warehouse Transfer"
      subheading="Relocate inventory between multi-channel fulfillment warehouses and retail retail showrooms."
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
            <TransferOriginDestinationCard
              locations={MOCK_LOCATIONS}
              originLocationId={form.originLocationId}
              destinationLocationId={form.destinationLocationId}
              referenceNumber={form.referenceNumber}
              notes={form.notes}
              onOriginChange={(id) => updateForm("originLocationId", id)}
              onDestinationChange={(id) => updateForm("destinationLocationId", id)}
              onReferenceChange={(ref) => updateForm("referenceNumber", ref)}
              onNotesChange={(notes) => updateForm("notes", notes)}
            />

            <TransferProductsTableCard
              items={form.items}
              onQuantityChange={handleQuantityChange}
              onRemoveItem={handleRemoveItem}
              onAddItem={handleAddItem}
            />

            <TransferShipmentDetailsCard
              shipping={form.shipping}
              onChangeShipping={handleShippingChange}
            />
          </BlockStack>

          {/* Sidebar Column */}
          <TransferSummarySidebarCard
            originLocation={originLocation}
            destinationLocation={destinationLocation}
            items={form.items}
            status={form.status}
            isProcessing={isProcessing}
            onInitiateTransfer={handleInitiateTransfer}
            onPrintManifest={() =>
              setNotification(
                `Generating shipping manifest & barcode packing slip for ${form.referenceNumber}...`,
              )
            }
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

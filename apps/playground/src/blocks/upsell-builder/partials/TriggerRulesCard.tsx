import * as React from "react";
import {
  Card,
  BlockStack,
  InlineStack,
  Text,
  TextField,
  Select,
} from "@xco-agency/corex-ui";
import type { UpsellPlacementType } from "../types";

type TriggerRulesCardPropsType = {
  title: string;
  placement: UpsellPlacementType;
  minSubtotal: number;
  discountPercentage: number;
  onUpdateTitle: (val: string) => void;
  onUpdatePlacement: (val: UpsellPlacementType) => void;
  onUpdateMinSubtotal: (val: number) => void;
  onUpdateDiscount: (val: number) => void;
};

export function TriggerRulesCard({
  title,
  placement,
  minSubtotal,
  discountPercentage,
  onUpdateTitle,
  onUpdatePlacement,
  onUpdateMinSubtotal,
  onUpdateDiscount,
}: TriggerRulesCardPropsType) {
  const placementOptions = [
    { label: "Cart Drawer (Slide-out)", value: "cart_drawer" },
    { label: "Dedicated Cart Page (/cart)", value: "cart_page" },
    { label: "Post-Purchase Thank You Page", value: "post_purchase" },
  ];

  return (
    <Card>
      <BlockStack gap="base">
        <BlockStack gap="small-400">
          <Text as="h3" fontWeight="semibold">
            Trigger Conditions & Location
          </Text>
          <Text color="subdued" variant="bodySm">
            Define where and when this upsell block should appear in the checkout funnel.
          </Text>
        </BlockStack>

        <TextField
          label="Offer Campaign Name"
          value={title}
          onChange={onUpdateTitle}
          placeholder="e.g. Black Friday Free Shipping & Add-on Promo"
        />

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "var(--p-space-400, 16px)",
          }}
        >
          <Select
            label="Display Placement"
            value={placement}
            options={placementOptions}
            onChange={(val) => onUpdatePlacement(val as UpsellPlacementType)}
          />

          <TextField
            label="Minimum Cart Spend ($)"
            type="number"
            prefix="$"
            value={String(minSubtotal)}
            onChange={(val) => onUpdateMinSubtotal(Number(val) || 0)}
            helpText="Offers appear when subtotal reaches this amount."
          />
        </div>

        <TextField
          label="Add-on Bundle Discount (%)"
          type="number"
          suffix="%"
          value={String(discountPercentage)}
          onChange={(val) => onUpdateDiscount(Number(val) || 0)}
          helpText="Optional incentive applied if a customer adds 2 or more add-ons."
        />
      </BlockStack>
    </Card>
  );
}

import { useState } from "react";
import { BlockStack, Grid, NumberField, Text } from "@xco-agency/corex-ui";

export function NumberFieldExample() {
  const [quantity, setQuantity] = useState("5");
  const [discountPercent, setDiscountPercent] = useState("15");

  return (
    <Grid columns={2} gap="base">
      <Grid.Item>
        <BlockStack gap="base">
          <NumberField
            label="Minimum order quantity"
            value={quantity}
            min={1}
            max={999}
            step={1}
            inputMode="numeric"
            details="Minimum units a customer must purchase per order"
            onChange={(val) => setQuantity(val)}
          />
          <Text variant="small" tone="subdued">
            Quantity: {quantity} units
          </Text>
        </BlockStack>
      </Grid.Item>

      <Grid.Item>
        <BlockStack gap="base">
          <NumberField
            label="Discount rate"
            value={discountPercent}
            min={0}
            max={100}
            step={0.5}
            suffix="%"
            inputMode="decimal"
            details="Percentage off during flash sale campaigns"
            onChange={(val) => setDiscountPercent(val)}
          />
          <Text variant="small" tone="subdued">
            Discount: {discountPercent}%
          </Text>
        </BlockStack>
      </Grid.Item>
    </Grid>
  );
}

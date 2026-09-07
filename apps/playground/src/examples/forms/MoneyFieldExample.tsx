import { useState } from "react";
import { BlockStack, Grid, MoneyField, Text } from "@xco-agency/corex-ui";

export function MoneyFieldExample() {
  const [price, setPrice] = useState("49.99");
  const [budget, setBudget] = useState("1200.00");

  return (
    <Grid columns={2} gap="base">
      <Grid.Item>
        <BlockStack gap="base">
          <MoneyField
            label="Product price"
            value={price}
            currencyCode="USD"
            min={0}
            max={10000}
            step={0.01}
            details="Standard retail price excluding tax"
            onChange={(val) => setPrice(val)}
          />
          <Text variant="small" tone="subdued">
            Current price: ${price}
          </Text>
        </BlockStack>
      </Grid.Item>

      <Grid.Item>
        <BlockStack gap="base">
          <MoneyField
            label="Monthly campaign budget"
            value={budget}
            currencyCode="EUR"
            min={100}
            step={50}
            placeholder="0.00"
            details="Minimum monthly spend for ad placements"
            onChange={(val) => setBudget(val)}
          />
          <Text variant="small" tone="subdued">
            Current budget: €{budget}
          </Text>
        </BlockStack>
      </Grid.Item>
    </Grid>
  );
}

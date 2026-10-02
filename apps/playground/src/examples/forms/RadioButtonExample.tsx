import { useState } from "react";
import { BlockStack, Card, RadioButton, Text } from "@xco-agency/corex-ui";

type PlanType = "FIXED" | "LIFETIME";

export function RadioButtonExample() {
  const [plan, setPlan] = useState<PlanType>("FIXED");

  return (
    <Card>
      <BlockStack gap="small-200">
        <Text heading>Billing</Text>
        <RadioButton
          id="fixed"
          name="plan"
          value="FIXED"
          label="Fixed amount"
          helpText="Charged once per order"
          checked={plan === "FIXED"}
          onChange={() => setPlan("FIXED")}
        />
        <RadioButton
          id="lifetime"
          name="plan"
          value="LIFETIME"
          label="Lifetime"
          helpText="One payment, no renewal"
          checked={plan === "LIFETIME"}
          onChange={() => setPlan("LIFETIME")}
        />
        <Text color="subdued">Selected: {plan}</Text>
      </BlockStack>
    </Card>
  );
}

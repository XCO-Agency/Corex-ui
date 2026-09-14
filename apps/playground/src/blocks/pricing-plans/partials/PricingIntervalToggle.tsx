import * as React from "react";
import {
  InlineStack,
  ButtonGroup,
  Button,
  Badge,
  Text,
} from "@xco-agency/corex-ui";
import type { PricingIntervalTogglePropsType } from "../types";

export function PricingIntervalToggle({
  interval,
  discountPercentage = 20,
  onChange,
}: PricingIntervalTogglePropsType) {
  return (
    <InlineStack gap="base" alignItems="center" justifyContent="center">
      <ButtonGroup>
        <Button
          variant={interval === "monthly" ? "primary" : "secondary"}
          onClick={() => onChange("monthly")}
        >
          Monthly billing
        </Button>
        <Button
          variant={interval === "annual" ? "primary" : "secondary"}
          onClick={() => onChange("annual")}
        >
          Annual billing
        </Button>
      </ButtonGroup>

      <InlineStack gap="small-200" alignItems="center">
        <Badge tone="success">{`Save ${discountPercentage}%`}</Badge>
        <Text as="span" variant="xs" tone="neutral">
          Billed annually
        </Text>
      </InlineStack>
    </InlineStack>
  );
}

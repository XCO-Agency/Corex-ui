import { Button, Card, BlockStack, InlineStack, Text } from "@xco-agency/corex-ui";
import type { PricingEnterpriseCtaPropsType } from "../types";

/** For merchants who outgrow the listed plans. */
export function PricingEnterpriseCta({ onContactSales }: PricingEnterpriseCtaPropsType) {
  return (
    <Card>
      <InlineStack justifyContent="space-between" alignItems="center" gap="base" wrap>
        <BlockStack gap="small-400">
          <Text variant="base" heading>
            Need more than Scale?
          </Text>
          <Text variant="small" color="subdued">
            Custom limits, SSO, a dedicated success manager and volume pricing for
            high-volume stores.
          </Text>
        </BlockStack>
        <Button variant="secondary" onClick={onContactSales}>
          Contact sales
        </Button>
      </InlineStack>
    </Card>
  );
}

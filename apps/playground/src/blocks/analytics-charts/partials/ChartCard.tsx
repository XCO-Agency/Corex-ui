import { BlockStack, Card, InlineStack, Text } from "@xco-agency/corex-ui";
import type { ChartCardPropsType } from "../types";
import { ChangeIndicator } from "./ChangeIndicator";

/**
 * Shopify's analytics card: a Corex `Card`, so the title (`heading`), its
 * definition (`tooltip`) and header `actions` are the Card's own, then the
 * headline value with its change, then the chart.
 */
export function ChartCard({
  value,
  change,
  changeLabel,
  children,
  ...card
}: ChartCardPropsType) {
  return (
    <Card {...card}>
      <BlockStack gap="base">
        {value != null && (
          <InlineStack gap="small-200" alignItems="center">
            <Text as="p" variant="headingLg">
              {value}
            </Text>
            <ChangeIndicator pct={change ?? null} label={changeLabel} />
          </InlineStack>
        )}
        {children}
      </BlockStack>
    </Card>
  );
}

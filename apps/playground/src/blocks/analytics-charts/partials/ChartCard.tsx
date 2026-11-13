import { BlockStack, Card, InlineStack, Text } from "@xco-agency/corex-ui";
import type { ChartCardPropsType } from "../types";
import { ChangeIndicator } from "./ChangeIndicator";

/**
 * Shopify's analytics card: the title (dotted underline, its definition on
 * hover), the headline value with its change, then the chart.
 */
export function ChartCard({
  title,
  definition,
  value,
  change,
  changeLabel,
  action,
  children,
}: ChartCardPropsType) {
  return (
    <Card>
      <BlockStack gap="base">
        <BlockStack gap="small-300">
          <InlineStack justifyContent="space-between" alignItems="center" gap="small-200">
            <Text as="h3" variant="headingSm" tooltip={definition}>
              {title}
            </Text>
            {action}
          </InlineStack>
          {value != null && (
            <InlineStack gap="small-200" alignItems="center">
              <Text as="p" variant="headingLg">
                {value}
              </Text>
              <ChangeIndicator pct={change ?? null} label={changeLabel} />
            </InlineStack>
          )}
        </BlockStack>
        {children}
      </BlockStack>
    </Card>
  );
}

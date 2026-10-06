import { BlockStack, Badge, Box, Card, Icon, Table, Text } from "@xco-agency/corex-ui";
import type { PricingComparisonTablePropsType } from "../types";
import { formatMoney, getPlanPrice } from "../utils";

/** Side-by-side plan comparison; the current plan's column is badged. */
export function PricingComparisonTable({
  plans,
  rows,
  interval,
  currentPlanId,
}: PricingComparisonTablePropsType) {
  return (
    <Card padding="none">
      <BlockStack>
        <Box padding="base">
          <BlockStack gap="none">
            <Text variant="base" heading>
              Compare plans
            </Text>
            <Text variant="small" color="subdued">
              Every limit and feature, side by side.
            </Text>
          </BlockStack>
        </Box>

        <Table variant="auto">
          <Table.HeaderRow>
            <Table.HeaderCell>Feature</Table.HeaderCell>
            {plans.map((plan) => (
              <Table.HeaderCell key={plan.id}>
                <BlockStack gap="small-500">
                  <Text variant="small" heading>
                    {plan.name}
                  </Text>
                  <Text variant="xs" color="subdued">
                    {plan.id === currentPlanId
                      ? "Current plan"
                      : `${formatMoney(getPlanPrice(plan, interval))} / mo`}
                  </Text>
                </BlockStack>
              </Table.HeaderCell>
            ))}
          </Table.HeaderRow>
          <Table.Body>
            {rows.map((row) => (
              <Table.Row key={row.label}>
                <Table.Cell>
                  <Text variant="small">{row.label}</Text>
                </Table.Cell>
                {plans.map((plan) => {
                  const value = row.values[plan.id];
                  return (
                    <Table.Cell key={plan.id}>
                      {typeof value === "boolean" ? (
                        <Icon
                          type={value ? "check" : "minus"}
                          size="small"
                          accessibilityLabel={value ? "Included" : "Not included"}
                        />
                      ) : (
                        <Text variant="small">{value}</Text>
                      )}
                    </Table.Cell>
                  );
                })}
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </BlockStack>
    </Card>
  );
}

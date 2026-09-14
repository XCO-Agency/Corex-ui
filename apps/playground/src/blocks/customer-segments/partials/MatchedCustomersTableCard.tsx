import * as React from "react";
import {
  Card,
  BlockStack,
  InlineStack,
  Text,
  Badge,
  Avatar,
  Table,
  Divider,
} from "@xco-agency/corex-ui";
import type { CustomerItemType } from "../types";

type MatchedCustomersTableCardPropsType = {
  customers: CustomerItemType[];
};

export function MatchedCustomersTableCard({
  customers,
}: MatchedCustomersTableCardPropsType) {
  return (
    <Card>
      <BlockStack gap="base">
        <InlineStack justifyContent="space-between" alignItems="center">
          <BlockStack gap="small-400">
            <Text as="h3" fontWeight="semibold">
              Matched Customers Preview
            </Text>
            <Text color="subdued" variant="small">
              Sample customers currently qualifying under active segment rules.
            </Text>
          </BlockStack>
          <Badge tone="neutral">Showing {customers.length} sample records</Badge>
        </InlineStack>

        <Divider />

        <Table>
          <Table.HeaderRow>
            <Table.Header>Customer</Table.Header>
            <Table.Header>Location</Table.Header>
            <Table.Header>Segment Tags</Table.Header>
            <Table.Header>Orders</Table.Header>
            <Table.Header>Total Spent</Table.Header>
          </Table.HeaderRow>
          <Table.Body>
            {customers.map((cust) => (
              <Table.Row key={cust.id}>
                <Table.Cell>
                  <InlineStack gap="base" alignItems="center">
                    <Avatar name={cust.name} size="medium" />
                    <BlockStack gap="small-500">
                      <Text fontWeight="semibold" variant="small">
                        {cust.name}
                      </Text>
                      <Text color="subdued" variant="small">
                        {cust.email}
                      </Text>
                    </BlockStack>
                  </InlineStack>
                </Table.Cell>

                <Table.Cell>
                  <Text variant="small">{cust.location}</Text>
                </Table.Cell>

                <Table.Cell>
                  <InlineStack gap="small-200" wrap>
                    {cust.tags.map((tag) => (
                      <Badge key={tag} tone="info">
                        {tag}
                      </Badge>
                    ))}
                  </InlineStack>
                </Table.Cell>

                <Table.Cell>
                  <BlockStack gap="small-500">
                    <Text variant="small" fontWeight="semibold">
                      {cust.ordersCount} orders
                    </Text>
                    <Text color="subdued" variant="small">
                      Last: {cust.lastOrderDate}
                    </Text>
                  </BlockStack>
                </Table.Cell>

                <Table.Cell>
                  <Text fontWeight="bold" variant="small">
                    ${cust.totalSpent.toFixed(2)}
                  </Text>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </BlockStack>
    </Card>
  );
}

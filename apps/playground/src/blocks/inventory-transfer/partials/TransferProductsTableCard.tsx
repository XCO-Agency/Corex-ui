import * as React from "react";
import {
  Card,
  BlockStack,
  InlineStack,
  Text,
  Badge,
  Thumbnail,
  Button,
  NumberField,
  Table,
  Banner,
  Divider,
} from "@xco-agency/corex-ui";
import type { TransferItemType } from "../types";

type TransferProductsTableCardPropsType = {
  items: TransferItemType[];
  onQuantityChange: (id: string, qty: number) => void;
  onRemoveItem: (id: string) => void;
  onAddItem: () => void;
};

export function TransferProductsTableCard({
  items,
  onQuantityChange,
  onRemoveItem,
  onAddItem,
}: TransferProductsTableCardPropsType) {
  const exceededItems = items.filter(
    (item) => item.transferQuantity > item.originStock,
  );

  return (
    <Card>
      <BlockStack gap="base">
        <InlineStack justifyContent="space-between" alignItems="center">
          <BlockStack gap="small-400">
            <Text as="h3" fontWeight="semibold">
              Items to Transfer
            </Text>
            <Text color="subdued" variant="small">
              Adjust quantity allocations for each SKU. Stock will be reserved at the origin facility.
            </Text>
          </BlockStack>
          <Button variant="secondary" onClick={onAddItem}>
            + Add Product
          </Button>
        </InlineStack>

        <Divider />

        {exceededItems.length > 0 && (
          <Banner tone="critical" title="Transfer Quantity Exceeds Available Stock">
            {exceededItems.map((it) => it.name).join(", ")}{" "}
            {exceededItems.length === 1 ? "has" : "have"} transfer quantities greater than on-hand origin stock.
          </Banner>
        )}

        <Table>
          <Table.HeaderRow>
            <Table.Header>Product</Table.Header>
            <Table.Header>Origin Stock</Table.Header>
            <Table.Header>Dest. Stock</Table.Header>
            <Table.Header>Transfer Qty</Table.Header>
            <Table.Header>Actions</Table.Header>
          </Table.HeaderRow>
          <Table.Body>
            {items.map((item) => {
              const isExceeded = item.transferQuantity > item.originStock;

              return (
                <Table.Row key={item.id}>
                  <Table.Cell>
                    <InlineStack gap="base" alignItems="center">
                      <Thumbnail
                        source={item.thumbnailSrc}
                        alt={item.name}
                        size="small"
                      />
                      <BlockStack gap="small-500">
                        <Text fontWeight="semibold" variant="small">
                          {item.name}
                        </Text>
                        <Text color="subdued" variant="small">
                          SKU: {item.sku} · ${item.unitCost.toFixed(2)} / unit
                        </Text>
                      </BlockStack>
                    </InlineStack>
                  </Table.Cell>

                  <Table.Cell>
                    <InlineStack gap="small-200" alignItems="center">
                      <Text fontWeight="bold" variant="small">
                        {item.originStock}
                      </Text>
                      <Text color="subdued" variant="small">
                        units
                      </Text>
                    </InlineStack>
                  </Table.Cell>

                  <Table.Cell>
                    <InlineStack gap="small-200" alignItems="center">
                      <Text variant="small">
                        {item.destinationStock}
                      </Text>
                      <Text color="subdued" variant="small">
                        units
                      </Text>
                    </InlineStack>
                  </Table.Cell>

                  <Table.Cell>
                    <div style={{ maxWidth: "110px" }}>
                      <NumberField
                        label="Transfer Quantity"
                        labelAccessibilityVisibility="exclusive"
                        value={String(item.transferQuantity)}
                        min={1}
                        max={item.originStock}
                        onChange={(val) =>
                          onQuantityChange(
                            item.id,
                            Math.max(1, Number(val) || 1),
                          )
                        }
                      />
                    </div>
                    {isExceeded && (
                      <Badge tone="critical">Exceeds Stock</Badge>
                    )}
                  </Table.Cell>

                  <Table.Cell>
                    <Button
                      variant="tertiary"
                      tone="critical"
                      onClick={() => onRemoveItem(item.id)}
                    >
                      Remove
                    </Button>
                  </Table.Cell>
                </Table.Row>
              );
            })}
          </Table.Body>
        </Table>
      </BlockStack>
    </Card>
  );
}

import * as React from "react";
import {
  Table,
  Checkbox,
  Thumbnail,
  Text,
  Badge,
  Button,
  InlineStack,
  BlockStack,
  Box,
} from "@xco-agency/corex-ui";
import type { ToneType } from "@xco-agency/corex-ui";
import type { ResourceStatusType, ResourceTableRowPropsType } from "../types";

const STATUS_TONE_MAP: Record<ResourceStatusType, ToneType> = {
  active: "success",
  draft: "info",
  archived: "neutral",
};

export function ResourceTableRow({
  item,
  isSelected,
  onToggleSelect,
  onDelete,
  onStatusChange,
}: ResourceTableRowPropsType) {
  const isLowInventory = item.status === "active" && item.inventory < 20;

  return (
    <Table.Row>
      {/* Selection checkbox */}
      <Table.Cell>
        <Box paddingBlock="none">
          <Checkbox
            label=""
            checked={isSelected}
            onChange={onToggleSelect}
          />
        </Box>
      </Table.Cell>

      {/* Primary resource column */}
      <Table.Cell>
        <InlineStack gap="small-300" alignItems="center">
          {item.imageUrl ? (
            <Thumbnail
              src={item.imageUrl}
              alt={item.title}
              size="small"
            />
          ) : (
            <InlineStack
              alignItems="center"
              justifyContent="center"
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "var(--p-border-radius-100)",
                background: "var(--p-color-bg-surface-secondary)",
              }}
            >
              <Text as="span" variant="xs" tone="neutral">
                N/A
              </Text>
            </InlineStack>
          )}

          <BlockStack gap="none">
            <Text variant="base" heading lineClamp={1}>
              {item.title}
            </Text>
            <InlineStack gap="small-200" alignItems="center">
              <Text variant="xs" tone="neutral">
                SKU: {item.sku}
              </Text>
              <Text variant="xs" tone="neutral">
                •
              </Text>
              <Text variant="xs" tone="neutral">
                {item.vendor}
              </Text>
            </InlineStack>
          </BlockStack>
        </InlineStack>
      </Table.Cell>

      {/* Status */}
      <Table.Cell>
        <Badge tone={STATUS_TONE_MAP[item.status]}>
          {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
        </Badge>
      </Table.Cell>

      {/* Inventory */}
      <Table.Cell>
        <BlockStack gap="none">
          <Text
            variant="small"
            tone={isLowInventory ? "warning" : "neutral"}
          >
            {item.inventory} in stock
          </Text>
          {isLowInventory && (
            <Text variant="xs" tone="warning">
              Low inventory
            </Text>
          )}
        </BlockStack>
      </Table.Cell>

      {/* Price */}
      <Table.Cell>
        <Text variant="small" heading>
          {item.price}
        </Text>
      </Table.Cell>

      {/* Category */}
      <Table.Cell>
        <Text variant="small" tone="neutral">
          {item.category}
        </Text>
      </Table.Cell>

      {/* Last updated */}
      <Table.Cell>
        <Text variant="xs" tone="neutral">
          {item.updatedAt}
        </Text>
      </Table.Cell>

      {/* Quick actions */}
      <Table.Cell>
        <InlineStack gap="small-200" justifyContent="end">
          {onStatusChange && (
            <Button
              variant="tertiary"
              onClick={() =>
                onStatusChange(
                  item.status === "active" ? "draft" : "active",
                )
              }
            >
              {item.status === "active" ? "Draft" : "Activate"}
            </Button>
          )}
          {onDelete && (
            <Button
              variant="tertiary"
              tone="critical"
              onClick={onDelete}
            >
              Delete
            </Button>
          )}
        </InlineStack>
      </Table.Cell>
    </Table.Row>
  );
}

import * as React from "react";
import {
  InlineStack,
  BlockStack,
  Text,
  Badge,
  Button,
  ButtonGroup,
} from "@xco-agency/corex-ui";
import type { ResourceBulkActionsPropsType } from "../types";

export function ResourceBulkActions({
  selectedCount,
  totalCount,
  onDeselectAll,
  onBulkStatusChange,
  onBulkDelete,
}: ResourceBulkActionsPropsType) {
  if (selectedCount === 0) return null;

  return (
    <BlockStack
      padding="small-300"
      paddingInline="base"
      style={{
        background: "var(--p-color-bg-surface-secondary)",
        borderBottom: "1px solid var(--p-color-border-subdued)",
      }}
    >
      <InlineStack
        gap="base"
        alignItems="center"
        justifyContent="space-between"
        wrap
      >
        <InlineStack gap="small-200" alignItems="center">
          <Badge tone="info">{`${selectedCount} selected`}</Badge>
          <Text as="span" tone="neutral" variant="small">
            of {totalCount} total items
          </Text>
          <Button variant="tertiary" onClick={onDeselectAll}>
            Deselect all
          </Button>
        </InlineStack>

        <ButtonGroup>
          <Button
            variant="secondary"
            onClick={() => onBulkStatusChange("active")}
          >
            Set active
          </Button>
          <Button
            variant="secondary"
            onClick={() => onBulkStatusChange("draft")}
          >
            Set draft
          </Button>
          <Button
            variant="secondary"
            onClick={() => onBulkStatusChange("archived")}
          >
            Archive
          </Button>
          <Button
            variant="secondary"
            tone="critical"
            onClick={onBulkDelete}
          >
            Delete
          </Button>
        </ButtonGroup>
      </InlineStack>
    </BlockStack>
  );
}

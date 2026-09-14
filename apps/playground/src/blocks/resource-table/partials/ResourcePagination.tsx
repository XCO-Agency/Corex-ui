import * as React from "react";
import {
  BlockStack,
  InlineStack,
  Text,
  Button,
  ButtonGroup,
} from "@xco-agency/corex-ui";
import type { ResourcePaginationPropsType } from "../types";

export function ResourcePagination({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  onPreviousPage,
  onNextPage,
}: ResourcePaginationPropsType) {
  const fromIndex = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const toIndex = Math.min(currentPage * pageSize, totalItems);

  return (
    <BlockStack
      padding="small-300"
      paddingInline="base"
      style={{
        borderTop: "1px solid var(--p-color-border-subdued)",
      }}
    >
      <InlineStack
        alignItems="center"
        justifyContent="space-between"
        wrap
        gap="base"
      >
        <Text as="span" variant="small" tone="neutral">
          {totalItems > 0
            ? `Showing ${fromIndex}–${toIndex} of ${totalItems} items`
            : "0 items"}
        </Text>

        <InlineStack gap="small-200" alignItems="center">
          <Text as="span" variant="xs" tone="neutral">
            Page {currentPage} of {Math.max(1, totalPages)}
          </Text>
          <ButtonGroup>
            <Button
              variant="secondary"
              disabled={currentPage <= 1}
              onClick={onPreviousPage}
            >
              Previous
            </Button>
            <Button
              variant="secondary"
              disabled={currentPage >= totalPages}
              onClick={onNextPage}
            >
              Next
            </Button>
          </ButtonGroup>
        </InlineStack>
      </InlineStack>
    </BlockStack>
  );
}

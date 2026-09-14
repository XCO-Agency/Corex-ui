import * as React from "react";
import {
  Box,
  InlineStack,
  BlockStack,
  SearchField,
  Select,
  Button,
} from "@xco-agency/corex-ui";
import type { ResourceFiltersPropsType } from "../types";

export function ResourceFilters({
  filters,
  categories,
  hasActiveFilters,
  onQueryChange,
  onStatusChange,
  onCategoryChange,
  onClearFilters,
}: ResourceFiltersPropsType) {
  const statusOptions = [
    { label: "All statuses", value: "all" },
    { label: "Active", value: "active" },
    { label: "Draft", value: "draft" },
    { label: "Archived", value: "archived" },
  ];

  const categoryOptions = categories.map((cat) => ({
    label: cat,
    value: cat,
  }));

  return (
    <Box paddingInline="base" paddingBlock="small-300">
      <InlineStack
        gap="base"
        alignItems="center"
        justifyContent="space-between"
        wrap
      >
        <BlockStack grow minInlineSize="240px">
          <SearchField
            placeholder="Search by title, SKU, or vendor..."
            value={filters.query}
            onChange={(val) => onQueryChange(val)}
            onClear={() => onQueryChange("")}
          />
        </BlockStack>

        <InlineStack gap="small-300" alignItems="center" wrap>
          <Box minInlineSize="140px">
            <Select
              label="Status"
              value={filters.status}
              options={statusOptions}
              onChange={(val) => onStatusChange(val)}
            />
          </Box>

          <Box minInlineSize="160px">
            <Select
              label="Category"
              value={filters.category}
              options={categoryOptions}
              onChange={(val) => onCategoryChange(val)}
            />
          </Box>

          {hasActiveFilters && (
            <Button variant="tertiary" onClick={onClearFilters}>
              Clear filters
            </Button>
          )}
        </InlineStack>
      </InlineStack>
    </Box>
  );
}

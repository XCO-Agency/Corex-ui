import * as React from "react";
import { EmptyState, Text } from "@xco-agency/corex-ui";
import type { ResourceEmptyStatePropsType } from "../types";

export function ResourceEmptyState({
  type,
  query,
  onClearFilters,
  onCreateResource,
}: ResourceEmptyStatePropsType) {
  if (type === "no-results") {
    return (
      <EmptyState
        heading="No resources found"
        image="https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png"
        action={
          onClearFilters
            ? {
                content: "Clear all filters",
                onAction: onClearFilters,
                variant: "secondary",
              }
            : undefined
        }
        padding="large-100"
      >
        <Text as="p" tone="neutral" variant="small">
          {query
            ? `No resources matching "${query}". Try searching for another keyword or clearing applied filters.`
            : "No resources found matching the selected filter criteria. Try adjusting your filters to see results."}
        </Text>
      </EmptyState>
    );
  }

  return (
    <EmptyState
      heading="Manage your products & inventory"
      image="https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png"
      action={
        onCreateResource
          ? {
              content: "Add product",
              onAction: onCreateResource,
              variant: "primary",
            }
          : undefined
      }
      secondaryAction={{
        content: "Import products",
        variant: "secondary",
      }}
      padding="large-100"
    >
      <Text as="p" tone="neutral" variant="small">
        Track inventory levels, variants, pricing, and fulfillment across your
        entire catalog from one centralized dashboard.
      </Text>
    </EmptyState>
  );
}

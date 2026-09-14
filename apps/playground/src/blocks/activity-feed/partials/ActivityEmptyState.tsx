import * as React from "react";
import { EmptyState, Text } from "@xco-agency/corex-ui";
import type { ActivityEmptyStatePropsType } from "../types";

export function ActivityEmptyState({
  onReset,
}: ActivityEmptyStatePropsType) {
  return (
    <EmptyState
      heading="No activity found"
      image="https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png"
      action={{
        content: "Reset filter",
        onAction: onReset,
        variant: "secondary",
      }}
      padding="large-100"
    >
      <Text as="p" tone="neutral" variant="small">
        There are no activity events matching the selected filter. Try selecting "All activities" or refreshing.
      </Text>
    </EmptyState>
  );
}

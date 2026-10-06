import { Box, EmptyState, Link, Text } from "@xco-agency/corex-ui";
import type { ProductIndexEmptyStatePropsType } from "../types";

/** Shown inside the table when no product matches the search and filters. */
export function ProductIndexEmptyState({ onClearAll }: ProductIndexEmptyStatePropsType) {
  return (
    <Box paddingBlock="large-300" paddingInline="large-100">
      <EmptyState
        heading="No products found"
        icon="search"
        action={{ content: "Clear search and filters", onAction: onClearAll }}
        footerContent={<Link url="#">Learn more about products</Link>}
      >
        <Text color="subdued">Try changing the filters or search term.</Text>
      </EmptyState>
    </Box>
  );
}

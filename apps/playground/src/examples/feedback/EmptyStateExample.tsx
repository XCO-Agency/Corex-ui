import { EmptyState, BlockStack, Card, Text } from "@xco-agency/corex-ui";

export function EmptyStateExample() {
  return (
    <BlockStack gap="large-200">
      <Card>
        <BlockStack gap="base">
          <Text heading as="h3">
            Standard with Illustration
          </Text>
          <EmptyState
            heading="Manage your inventory transfers"
            image="https://cdn.shopify.com/static/images/polaris/thumbnail-wc_src.jpg"
            imageAlt="Inventory transfer illustration"
            action={{
              content: "Add transfer",
              onAction: () => {},
            }}
            secondaryAction={{
              content: "Learn more",
              url: "#",
            }}
            footerContent="You can also import existing inventory counts from a CSV file."
          >
            Track and receive your incoming inventory from suppliers and locations.
          </EmptyState>
        </BlockStack>
      </Card>

      <Card>
        <BlockStack gap="base">
          <Text heading as="h3">
            With Search / Filter Icon
          </Text>
          <EmptyState
            heading="No matching results found"
            icon="search"
            action={{
              content: "Clear filters",
              onAction: () => {},
            }}
          >
            Try adjusting your search criteria or resetting filters to see results.
          </EmptyState>
        </BlockStack>
      </Card>

      <Card>
        <BlockStack gap="base">
          <Text heading as="h3">
            Contained Image & Single Action
          </Text>
          <EmptyState
            heading="No discounts active"
            image="https://cdn.shopify.com/static/images/polaris/thumbnail-wc_src.jpg"
            imageContained
            action={{
              content: "Create discount",
              onAction: () => {},
            }}
          >
            Create automatic or code-based discounts to encourage repeat purchases.
          </EmptyState>
        </BlockStack>
      </Card>
    </BlockStack>
  );
}

export default EmptyStateExample;

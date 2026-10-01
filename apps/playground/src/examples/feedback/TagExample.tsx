import { useState } from "react";
import { BlockStack, Card, InlineStack, Tag, Text } from "@xco-agency/corex-ui";

export function TagExample() {
  const [filters, setFilters] = useState(["Vendor: Acme", "Status: Active"]);

  return (
    <Card>
      <BlockStack gap="small-200">
        <Text heading>Applied filters</Text>
        <InlineStack gap="small-300" wrap>
          {filters.map((filter) => (
            <Tag
              key={filter}
              onRemove={() => setFilters(filters.filter((entry) => entry !== filter))}
            >
              {filter}
            </Tag>
          ))}
          <Tag>Fixed, no remove</Tag>
          <Tag onRemove={() => {}} disabled>
            Locked
          </Tag>
        </InlineStack>
        {filters.length === 0 ? <Text color="subdued">No filters left.</Text> : null}
      </BlockStack>
    </Card>
  );
}

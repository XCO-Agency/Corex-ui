import { useState } from "react";
import { BlockStack, SearchField, Text } from "@xco-agency/corex-ui";

export function SearchFieldExample() {
  const [value, setValue] = useState("");
  const [debouncedValue, setDebouncedValue] = useState("");

  return (
    <BlockStack gap="base" minInlineSize="300px">
      <SearchField
        label="Search products"
        placeholder="Search products, SKUs, or tags..."
        value={value}
        onChange={setValue}

        onDebouncedChange={setDebouncedValue}
        debounceDelay={300}
      />
      {debouncedValue && (
        <Text as="p" tone="neutral">
          Searching for: {debouncedValue}
        </Text>
      )}
    </BlockStack>
  );
}

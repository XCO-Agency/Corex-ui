import { useState } from "react";
import { BlockStack, Card, Listbox, Text } from "@xco-agency/corex-ui";

const products = ["Classic tee", "Canvas cap"];
const collections = ["Summer sale", "New arrivals"];

export function ListboxExample() {
  const [selected, setSelected] = useState<string>("Classic tee");

  return (
    <Card>
      <BlockStack gap="small-200">
        <Text heading>Apply the discount to</Text>
        <Listbox accessibilityLabel="Discount target" onSelect={setSelected}>
          <Listbox.Section title="Products">
            {products.map((product) => (
              <Listbox.Option
                key={product}
                value={product}
                selected={selected === product}
              >
                {product}
              </Listbox.Option>
            ))}
          </Listbox.Section>
          <Listbox.Section title="Collections" divider>
            {collections.map((collection) => (
              <Listbox.Option
                key={collection}
                value={collection}
                selected={selected === collection}
              >
                {collection}
              </Listbox.Option>
            ))}
          </Listbox.Section>
          <Listbox.Action onAction={() => alert("Create a new collection")}>
            <Text tone="info">Create a new collection</Text>
          </Listbox.Action>
        </Listbox>
        <Text color="subdued">Selected: {selected}</Text>
      </BlockStack>
    </Card>
  );
}

import { useState } from "react";
import { BlockStack, Card, Combobox, Text } from "@xco-agency/corex-ui";

const frameworks = [
  "Next.js",
  "SvelteKit",
  "Nuxt.js",
  "Remix",
  "Astro",
  "Gatsby",
  "Angular",
  "Vue",
];

type CategoryType = {
  label: string;
  value: string;
  count: number;
};

const categories: CategoryType[] = [
  { label: "Frontend Tools", value: "frontend", count: 48 },
  { label: "Backend Engines", value: "backend", count: 32 },
  { label: "Database Drivers", value: "database", count: 19 },
  { label: "DevOps & CI/CD", value: "devops", count: 12 },
];

export function ComboboxExample() {
  const [selectedFramework, setSelectedFramework] = useState<string>("Next.js");
  const [selectedTags, setSelectedTags] = useState<string[]>(["Next.js", "Remix"]);
  const [selectedCategory, setSelectedCategory] = useState<CategoryType | undefined>();

  return (
    <BlockStack gap="large-100">
      {/* 1. Single Selection */}
      <Card>
        <BlockStack gap="base">
          <BlockStack gap="small-200">
            <Text variant="headingSm" fontWeight="bold">
              Single Selection
            </Text>
            <Text color="subdued" variant="small">
              Combobox with instant search filtering, keyboard navigation, and clear
              button.
            </Text>
          </BlockStack>

          <Combobox
            items={frameworks}
            value={selectedFramework}
            onValueChange={setSelectedFramework}
          >
            <Combobox.Input placeholder="Select a framework" showClear />
            <Combobox.Content>
              <Combobox.Empty>No frameworks found.</Combobox.Empty>
              <Combobox.List>
                {(item) => (
                  <Combobox.Item key={item} value={item}>
                    {item}
                  </Combobox.Item>
                )}
              </Combobox.List>
            </Combobox.Content>
          </Combobox>
        </BlockStack>
      </Card>

      {/* 2. Multi-Selection with Tags */}
      <Card>
        <BlockStack gap="base">
          <BlockStack gap="small-200">
            <Text variant="headingSm" fontWeight="bold">
              Multi-Selection with Tags
            </Text>
            <Text color="subdued" variant="small">
              Select multiple items rendered as removable tags using Corex UI Tag. Press
              Backspace to remove.
            </Text>
          </BlockStack>

          <Combobox
            items={frameworks}
            multiple
            value={selectedTags}
            onValueChange={setSelectedTags}
          >
            <Combobox.Input placeholder="Add frameworks..." showClear />
            <Combobox.Content>
              <Combobox.Empty>No frameworks found.</Combobox.Empty>
              <Combobox.List>
                {(item) => (
                  <Combobox.Item key={item} value={item}>
                    {item}
                  </Combobox.Item>
                )}
              </Combobox.List>
            </Combobox.Content>
          </Combobox>
        </BlockStack>
      </Card>

      {/* 3. Custom Items with Objects */}
      <Card>
        <BlockStack gap="base">
          <BlockStack gap="small-200">
            <Text variant="headingSm" fontWeight="bold">
              Custom Objects
            </Text>
            <Text color="subdued" variant="small">
              Combobox with object items and itemToStringValue mapping.
            </Text>
          </BlockStack>

          <Combobox
            items={categories}
            itemToStringValue={(cat) => cat.label}
            value={selectedCategory}
            onValueChange={setSelectedCategory}
          >
            <Combobox.Input placeholder="Choose category..." showClear />
            <Combobox.Content>
              <Combobox.Empty>No categories found.</Combobox.Empty>
              <Combobox.List>
                {(cat) => (
                  <Combobox.Item key={cat.value} value={cat}>
                    {cat.label} ({cat.count})
                  </Combobox.Item>
                )}
              </Combobox.List>
            </Combobox.Content>
          </Combobox>
        </BlockStack>
      </Card>
    </BlockStack>
  );
}

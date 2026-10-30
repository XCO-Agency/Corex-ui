import { useState } from "react";
import {
  BlockStack,
  Button,
  Card,
  Combobox,
  FormLayout,
  Modal,
  Text,
  TextField,
} from "@xco-agency/corex-ui";

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

  const [modalOpen, setModalOpen] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [modalFramework, setModalFramework] = useState<string | undefined>();
  const [modalCategory, setModalCategory] = useState<CategoryType | undefined>();
  const [modalTags, setModalTags] = useState<string[]>([]);

  const closeModal = () => setModalOpen(false);

  const handleSave = () => {
    setModalOpen(false);
  };

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

      {/* 4. Form inside Modal */}
      <Card>
        <BlockStack gap="base">
          <BlockStack gap="small-200">
            <Text variant="headingSm" fontWeight="bold">
              Form inside Modal
            </Text>
            <Text color="subdued" variant="small">
              Combobox fields composed inside a Modal form with TextField and FormLayout.
            </Text>
          </BlockStack>

          <Button onClick={() => setModalOpen(true)}>Create project</Button>

          <Modal
            open={modalOpen}
            onClose={closeModal}
            title="Create project"
            primaryAction={{ content: "Save", onAction: handleSave }}
            secondaryActions={[{ content: "Cancel", onAction: closeModal }]}
          >
            <FormLayout>
              <TextField
                label="Project name"
                value={projectName}
                onChange={setProjectName}
                autoComplete="off"
              />

              <Combobox
                items={frameworks}
                value={modalFramework}
                onValueChange={setModalFramework}
              >
                <Combobox.Input label="Primary framework" placeholder="Select a framework" showClear />
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

              <Combobox
                items={categories}
                itemToStringValue={(cat) => cat.label}
                value={modalCategory}
                onValueChange={setModalCategory}
              >
                <Combobox.Input label="Category" placeholder="Choose category..." showClear />
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

              <Combobox
                items={frameworks}
                multiple
                value={modalTags}
                onValueChange={setModalTags}
              >
                <Combobox.Input label="Additional frameworks" placeholder="Add frameworks..." showClear />
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
            </FormLayout>
          </Modal>
        </BlockStack>
      </Card>
    </BlockStack>
  );
}

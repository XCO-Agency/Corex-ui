import { BlockStack, Box, Card, InlineStack, Page, Text } from "@xco/corex-ui";
import type { ComponentEntry } from "../types";

function BoxExample() {
  return <Box padding="400">A padded Box.</Box>;
}

function BlockStackExample() {
  return (
    <BlockStack gap="300">
      <Box padding="200">First</Box>
      <Box padding="200">Second</Box>
      <Box padding="200">Third</Box>
    </BlockStack>
  );
}

function InlineStackExample() {
  return (
    <InlineStack gap="200">
      <Box padding="200">First</Box>
      <Box padding="200">Second</Box>
      <Box padding="200">Third</Box>
    </InlineStack>
  );
}

function CardExample() {
  return (
    <Card title="Shipping address">
      <Text>123 Main St, Springfield</Text>
    </Card>
  );
}

function PageExample() {
  return (
    <Page title="Products" subtitle="Manage your catalog" primaryAction={{ content: "Add product" }}>
      <Text>Page content goes here.</Text>
    </Page>
  );
}

export const layoutComponents: ComponentEntry[] = [
  {
    name: "Box",
    slug: "box",
    category: "Layout",
    description: "A generic, unopinionated container for padding, background, and border styling.",
    examples: [
      {
        title: "Padded box",
        Example: BoxExample,
        code: `<Box padding="400">A padded Box.</Box>`,
      },
    ],
  },
  {
    name: "BlockStack",
    slug: "block-stack",
    category: "Layout",
    description: "Stacks its children vertically with consistent spacing.",
    examples: [
      {
        title: "Vertical stack",
        Example: BlockStackExample,
        code: `<BlockStack gap="300">
  <Box padding="200">First</Box>
  <Box padding="200">Second</Box>
  <Box padding="200">Third</Box>
</BlockStack>`,
      },
    ],
  },
  {
    name: "InlineStack",
    slug: "inline-stack",
    category: "Layout",
    description: "Stacks its children horizontally with consistent spacing.",
    examples: [
      {
        title: "Horizontal stack",
        Example: InlineStackExample,
        code: `<InlineStack gap="200">
  <Box padding="200">First</Box>
  <Box padding="200">Second</Box>
  <Box padding="200">Third</Box>
</InlineStack>`,
      },
    ],
  },
  {
    name: "Card",
    slug: "card",
    category: "Layout",
    description: "A bordered content surface, optionally with a heading, used to group related content.",
    examples: [
      {
        title: "With a title",
        Example: CardExample,
        code: `<Card title="Shipping address">
  <Text>123 Main St, Springfield</Text>
</Card>`,
      },
    ],
  },
  {
    name: "Page",
    slug: "page",
    category: "Layout",
    description: "The top-level layout wrapper for a screen, with a heading and primary/secondary actions.",
    examples: [
      {
        title: "With a primary action",
        Example: PageExample,
        code: `<Page
  title="Products"
  subtitle="Manage your catalog"
  primaryAction={{ content: "Add product" }}
>
  <Text>Page content goes here.</Text>
</Page>`,
      },
    ],
  },
];

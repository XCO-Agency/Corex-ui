import { BlockStack, Box, Card, Divider, InlineStack, Page, Text } from "@xco/corex-ui";
import type { ComponentEntry } from "../types";

function BoxExample() {
  return <Box padding="base">A padded Box.</Box>;
}

function BlockStackExample() {
  return (
    <BlockStack gap="small-100">
      <Box padding="small-200">First</Box>
      <Box padding="small-200">Second</Box>
      <Box padding="small-200">Third</Box>
    </BlockStack>
  );
}

function InlineStackExample() {
  return (
    <InlineStack gap="small-200">
      <Box padding="small-200">First</Box>
      <Box padding="small-200">Second</Box>
      <Box padding="small-200">Third</Box>
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

function DividerExample() {
  return (
    <BlockStack gap="small-200">
      <Text>Above the divider</Text>
      <Divider />
      <Text>Below the divider</Text>
    </BlockStack>
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
      },
    ],
  },
  {
    name: "Divider",
    slug: "divider",
    category: "Layout",
    description: "Creates visual separation between sections of content.",
    examples: [
      {
        title: "Between content",
        Example: DividerExample,
      },
    ],
  },
];

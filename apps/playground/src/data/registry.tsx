import { useState } from "react";
import {
  Badge,
  Banner,
  BlockStack,
  Box,
  Button,
  ButtonGroup,
  Card,
  Checkbox,
  InlineStack,
  Modal,
  Page,
  Select,
  Spinner,
  Tabs,
  Text,
  TextField,
} from "@xco/corex-ui";

export const categories = [
  "Actions",
  "Forms",
  "Layout",
  "Feedback",
  "Overlays",
  "Typography",
  "Navigation",
] as const;

export type Category = (typeof categories)[number];

export interface ComponentExample {
  title: string;
  code: string;
  Example: React.ComponentType;
}

export interface ComponentEntry {
  name: string;
  slug: string;
  category: Category;
  description: string;
  examples: ComponentExample[];
}

function ButtonVariants() {
  return (
    <InlineStack gap="200">
      <Button primary>Primary</Button>
      <Button>Secondary</Button>
      <Button destructive>Destructive</Button>
      <Button plain>Plain</Button>
      <Button disabled>Disabled</Button>
    </InlineStack>
  );
}

function ButtonGroupExample() {
  return (
    <ButtonGroup variant="segmented">
      <Button>One</Button>
      <Button>Two</Button>
      <Button>Three</Button>
    </ButtonGroup>
  );
}

function TextVariants() {
  return (
    <BlockStack gap="200">
      <Text variant="headingLg">Heading large</Text>
      <Text variant="headingMd">Heading medium</Text>
      <Text tone="success">Success tone</Text>
      <Text tone="critical">Critical tone</Text>
    </BlockStack>
  );
}

function BadgeVariants() {
  return (
    <InlineStack gap="200">
      <Badge tone="success">Active</Badge>
      <Badge tone="warning">Pending</Badge>
      <Badge tone="critical">Failed</Badge>
      <Badge tone="info">Draft</Badge>
    </InlineStack>
  );
}

function BannerDismissible() {
  const [visible, setVisible] = useState(true);
  if (!visible) {
    return <Button onClick={() => setVisible(true)}>Show banner again</Button>;
  }
  return (
    <Banner title="Heads up" tone="warning" onDismiss={() => setVisible(false)}>
      Some line items are out of stock.
    </Banner>
  );
}

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

function ModalExample() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>Delete product</Button>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Delete product"
        primaryAction={{ content: "Delete", destructive: true, onAction: () => setOpen(false) }}
        secondaryActions={[{ content: "Cancel", onAction: () => setOpen(false) }]}
      >
        <Text>This can&rsquo;t be undone.</Text>
      </Modal>
    </>
  );
}

function TextFieldExample() {
  const [name, setName] = useState("Ada Lovelace");
  return <TextField label="Name" value={name} onChange={(value) => setName(value)} />;
}

function SelectExample() {
  const [country, setCountry] = useState("ca");
  return (
    <Select
      label="Country"
      value={country}
      onChange={(value) => setCountry(value)}
      options={[
        { label: "Canada", value: "ca" },
        { label: "United States", value: "us" },
      ]}
    />
  );
}

function CheckboxExample() {
  const [accepted, setAccepted] = useState(false);
  return (
    <Checkbox label="I accept the terms" checked={accepted} onChange={(value) => setAccepted(value)} />
  );
}

function SpinnerExample() {
  return <Spinner size="large" accessibilityLabel="Loading" />;
}

function PageExample() {
  return (
    <Page
      title="Products"
      subtitle="Manage your catalog"
      primaryAction={{ content: "Add product" }}
    >
      <Text>Page content goes here.</Text>
    </Page>
  );
}

function TabsExample() {
  const [selected, setSelected] = useState(0);
  const tabs = [
    { id: "all", content: "All" },
    { id: "drafts", content: "Drafts" },
    { id: "archived", content: "Archived" },
  ];
  return (
    <Tabs tabs={tabs} selected={selected} onSelect={setSelected}>
      <Text>Panel content for &ldquo;{tabs[selected]!.content}&rdquo;.</Text>
    </Tabs>
  );
}

export const registry: ComponentEntry[] = [
  {
    name: "Button",
    slug: "button",
    category: "Actions",
    description: "Triggers an action or event, such as submitting a form or opening a dialog.",
    examples: [
      {
        title: "Variants",
        Example: ButtonVariants,
        code: `<InlineStack gap="200">
  <Button primary>Primary</Button>
  <Button>Secondary</Button>
  <Button destructive>Destructive</Button>
  <Button plain>Plain</Button>
  <Button disabled>Disabled</Button>
</InlineStack>`,
      },
    ],
  },
  {
    name: "ButtonGroup",
    slug: "button-group",
    category: "Actions",
    description: "Displays multiple buttons grouped together, optionally as a segmented control.",
    examples: [
      {
        title: "Segmented group",
        Example: ButtonGroupExample,
        code: `<ButtonGroup variant="segmented">
  <Button>One</Button>
  <Button>Two</Button>
  <Button>Three</Button>
</ButtonGroup>`,
      },
    ],
  },
  {
    name: "Text",
    slug: "text",
    category: "Typography",
    description: "Displays styled text, from body copy to headings, with tone and weight options.",
    examples: [
      {
        title: "Variants & tones",
        Example: TextVariants,
        code: `<BlockStack gap="200">
  <Text variant="headingLg">Heading large</Text>
  <Text variant="headingMd">Heading medium</Text>
  <Text tone="success">Success tone</Text>
  <Text tone="critical">Critical tone</Text>
</BlockStack>`,
      },
    ],
  },
  {
    name: "Badge",
    slug: "badge",
    category: "Feedback",
    description: "A short status descriptor for a resource, such as an order or product state.",
    examples: [
      {
        title: "Tones",
        Example: BadgeVariants,
        code: `<InlineStack gap="200">
  <Badge tone="success">Active</Badge>
  <Badge tone="warning">Pending</Badge>
  <Badge tone="critical">Failed</Badge>
  <Badge tone="info">Draft</Badge>
</InlineStack>`,
      },
    ],
  },
  {
    name: "Banner",
    slug: "banner",
    category: "Feedback",
    description: "Highlights important information or required actions prominently on the page.",
    examples: [
      {
        title: "Dismissible",
        Example: BannerDismissible,
        code: `const [visible, setVisible] = useState(true);

<Banner title="Heads up" tone="warning" onDismiss={() => setVisible(false)}>
  Some line items are out of stock.
</Banner>`,
      },
    ],
  },
  {
    name: "Spinner",
    slug: "spinner",
    category: "Feedback",
    description: "An animated loading indicator for content that is still being fetched.",
    examples: [
      {
        title: "Large spinner",
        Example: SpinnerExample,
        code: `<Spinner size="large" accessibilityLabel="Loading" />`,
      },
    ],
  },
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
  {
    name: "TextField",
    slug: "text-field",
    category: "Forms",
    description: "A single- or multi-line text input, controlled via value/onChange.",
    examples: [
      {
        title: "Controlled input",
        Example: TextFieldExample,
        code: `const [name, setName] = useState("Ada Lovelace");

<TextField label="Name" value={name} onChange={(value) => setName(value)} />`,
      },
    ],
  },
  {
    name: "Select",
    slug: "select",
    category: "Forms",
    description: "Lets the user pick one option from a menu of choices.",
    examples: [
      {
        title: "Controlled select",
        Example: SelectExample,
        code: `const [country, setCountry] = useState("ca");

<Select
  label="Country"
  value={country}
  onChange={(value) => setCountry(value)}
  options={[
    { label: "Canada", value: "ca" },
    { label: "United States", value: "us" },
  ]}
/>`,
      },
    ],
  },
  {
    name: "Checkbox",
    slug: "checkbox",
    category: "Forms",
    description: "A binary on/off form control, controlled via checked/onChange.",
    examples: [
      {
        title: "Controlled checkbox",
        Example: CheckboxExample,
        code: `const [accepted, setAccepted] = useState(false);

<Checkbox
  label="I accept the terms"
  checked={accepted}
  onChange={(value) => setAccepted(value)}
/>`,
      },
    ],
  },
  {
    name: "Modal",
    slug: "modal",
    category: "Overlays",
    description: "A focused overlay dialog for confirmations or short focused tasks.",
    examples: [
      {
        title: "Confirmation modal",
        Example: ModalExample,
        code: `const [open, setOpen] = useState(false);

<Modal
  open={open}
  onClose={() => setOpen(false)}
  title="Delete product"
  primaryAction={{ content: "Delete", destructive: true, onAction: () => setOpen(false) }}
  secondaryActions={[{ content: "Cancel", onAction: () => setOpen(false) }]}
>
  <Text>This can't be undone.</Text>
</Modal>`,
      },
    ],
  },
  {
    name: "Tabs",
    slug: "tabs",
    category: "Navigation",
    description: "Switches between different views of related content.",
    examples: [
      {
        title: "Controlled tabs",
        Example: TabsExample,
        code: `const [selected, setSelected] = useState(0);
const tabs = [
  { id: "all", content: "All" },
  { id: "drafts", content: "Drafts" },
  { id: "archived", content: "Archived" },
];

<Tabs tabs={tabs} selected={selected} onSelect={setSelected}>
  <Text>Panel content for "{tabs[selected].content}".</Text>
</Tabs>`,
      },
    ],
  },
];

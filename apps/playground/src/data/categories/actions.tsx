import { Button, ButtonGroup, InlineStack, Link, Menu } from "@xco/corex-ui";
import type { ComponentEntry } from "../types";

function ButtonVariants() {
  return (
    <InlineStack gap="small-200">
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

function LinkExample() {
  return (
    <Link url="https://shopify.dev" external>
      View developer docs
    </Link>
  );
}

function MenuExample() {
  return (
    <InlineStack gap="small-200">
      <Button commandFor="actions-menu" icon="menu">
        More actions
      </Button>
      <Menu id="actions-menu">
        <Button icon="duplicate">Duplicate</Button>
        <Button icon="archive">Archive</Button>
        <Button icon="delete" destructive>
          Delete
        </Button>
      </Menu>
    </InlineStack>
  );
}

export const actionsComponents: ComponentEntry[] = [
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
    name: "Link",
    slug: "link",
    category: "Actions",
    description: "Makes text interactive for navigation.",
    examples: [
      {
        title: "External link",
        Example: LinkExample,
        code: `<Link url="https://shopify.dev" external>
  View developer docs
</Link>`,
      },
    ],
  },
  {
    name: "Menu",
    slug: "menu",
    category: "Actions",
    description: "A dropdown list of actions, triggered by a Button using commandFor.",
    examples: [
      {
        title: "Actions menu",
        Example: MenuExample,
        code: `<Button commandFor="actions-menu" icon="menu">
  More actions
</Button>
<Menu id="actions-menu">
  <Button icon="duplicate">Duplicate</Button>
  <Button icon="archive">Archive</Button>
  <Button icon="delete" destructive>Delete</Button>
</Menu>`,
      },
    ],
  },
];

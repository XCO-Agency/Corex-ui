import { Button, ButtonGroup, InlineStack } from "@xco/corex-ui";
import type { ComponentEntry } from "../types";

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
];

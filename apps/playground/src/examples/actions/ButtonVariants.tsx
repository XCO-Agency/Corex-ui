import { Button, InlineStack } from "@xco/corex-ui";

export function ButtonVariants() {
  return (
    <InlineStack gap="base">
      <Button variant="primary">Primary</Button>
      <Button>Secondary</Button>
      <Button tone="critical">Destructive</Button>
      <Button variant="tertiary">Plain</Button>
      <Button disabled>Disabled</Button>
    </InlineStack>
  );
}

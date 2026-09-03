import { Button, InlineStack } from "@xco/corex-ui";

export function ButtonVariants() {
  return (
    <InlineStack gap="none">
      <Button variant="primary">Primary</Button>
      <Button>Secondary</Button>
      <Button destructive>Destructive</Button>
      <Button plain>Plain</Button>
      <Button disabled>Disabled</Button>
    </InlineStack>
  );
}

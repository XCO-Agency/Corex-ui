import { Button, InlineStack } from "@xco-agency/corex-ui";

export function ButtonVariants() {
  return (
    <InlineStack gap="base">
      <Button variant="primary">Primary</Button>
      <Button>Secondary</Button>
      <Button tone="critical" variant="primary">
        Destructive
      </Button>
      <Button variant="tertiary">Tertiary</Button>
    </InlineStack>
  );
}

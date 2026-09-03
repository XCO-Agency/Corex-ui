import { Icon, InlineStack } from "@xco/corex-ui";

export function IconExample() {
  return (
    <InlineStack gap="small-200">
      <Icon source="save" accessibilityLabel="Save" />
      <Icon source="delete" tone="critical" accessibilityLabel="Delete" />
    </InlineStack>
  );
}

import { Icon, InlineStack } from "@xco-agency/corex-ui";

export function IconExample() {
  return (
    <InlineStack gap="small-200">
      <Icon type="save" accessibilityLabel="Save" />
      <Icon type="delete" tone="critical" accessibilityLabel="Delete" />
    </InlineStack>
  );
}

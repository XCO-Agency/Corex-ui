import { BlockStack, Divider, Text } from "@xco/corex-ui";

export function DividerExample() {
  return (
    <BlockStack gap="small-200">
      <Text>Above the divider</Text>
      <Divider />
      <Text>Below the divider</Text>
    </BlockStack>
  );
}

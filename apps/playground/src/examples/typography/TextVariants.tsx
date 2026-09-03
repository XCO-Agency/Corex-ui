import { BlockStack, Text } from "@xco/corex-ui";

export function TextVariants() {
  return (
    <BlockStack gap="small-200">
      <Text variant="headingLg">Heading large</Text>
      <Text variant="headingMd">Heading medium</Text>
      <Text tone="success">Success tone</Text>
      <Text tone="critical">Critical tone</Text>
    </BlockStack>
  );
}

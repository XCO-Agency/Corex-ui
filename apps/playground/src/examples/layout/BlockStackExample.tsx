import { BlockStack, Box } from "@xco/corex-ui";

export function BlockStackExample() {
  return (
    <BlockStack gap="small-100">
      <Box padding="small-200">First</Box>
      <Box padding="small-200">Second</Box>
      <Box padding="small-200">Third</Box>
    </BlockStack>
  );
}

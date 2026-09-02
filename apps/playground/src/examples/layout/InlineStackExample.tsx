import { Box, InlineStack } from "@xco/corex-ui";

export function InlineStackExample() {
  return (
    <InlineStack gap="small-200">
      <Box padding="small-200">First</Box>
      <Box padding="small-200">Second</Box>
      <Box padding="small-200">Third</Box>
    </InlineStack>
  );
}

import { Box, InlineStack } from "@xco-agency/corex-ui";

export function InlineStackExample() {
  return (
    <InlineStack gap="small">
      <Box background="strong" border="base" padding="base" inlineSize="200px">
        First
      </Box>
      <Box background="strong" border="base" padding="base" inlineSize="200px">
        Second
      </Box>
      <Box background="strong" border="base" padding="base" inlineSize="200px">
        Third
      </Box>
    </InlineStack>
  );
}

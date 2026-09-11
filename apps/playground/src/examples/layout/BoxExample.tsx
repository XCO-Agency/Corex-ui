import { BlockStack, Box } from "@xco-agency/corex-ui";

export function BoxExample() {
  return (
    <BlockStack style={{ width: "300px" }} gap="base">
      <Box padding="base" border="base">
        A padded Box.
      </Box>
      <Box padding="base" border="base" borderRadius="large" background="base">
        A Card Box.
      </Box>
    </BlockStack>
  );
}

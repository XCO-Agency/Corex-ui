import { Grid } from "@xco-agency/corex-ui";
import { BlockStack, Divider, Text } from "@xco-agency/corex-ui";

export function TextVariants() {
  return (
    <Grid columns={2}>
      <BlockStack gap="small-300">
        <Text variant="small">Text small</Text>
        <Text variant="base">Text base</Text>
        <Text variant="large">Text large</Text>
        <Divider />
        <Text heading variant="small">
          Heading small
        </Text>
        <Text heading variant="base">
          Heading base
        </Text>
        <Text heading variant="large">
          Heading large
        </Text>
      </BlockStack>
      <BlockStack gap="small-300">
        <Text tooltip="Tooltip content">This is a tooltip on normal text</Text>
        <Text tone="success">Success tone</Text>
        <Text tone="critical">Critical tone</Text>
        <Text tone="warning">Warning tone</Text>
        <Text tone="info">Info tone</Text>
        <Text tone="neutral">Neutral tone</Text>
        <Text color="subdued">text color subdued</Text>
        <Text type="redundant">Text type redundant</Text>
      </BlockStack>
    </Grid>
  );
}

import { BlockStack, Card, InlineCode, Text } from "@xco-agency/corex-ui";

export function InlineCodeExample() {
  return (
    <Card>
      <BlockStack gap="small-200">
        <Text>
          Install with <InlineCode>pnpm add @xco-agency/corex-ui</InlineCode>, then run{" "}
          <InlineCode>pnpm dev</InlineCode>.
        </Text>
        <Text color="subdued">
          The webhook posts to <InlineCode>/webhooks/orders/create</InlineCode>.
        </Text>
      </BlockStack>
    </Card>
  );
}

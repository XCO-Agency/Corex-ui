import { BlockStack, Card, InlineGrid, List, Text } from "@xco-agency/corex-ui";

export function ListExample() {
  return (
    <InlineGrid columns={2} gap="base">
      <Card>
        <BlockStack gap="small-200">
          <Text heading>Bulleted</Text>
          <List>
            <List.Item>Products sync every 15 minutes</List.Item>
            <List.Item>Inventory syncs on change</List.Item>
            <List.Item>Prices sync nightly</List.Item>
          </List>
        </BlockStack>
      </Card>
      <Card>
        <BlockStack gap="small-200">
          <Text heading>Numbered</Text>
          <List type="number">
            <List.Item>Connect your store</List.Item>
            <List.Item>Import products</List.Item>
            <List.Item>Publish the sales channel</List.Item>
          </List>
        </BlockStack>
      </Card>
    </InlineGrid>
  );
}

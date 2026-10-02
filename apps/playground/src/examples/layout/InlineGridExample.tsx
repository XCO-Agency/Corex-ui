import { BlockStack, Card, InlineGrid, Text } from "@xco-agency/corex-ui";

export function InlineGridExample() {
  return (
    <BlockStack gap="base">
      <Text heading>Three equal columns</Text>
      <InlineGrid columns={3} gap="base">
        <Card>
          <Text>Orders</Text>
        </Card>
        <Card>
          <Text>Sessions</Text>
        </Card>
        <Card>
          <Text>Conversion</Text>
        </Card>
      </InlineGrid>

      <Text heading>v12 fraction names</Text>
      <InlineGrid columns={["oneThird", "twoThirds"]} gap="base">
        <Card>
          <Text color="subdued">oneThird</Text>
        </Card>
        <Card>
          <Text color="subdued">twoThirds</Text>
        </Card>
      </InlineGrid>

      <Text heading>Per breakpoint</Text>
      <InlineGrid columns={{ xs: 1, md: 2, lg: 4 }} gap="small-200">
        <Card>
          <Text>1</Text>
        </Card>
        <Card>
          <Text>2</Text>
        </Card>
        <Card>
          <Text>3</Text>
        </Card>
        <Card>
          <Text>4</Text>
        </Card>
      </InlineGrid>
    </BlockStack>
  );
}

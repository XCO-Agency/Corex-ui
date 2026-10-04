import { Card, Grid, Text, BlockStack } from "@xco-agency/corex-ui";

export function GridExample() {
  return (
    <Grid columns={{ xs: 1, sm: 2, md: 3 }} gap="base">
      <Grid.Item>
        <Card>
          <BlockStack gap="small-200">
            <Text heading>Column 1</Text>
            <Text color="subdued">First grid cell in a responsive track.</Text>
          </BlockStack>
        </Card>
      </Grid.Item>
      <Grid.Item>
        <Card>
          <BlockStack gap="small-200">
            <Text heading>Column 2</Text>
            <Text color="subdued">Second grid cell in a responsive track.</Text>
          </BlockStack>
        </Card>
      </Grid.Item>
      <Grid.Item>
        <Card>
          <BlockStack gap="small-200">
            <Text heading>Column 3</Text>
            <Text color="subdued">Third grid cell in a responsive track.</Text>
          </BlockStack>
        </Card>
      </Grid.Item>
    </Grid>
  );
}

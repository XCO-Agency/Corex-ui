import { BlockStack, Card, QueryContainer, Text } from "@xco-agency/corex-ui";

export function QueryContainerExample() {
  return (
    <Card>
      <BlockStack gap="base">
        <Text heading>Container Query Context</Text>
        <Text color="subdued">
          Wraps children in a CSS container context so elements can adapt based on the
          component inline size rather than the whole screen.
        </Text>
        <QueryContainer containerName="sidebar-card">
          <Card>
            <Text>Adaptive container contents.</Text>
          </Card>
        </QueryContainer>
      </BlockStack>
    </Card>
  );
}

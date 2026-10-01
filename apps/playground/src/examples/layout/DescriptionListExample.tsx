import { BlockStack, Badge, Card, DescriptionList, Text } from "@xco-agency/corex-ui";

export function DescriptionListExample() {
  return (
    <Card>
      <BlockStack gap="small-100">
        <Text heading>Order #1042</Text>
        <DescriptionList
          items={[
            { term: "Status", description: <Badge tone="success">Fulfilled</Badge> },
            { term: "Carrier", description: "DHL Express" },
            { term: "Tracking", description: "JD014600003489234" },
            { term: "Delivered", description: "Mar 14, 2026" },
          ]}
        />
      </BlockStack>
    </Card>
  );
}

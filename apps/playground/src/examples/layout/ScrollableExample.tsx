import { BlockStack, Card, Divider, Scrollable, Text } from "@xco-agency/corex-ui";

const events = Array.from({ length: 24 }, (_, index) => ({
  id: index,
  label: `Order #10${index.toString().padStart(2, "0")} was fulfilled`,
}));

export function ScrollableExample() {
  return (
    <Card>
      <BlockStack gap="small-200">
        <Text heading>Activity</Text>
        <Scrollable maxBlockSize="224px" focusable>
          <BlockStack gap="small-200">
            {events.map((event) => (
              <BlockStack key={event.id} gap="small-200">
                <Text color="subdued">{event.label}</Text>
                <Divider />
              </BlockStack>
            ))}
          </BlockStack>
        </Scrollable>
      </BlockStack>
    </Card>
  );
}

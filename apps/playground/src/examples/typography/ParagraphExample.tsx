import { BlockStack, Card, Paragraph, Text } from "@xco-agency/corex-ui";

export function ParagraphExample() {
  return (
    <Card>
      <BlockStack gap="base">
        <Text heading>Order Fulfillment Terms</Text>
        <Paragraph>
          Orders placed before 2:00 PM EST are processed the same business day. Standard
          shipping transit times range from two to five business days depending on
          destination location and inventory availability.
        </Paragraph>
        <Paragraph>
          Custom items and bulk wholesale orders may require additional processing time.
          Tracking notifications will be transmitted immediately upon label generation.
        </Paragraph>
      </BlockStack>
    </Card>
  );
}

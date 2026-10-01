import { Card, InlineGrid, Text, TextContainer } from "@xco-agency/corex-ui";

export function TextContainerExample() {
  return (
    <InlineGrid columns={2} gap="base">
      <Card>
        <TextContainer>
          <Text heading>Loose</Text>
          <Text>Shipping rates are calculated at checkout.</Text>
          <Text>Taxes are added for the destination country.</Text>
        </TextContainer>
      </Card>
      <Card>
        <TextContainer spacing="tight">
          <Text heading>Tight</Text>
          <Text>Shipping rates are calculated at checkout.</Text>
          <Text>Taxes are added for the destination country.</Text>
        </TextContainer>
      </Card>
    </InlineGrid>
  );
}

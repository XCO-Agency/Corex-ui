import { Box, Button, Card, Popover, Text } from "@xco-agency/corex-ui";

export function CardExample() {
  return (
    <Box minInlineSize="600px">
      <Card
        heading="Shipping address"
        tooltip="Shipping address tooltip"
        icon="adjust"
        description="this is description"
        actions={
          <>
            <Popover>
              <Popover.Trigger>
                <Button variant="tertiary" icon="menu-horizontal"></Button>
              </Popover.Trigger>
              <Popover.Content minBlockSize="100px" minInlineSize="100px">
                <Box padding="small"></Box>
              </Popover.Content>
            </Popover>
          </>
        }
        primaryFooterAction={{
          content: "dsasda",
        }}
        secondaryFooterActions={[
          {
            content: "footer",
          },
        ]}
      >
        <Text>123 Main St, Springfield</Text>
        <Text>123 Main St, Springfield</Text>
        <Text>123 Main St, Springfield</Text>
      </Card>
    </Box>
  );
}

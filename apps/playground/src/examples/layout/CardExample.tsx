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
              <Popover.Content minBlockSize="100px" maxInlineSize="100px">
                <Box padding="small">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
                </Box>
              </Popover.Content>
            </Popover>
          </>
        }
        primaryFooterAction={{
          content: "Primary action",
        }}
        secondaryFooterActions={[
          {
            content: "Secondary action",
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

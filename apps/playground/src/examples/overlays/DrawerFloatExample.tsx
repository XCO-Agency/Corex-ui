import { BlockStack, Button, Drawer, Text } from "@xco-agency/corex-ui";

/**
 * `variant="float"` (default): each nested drawer opens on top of its parent,
 * which scales back behind it like a stack of cards. Same on mobile, where
 * the drawers are bottom sheets.
 */
export function DrawerFloatExample() {
  return (
    <BlockStack gap="small-200">
      <Text as="p" variant="small" color="subdued">
        Nested drawers stack on top of each other. The parent stays mounted and steps back
        one level for every drawer open above it.
      </Text>
      <Drawer>
        <Drawer.Trigger>
          <Button variant="primary">Open order</Button>
        </Drawer.Trigger>
        <Drawer.Content>
          <Drawer.Header>
            <Drawer.Title>Order #1042</Drawer.Title>
            <Drawer.Description>Open a nested drawer on top of this one.</Drawer.Description>
          </Drawer.Header>
          <Drawer.Body>
            <Drawer variant="float">
              <Drawer.Trigger>
                <Button>Edit shipping address</Button>
              </Drawer.Trigger>
              <Drawer.Content>
                <Drawer.Header>
                  <Drawer.Title>Shipping address</Drawer.Title>
                  <Drawer.Description>Floats over the order.</Drawer.Description>
                </Drawer.Header>
                <Drawer.Body>
                  <Drawer variant="float">
                    <Drawer.Trigger>
                      <Button>Validate address</Button>
                    </Drawer.Trigger>
                    <Drawer.Content>
                      <Drawer.Header>
                        <Drawer.Title>Validation</Drawer.Title>
                        <Drawer.Description>A third level: both parents step back.</Drawer.Description>
                      </Drawer.Header>
                      <Drawer.Footer>
                        <Drawer.Close>
                          <Button>Done</Button>
                        </Drawer.Close>
                      </Drawer.Footer>
                    </Drawer.Content>
                  </Drawer>
                </Drawer.Body>
                <Drawer.Footer>
                  <Drawer.Close>
                    <Button>Close</Button>
                  </Drawer.Close>
                </Drawer.Footer>
              </Drawer.Content>
            </Drawer>
          </Drawer.Body>
          <Drawer.Footer>
            <Drawer.Close>
              <Button>Close</Button>
            </Drawer.Close>
          </Drawer.Footer>
        </Drawer.Content>
      </Drawer>
    </BlockStack>
  );
}

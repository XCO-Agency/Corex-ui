import { BlockStack, Button, Drawer, Text } from "@xco-agency/corex-ui";

/**
 * Combining variants: `[parent · aside + bottom]`. The parent keeps its full
 * height; the aside and the bottom drawer opened inside it share one column,
 * split in two rows. Mobile keeps the float stack.
 */
export function DrawerAsideBottomExample() {
  return (
    <BlockStack gap="small-200">
      <Text as="p" variant="small" color="subdued">
        Open the aside, then the bottom drawer inside it — only the aside&apos;s column is
        split.
      </Text>
      <Drawer>
        <Drawer.Trigger>
          <Button variant="primary">Open orders</Button>
        </Drawer.Trigger>
        <Drawer.Content>
          <Drawer.Header>
            <Drawer.Title>Orders</Drawer.Title>
            <Drawer.Description>
              Full height, next to the aside column.
            </Drawer.Description>
          </Drawer.Header>
          <Drawer.Body>
            <Drawer variant="aside">
              <Drawer.Trigger>
                <Button>View order #1042</Button>
              </Drawer.Trigger>
              <Drawer.Content width="small">
                <Drawer.Header>
                  <Drawer.Title>Order #1042</Drawer.Title>
                  <Drawer.Description>Top row of the column.</Drawer.Description>
                </Drawer.Header>
                <Drawer.Body>
                  <Drawer
                    variant="float"
                    swipeDirection="down"
                    responsive={false}
                    showSwipeHandle
                  >
                    <Drawer.Trigger>
                      <Button>Track shipment</Button>
                    </Drawer.Trigger>
                    <Drawer.Content>
                      <Drawer.Header>
                        <Drawer.Title>Tracking</Drawer.Title>
                        <Drawer.Description>
                          Bottom row: 40% of the viewport.
                        </Drawer.Description>
                      </Drawer.Header>
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

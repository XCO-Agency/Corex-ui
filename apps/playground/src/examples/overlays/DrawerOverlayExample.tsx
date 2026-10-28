import { BlockStack, Button, Drawer, InlineStack, Text } from "@xco-agency/corex-ui";

/**
 * `variant="overlay"` (nested drawers only): a card over the bottom or top of
 * its parent — a confirmation, a toast. It doesn't push, scale or dim the
 * parent, and works on mobile sheets too. `position="top" | "bottom"`
 * (default `bottom`).
 */
export function DrawerOverlayExample() {
  return (
    <BlockStack gap="small-200">
      <Text as="p" variant="small" color="subdued">
        Opens over the parent drawer without changing it. Swipe it away (down for bottom,
        up for top) or use its buttons.
      </Text>
      <Drawer>
        <Drawer.Trigger>
          <Button variant="primary">Open product</Button>
        </Drawer.Trigger>
        <Drawer.Content>
          <Drawer.Header>
            <Drawer.Title>Product</Drawer.Title>
            <Drawer.Description>Open an overlay at the bottom or top.</Drawer.Description>
          </Drawer.Header>
          <Drawer.Body>
            <InlineStack gap="small-200">
              <Drawer variant="overlay">
                <Drawer.Trigger>
                  <Button tone="critical">Delete product</Button>
                </Drawer.Trigger>
                <Drawer.Content>
                  <Drawer.Header>
                    <Drawer.Title>Delete this product?</Drawer.Title>
                    <Drawer.Description>This can&apos;t be undone.</Drawer.Description>
                  </Drawer.Header>
                  <Drawer.Footer>
                    <Drawer.Close>
                      <Button>Cancel</Button>
                    </Drawer.Close>
                    <Drawer.Close>
                      <Button variant="primary" tone="critical">
                        Delete
                      </Button>
                    </Drawer.Close>
                  </Drawer.Footer>
                </Drawer.Content>
              </Drawer>

              <Drawer variant="overlay" position="top">
                <Drawer.Trigger>
                  <Button>Show toast (top)</Button>
                </Drawer.Trigger>
                <Drawer.Content>
                  <Drawer.Header>
                    <Drawer.Title>Product saved</Drawer.Title>
                    <Drawer.Description>Your changes are live.</Drawer.Description>
                  </Drawer.Header>
                  <Drawer.Footer>
                    <Drawer.Close>
                      <Button>Dismiss</Button>
                    </Drawer.Close>
                  </Drawer.Footer>
                </Drawer.Content>
              </Drawer>
            </InlineStack>
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

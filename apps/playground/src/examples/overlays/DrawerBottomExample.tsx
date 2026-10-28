import { BlockStack, Button, Drawer, InlineStack, Text } from "@xco-agency/corex-ui";

/**
 * `variant="bottom"`: the nested drawer shares its parent's column and pushes
 * the parent up from the bottom. Its height follows its content, or
 * `snapPoints` (viewport fractions, px or CSS lengths) — drag it to resize
 * between them. Mobile keeps the float stack.
 */
export function DrawerBottomExample() {
  return (
    <BlockStack gap="small-200">
      <Text as="p" variant="small" color="subdued">
        Desktop only — below the `md` breakpoint the drawers stack like `float`.
      </Text>
      <InlineStack gap="small-200">
        <Drawer>
          <Drawer.Trigger>
            <Button variant="primary">Content height</Button>
          </Drawer.Trigger>
          <Drawer.Content>
            <Drawer.Header>
              <Drawer.Title>Product</Drawer.Title>
              <Drawer.Description>The bottom drawer pushes this panel up.</Drawer.Description>
            </Drawer.Header>
            <Drawer.Body>
              <Drawer variant="bottom">
                <Drawer.Trigger>
                  <Button>Add a note</Button>
                </Drawer.Trigger>
                <Drawer.Content>
                  <Drawer.Header>
                    <Drawer.Title>Note</Drawer.Title>
                    <Drawer.Description>As tall as its content.</Drawer.Description>
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

        <Drawer>
          <Drawer.Trigger>
            <Button>Snap points (30% / 60%)</Button>
          </Drawer.Trigger>
          <Drawer.Content>
            <Drawer.Header>
              <Drawer.Title>Product</Drawer.Title>
              <Drawer.Description>Drag the bottom drawer to resize the split.</Drawer.Description>
            </Drawer.Header>
            <Drawer.Body>
              <Drawer variant="bottom" snapPoints={[0.3, 0.6]} defaultSnapPoint={0.3}>
                <Drawer.Trigger>
                  <Button>Show inventory</Button>
                </Drawer.Trigger>
                <Drawer.Content>
                  <Drawer.Header>
                    <Drawer.Title>Inventory</Drawer.Title>
                    <Drawer.Description>
                      Drag up for 60%, down for 30%, further down to close.
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
      </InlineStack>
    </BlockStack>
  );
}

import {
  BlockStack,
  Button,
  Drawer,
  InlineStack,
  Text,
  TextField,
} from "@xco-agency/corex-ui";

/**
 * `variant="aside"`: the nested drawer opens beside its parent instead of on
 * top. By default it takes the screen edge and the parent slides inward:
 * `[parent · aside]` on the right, `[aside · parent]` on the left. `position`
 * set to the other side opens it on the parent's inner edge instead, and the
 * parent stays put. The parent stays usable. Mobile keeps the float stack.
 */
export function DrawerAsideExample() {
  return (
    <BlockStack gap="small-200">
      <Text as="p" variant="small" color="subdued">
        Desktop only — below the `md` breakpoint the drawers stack like `float`.
      </Text>
      <InlineStack gap="small-200">
        <Drawer>
          <Drawer.Trigger>
            <Button variant="primary">Right: [parent · aside]</Button>
          </Drawer.Trigger>
          <Drawer.Content>
            <Drawer.Header>
              <Drawer.Title>Customers</Drawer.Title>
              <Drawer.Description>Stays usable while the aside is open.</Drawer.Description>
            </Drawer.Header>
            <Drawer.Body>
              <BlockStack gap="base">
                <TextField label="Search customers" autoComplete="off" />
                <Drawer variant="aside">
                  <Drawer.Trigger>
                    <Button>View customer</Button>
                  </Drawer.Trigger>
                  <Drawer.Content width="small">
                    <Drawer.Header>
                      <Drawer.Title>Jane Cooper</Drawer.Title>
                      <Drawer.Description>Opened beside the list.</Drawer.Description>
                    </Drawer.Header>
                    <Drawer.Body>
                      {/* Asides chain: every ancestor slides over to make room. */}
                      <Drawer variant="aside">
                        <Drawer.Trigger>
                          <Button>View last order</Button>
                        </Drawer.Trigger>
                        <Drawer.Content width="small">
                          <Drawer.Header>
                            <Drawer.Title>Order #1042</Drawer.Title>
                            <Drawer.Description>A second aside.</Drawer.Description>
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
              </BlockStack>
            </Drawer.Body>
            <Drawer.Footer>
              <Drawer.Close>
                <Button>Close</Button>
              </Drawer.Close>
            </Drawer.Footer>
          </Drawer.Content>
        </Drawer>

        {/* `position` opposite to the parent's side: the aside opens on its inner edge. */}
        <Drawer>
          <Drawer.Trigger>
            <Button>Right, position=&quot;left&quot;: [aside · parent]</Button>
          </Drawer.Trigger>
          <Drawer.Content>
            <Drawer.Header>
              <Drawer.Title>Customers</Drawer.Title>
              <Drawer.Description>Stays at the screen edge.</Drawer.Description>
            </Drawer.Header>
            <Drawer.Body>
              <Drawer variant="aside" position="left">
                <Drawer.Trigger>
                  <Button>View customer</Button>
                </Drawer.Trigger>
                <Drawer.Content width="small">
                  <Drawer.Header>
                    <Drawer.Title>Jane Cooper</Drawer.Title>
                    <Drawer.Description>Opened on the parent&apos;s left.</Drawer.Description>
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

        {/* By default the aside opens on its parent's side. */}
        <Drawer swipeDirection="left">
          <Drawer.Trigger>
            <Button>Left: [aside · parent]</Button>
          </Drawer.Trigger>
          <Drawer.Content>
            <Drawer.Header>
              <Drawer.Title>Navigation</Drawer.Title>
              <Drawer.Description>A left drawer.</Drawer.Description>
            </Drawer.Header>
            <Drawer.Body>
              <Drawer variant="aside">
                <Drawer.Trigger>
                  <Button>Open filters</Button>
                </Drawer.Trigger>
                <Drawer.Content width="small">
                  <Drawer.Header>
                    <Drawer.Title>Filters</Drawer.Title>
                    <Drawer.Description>Takes the left edge.</Drawer.Description>
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

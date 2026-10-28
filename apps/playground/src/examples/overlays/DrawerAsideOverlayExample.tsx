import { BlockStack, Button, Drawer, InlineStack, Text } from "@xco-agency/corex-ui";

/**
 * Chaining `drawer → aside → overlay → …`. The overlay covers the top or
 * bottom of the aside's column (its width, offsets and corners) without
 * touching the aside or the first drawer. An aside opened from the overlay
 * slides the whole column over, like any other aside.
 */
export function DrawerAsideOverlayExample() {
  return (
    <BlockStack gap="small-200">
      <Text as="p" variant="small" color="subdued">
        Open the customer aside, then a confirmation or a toast over it. From the
        confirmation you can open one more aside.
      </Text>
      <Drawer>
        <Drawer.Trigger>
          <Button variant="primary">Open customers</Button>
        </Drawer.Trigger>
        <Drawer.Content>
          <Drawer.Header>
            <Drawer.Title>Customers</Drawer.Title>
            <Drawer.Description>The first drawer.</Drawer.Description>
          </Drawer.Header>
          <Drawer.Body>
            <Drawer variant="aside">
              <Drawer.Trigger>
                <Button>View Jane Cooper</Button>
              </Drawer.Trigger>
              <Drawer.Content width="small">
                <Drawer.Header>
                  <Drawer.Title>Jane Cooper</Drawer.Title>
                  <Drawer.Description>An aside beside the list.</Drawer.Description>
                </Drawer.Header>
                <Drawer.Body>
                  <InlineStack gap="small-200">
                    <Drawer variant="overlay">
                      <Drawer.Trigger>
                        <Button tone="critical">Remove customer</Button>
                      </Drawer.Trigger>
                      <Drawer.Content>
                        <Drawer.Header>
                          <Drawer.Title>Remove Jane Cooper?</Drawer.Title>
                          <Drawer.Description>
                            Covers the bottom of the aside only.
                          </Drawer.Description>
                        </Drawer.Header>
                        <Drawer.Body>
                          {/* An aside from the overlay: the aside + overlay column slides over. */}
                          <Drawer variant="aside">
                            <Drawer.Trigger>
                              <Button>Review open orders first</Button>
                            </Drawer.Trigger>
                            <Drawer.Content width="small">
                              <Drawer.Header>
                                <Drawer.Title>Open orders</Drawer.Title>
                                <Drawer.Description>2 orders still unfulfilled.</Drawer.Description>
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
                            <Button>Cancel</Button>
                          </Drawer.Close>
                          <Drawer.Close>
                            <Button variant="primary" tone="critical">
                              Remove
                            </Button>
                          </Drawer.Close>
                        </Drawer.Footer>
                      </Drawer.Content>
                    </Drawer>

                    <Drawer variant="overlay" position="top">
                      <Drawer.Trigger>
                        <Button>Copy email</Button>
                      </Drawer.Trigger>
                      <Drawer.Content>
                        <Drawer.Header>
                          <Drawer.Title>Email copied</Drawer.Title>
                          <Drawer.Description>jane@example.com</Drawer.Description>
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

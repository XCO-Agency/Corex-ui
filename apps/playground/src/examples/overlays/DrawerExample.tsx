import {
  BlockStack,
  Button,
  Drawer,
  InlineStack,
  Text,
  TextField,
} from "@xco-agency/corex-ui";

const WIDTHS = ["small", "base", "large", "large-300", "large-500", "full", "420px"] as const;

function NestedSecond() {
  return (
    <Drawer>
      <Drawer.Trigger>
        <Button>Open nested drawer</Button>
      </Drawer.Trigger>
      <Drawer.Content>
        <Drawer.Header>
          <Drawer.Title>Nested</Drawer.Title>
          <Drawer.Description>
            Parent stays mounted and scales behind this panel.
          </Drawer.Description>
        </Drawer.Header>
        <Drawer.Body>
          <Text as="p" color="subdued">
            On mobile this is a sheet; on desktop a right drawer. Swipe anywhere on the
            panel to dismiss.
          </Text>
        </Drawer.Body>
        <Drawer.Footer>
          <Drawer.Close>
            <Button>Close</Button>
          </Drawer.Close>
        </Drawer.Footer>
      </Drawer.Content>
    </Drawer>
  );
}

export function DrawerExample() {
  return (
    <BlockStack gap="large-200">
      <BlockStack gap="small-200">
        <Text variant="headingMd" as="h3">
          Default (right drawer → mobile sheet)
        </Text>
        <Text as="p" variant="small" color="subdued">
          Desktop opens a right drawer with no handle. Mobile remaps to a bottom sheet.
          Swipe the panel to dismiss.
        </Text>
        <Drawer>
          <Drawer.Trigger>
            <Button variant="primary">Open drawer</Button>
          </Drawer.Trigger>
          <Drawer.Content>
            <Drawer.Header>
              <Drawer.Title>Order details</Drawer.Title>
              <Drawer.Description>
                Desktop slides from the right. Mobile becomes a bottom sheet.
              </Drawer.Description>
            </Drawer.Header>
            <Drawer.Body>
              <BlockStack gap="base">
                <TextField label="Note" autoComplete="off" />
                <Text as="p">
                  Swipe from anywhere on this surface to close the handle is omitted on
                  desktop and takes no space.
                </Text>
              </BlockStack>
            </Drawer.Body>
            <Drawer.Footer>
              <Drawer.Close>
                <Button>Cancel</Button>
              </Drawer.Close>
              <Button variant="primary">Save</Button>
            </Drawer.Footer>
          </Drawer.Content>
        </Drawer>
      </BlockStack>

      <BlockStack gap="small-200">
        <Text variant="headingMd" as="h3">
          Mobile sheet with handle (optional)
        </Text>
        <Text as="p" variant="small" color="subdued">
          `showSwipeHandle` only renders on the mobile sheet — never on the desktop side
          drawer.
        </Text>
        <Drawer showSwipeHandle>
          <Drawer.Trigger>
            <Button>Open with handle (mobile only)</Button>
          </Drawer.Trigger>
          <Drawer.Content>
            <Drawer.Header>
              <Drawer.Title>Sheet handle</Drawer.Title>
              <Drawer.Description>
                Resize below `md` to see the grabber. Desktop stays a clean right drawer.
              </Drawer.Description>
            </Drawer.Header>
            <Drawer.Body>
              <Text as="p">You can still swipe from anywhere on the panel.</Text>
            </Drawer.Body>
            <Drawer.Footer>
              <Drawer.Close>
                <Button>Close</Button>
              </Drawer.Close>
            </Drawer.Footer>
          </Drawer.Content>
        </Drawer>
      </BlockStack>

      <BlockStack gap="small-200">
        <Text variant="headingMd" as="h3">
          Nested stack
        </Text>
        <Drawer>
          <Drawer.Trigger>
            <Button>Open parent</Button>
          </Drawer.Trigger>
          <Drawer.Content>
            <Drawer.Header>
              <Drawer.Title>Parent</Drawer.Title>
              <Drawer.Description>
                Open another drawer from the same direction.
              </Drawer.Description>
            </Drawer.Header>
            <Drawer.Body>
              <NestedSecond />
            </Drawer.Body>
            <Drawer.Footer>
              <Drawer.Close>
                <Button>Close</Button>
              </Drawer.Close>
            </Drawer.Footer>
          </Drawer.Content>
        </Drawer>
      </BlockStack>

      <BlockStack gap="small-200">
        <Text variant="headingMd" as="h3">
          Widths
        </Text>
        <Text as="p" variant="small" color="subdued">
          Presets `small`, `base`, `large`, `large-100`…`large-500`, `full`, or any CSS length.
          Widths are capped to the viewport.
        </Text>
        <InlineStack gap="small-200">
          {WIDTHS.map((width) => (
            <Drawer key={width} responsive={false}>
              <Drawer.Trigger>
                <Button>{width}</Button>
              </Drawer.Trigger>
              <Drawer.Content width={width}>
                <Drawer.Header>
                  <Drawer.Title>width=&quot;{width}&quot;</Drawer.Title>
                </Drawer.Header>
                <Drawer.Body>
                  <Text as="p">Footer actions sit in a row at the end.</Text>
                </Drawer.Body>
                <Drawer.Footer>
                  <Drawer.Close>
                    <Button>Cancel</Button>
                  </Drawer.Close>
                  <Button variant="primary">Save</Button>
                </Drawer.Footer>
              </Drawer.Content>
            </Drawer>
          ))}
        </InlineStack>
      </BlockStack>

      <BlockStack gap="small-200">
        <Text variant="headingMd" as="h3">
          Forced sides (`responsive={false}`)
        </Text>
        <InlineStack gap="small-200">
          <Drawer swipeDirection="left" responsive={false}>
            <Drawer.Trigger>
              <Button>Left (locked)</Button>
            </Drawer.Trigger>
            <Drawer.Content width="20rem">
              <Drawer.Header>
                <Drawer.Title>Left drawer</Drawer.Title>
              </Drawer.Header>
              <Drawer.Body>
                <Text as="p">Stays a left drawer on every breakpoint.</Text>
              </Drawer.Body>
            </Drawer.Content>
          </Drawer>
          <Drawer swipeDirection="right" responsive={false}>
            <Drawer.Trigger>
              <Button>Right (locked)</Button>
            </Drawer.Trigger>
            <Drawer.Content width="20rem">
              <Drawer.Header>
                <Drawer.Title>Right drawer</Drawer.Title>
              </Drawer.Header>
              <Drawer.Body>
                <Text as="p">Stays a right drawer on every breakpoint.</Text>
              </Drawer.Body>
            </Drawer.Content>
          </Drawer>
          <Drawer swipeDirection="down" responsive={false} showSwipeHandle>
            <Drawer.Trigger>
              <Button>Sheet (locked)</Button>
            </Drawer.Trigger>
            <Drawer.Content>
              <Drawer.Header>
                <Drawer.Title>Always sheet</Drawer.Title>
              </Drawer.Header>
              <Drawer.Body>
                <Text as="p">Bottom sheet on desktop and mobile.</Text>
              </Drawer.Body>
            </Drawer.Content>
          </Drawer>
          <Drawer offset={{ top: 16, bottom: 16, left: 8, right: 24 }} responsive={false}>
            <Drawer.Trigger>
              <Button>Custom offset</Button>
            </Drawer.Trigger>
            <Drawer.Content width="20rem">
              <Drawer.Header>
                <Drawer.Title>Per-side offset</Drawer.Title>
                <Drawer.Description>
                  top/bottom 16, left 8, right 24 — set via the offset prop.
                </Drawer.Description>
              </Drawer.Header>
              <Drawer.Body>
                <Text as="p">Edge space is adjustable via the offset prop.</Text>
              </Drawer.Body>
            </Drawer.Content>
          </Drawer>
        </InlineStack>
      </BlockStack>
    </BlockStack>
  );
}

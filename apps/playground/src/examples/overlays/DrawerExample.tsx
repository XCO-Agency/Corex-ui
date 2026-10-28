import {
  Badge,
  BlockStack,
  Button,
  Drawer,
  InlineStack,
  Text,
  TextField,
  closeDrawer,
  openDrawer,
  useDrawer,
} from "@xco-agency/corex-ui";

const WIDTHS = [
  "small",
  "base",
  "large",
  "large-300",
  "large-500",
  "full",
  "420px",
] as const;

/** Closes the surrounding drawer from anywhere inside it — no Drawer.Close needed. */
function SaveAndClose() {
  const drawer = useDrawer();
  return (
    <Button variant="primary" onClick={() => drawer.close()}>
      Save
    </Button>
  );
}

/** Lives outside the Drawer tree and controls it by id. */
function OpenOrderDetailsFromAnywhere() {
  const orderDetails = useDrawer("order-details");
  return (
    <Button onClick={orderDetails.toggle}>
      {orderDetails.isOpen ? "Close order details" : "Open by id (useDrawer)"}
    </Button>
  );
}

/**
 * Lives outside every <Drawer>. `useDrawer("outside-cart")` targets one drawer
 * by id; `useDrawer()` (no id) closes the topmost open drawer or all of them.
 * `data-drawer-outside-control` keeps these buttons from counting as an
 * outside press, so clicking them doesn't first dismiss the drawer.
 */
function OutsideControls() {
  const cart = useDrawer("outside-cart");
  const drawers = useDrawer();

  const openThenAutoClose = () => {
    openDrawer("outside-cart");
    window.setTimeout(() => closeDrawer("outside-cart"), 3000);
  };

  return (
    <InlineStack gap="small-200" alignItems="center" data-drawer-outside-control>
      <Button variant="primary" onClick={cart.toggle}>
        {cart.isOpen ? "Hide cart" : "Show cart"}
      </Button>
      <Button onClick={openThenAutoClose}>Open, auto-close in 3s</Button>
      <Button disabled={!drawers.isOpen} onClick={drawers.close}>
        Close topmost
      </Button>
      <Button disabled={!drawers.isOpen} onClick={drawers.closeAll}>
        Close all
      </Button>
      <Badge tone={cart.isOpen ? "success" : undefined}>
        {cart.isOpen ? "Cart open" : "Cart closed"}
      </Badge>
    </InlineStack>
  );
}

const CART_LINES = Array.from({ length: 30 }, (_, index) => `Line item ${index + 1}`);

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
        <InlineStack gap="small-200">
          <OpenOrderDetailsFromAnywhere />
        </InlineStack>
        <Drawer id="order-details">
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
              <SaveAndClose />
            </Drawer.Footer>
          </Drawer.Content>
        </Drawer>
      </BlockStack>

      <BlockStack gap="small-200">
        <Text variant="headingMd" as="h3">
          Header: close button, actions, alignment
        </Text>
        <Text as="p" variant="small" color="subdued">
          Every header has a close button in its end slot (`close=&#123;false&#125;` hides it,
          an element replaces it). `actions` adds controls before it. Titles start-align
          everywhere; `mobileAlign=&quot;center&quot;` centers them on the mobile sheet.
        </Text>
        <InlineStack gap="small-200">
          <Drawer>
            <Drawer.Trigger>
              <Button>Header actions</Button>
            </Drawer.Trigger>
            <Drawer.Content>
              <Drawer.Header
                actions={
                  <>
                    <Button variant="tertiary" icon="edit" accessibilityLabel="Edit order" />
                    <Button
                      variant="tertiary"
                      icon="menu-horizontal"
                      accessibilityLabel="More actions"
                    />
                  </>
                }
              >
                <Drawer.Title>Order #1042</Drawer.Title>
                <Drawer.Description>Actions sit before the close button.</Drawer.Description>
              </Drawer.Header>
              <Drawer.Body>
                <Text as="p">The end slot is part of the layout, not positioned on top.</Text>
              </Drawer.Body>
            </Drawer.Content>
          </Drawer>
          <Drawer>
            <Drawer.Trigger>
              <Button>Centered on mobile</Button>
            </Drawer.Trigger>
            <Drawer.Content>
              <Drawer.Header mobileAlign="center">
                <Drawer.Title>Order #1042</Drawer.Title>
                <Drawer.Description>Centered below `md`, start-aligned on desktop.</Drawer.Description>
              </Drawer.Header>
              <Drawer.Body>
                <Text as="p">Resize below `md` to see the centered header.</Text>
              </Drawer.Body>
            </Drawer.Content>
          </Drawer>
          <Drawer>
            <Drawer.Trigger>
              <Button>No close button</Button>
            </Drawer.Trigger>
            <Drawer.Content>
              <Drawer.Header close={false}>
                <Drawer.Title>Order #1042</Drawer.Title>
                <Drawer.Description>`close=&#123;false&#125;` — dismiss from the footer.</Drawer.Description>
              </Drawer.Header>
              <Drawer.Footer>
                <Drawer.Close>
                  <Button>Done</Button>
                </Drawer.Close>
              </Drawer.Footer>
            </Drawer.Content>
          </Drawer>
        </InlineStack>
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
          Pre-footer & separators
        </Text>
        <Text as="p" variant="small" color="subdued">
          Header and footer stick to the panel edges. `Drawer.PreFooter` sits above the
          footer and scrolls with the content unless `sticky`. `separator=&quot;shadow&quot;`
          fades scrolled content into the surface; `&quot;divider&quot;` draws a border.
        </Text>
        <InlineStack gap="small-200">
          {(["shadow", "divider"] as const).map((separator) => (
            <Drawer key={separator}>
              <Drawer.Trigger>
                <Button>{separator === "shadow" ? "Shadow edges" : "Divider edges"}</Button>
              </Drawer.Trigger>
              <Drawer.Content>
                <Drawer.Header separator={separator}>
                  <Drawer.Title>Cart</Drawer.Title>
                  <Drawer.Description>Scroll to see the edges.</Drawer.Description>
                </Drawer.Header>
                <Drawer.Body>
                  <BlockStack gap="base">
                    {CART_LINES.map((line) => (
                      <InlineStack key={line} align="space-between">
                        <Text as="span">{line}</Text>
                        <Text as="span" color="subdued">
                          $12.00
                        </Text>
                      </InlineStack>
                    ))}
                  </BlockStack>
                </Drawer.Body>
                <Drawer.PreFooter>
                  <Text as="p" variant="small" color="subdued">
                    Scrolls with the content (not sticky).
                  </Text>
                </Drawer.PreFooter>
                <Drawer.PreFooter sticky separator={separator}>
                  <InlineStack align="space-between">
                    <Text as="span" fontWeight="semibold">
                      Total
                    </Text>
                    <Text as="span" fontWeight="semibold">
                      $168.00
                    </Text>
                  </InlineStack>
                </Drawer.PreFooter>
                <Drawer.Footer>
                  <Drawer.Close>
                    <Button>Keep shopping</Button>
                  </Drawer.Close>
                  <Button variant="primary">Checkout</Button>
                </Drawer.Footer>
              </Drawer.Content>
            </Drawer>
          ))}
        </InlineStack>
      </BlockStack>

      <BlockStack gap="small-200">
        <Text variant="headingMd" as="h3">
          Control from outside the Drawer
        </Text>
        <Text as="p" variant="small" color="subdued">
          These buttons are not inside any `Drawer`. The cart is non-modal (`modal=&#123;false&#125;`)
          so the page stays clickable while it is open.
        </Text>
        <OutsideControls />
        <Drawer id="outside-cart" modal={false} responsive={false}>
          <Drawer.Content width="small">
            <Drawer.Header>
              <Drawer.Title>Cart</Drawer.Title>
              <Drawer.Description>Opened without a Drawer.Trigger.</Drawer.Description>
            </Drawer.Header>
            <Drawer.Body>
              <Text as="p">
                Use the buttons on the page — they control this drawer through
                `useDrawer(&quot;outside-cart&quot;)` and `useDrawer()`.
              </Text>
            </Drawer.Body>
            <Drawer.Footer>
              <SaveAndClose />
            </Drawer.Footer>
          </Drawer.Content>
        </Drawer>
      </BlockStack>

      <BlockStack gap="small-200">
        <Text variant="headingMd" as="h3">
          Widths
        </Text>
        <Text as="p" variant="small" color="subdued">
          Presets `small`, `base`, `large`, `large-100`…`large-500`, `full`, or any CSS
          length. Widths are capped to the viewport.
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

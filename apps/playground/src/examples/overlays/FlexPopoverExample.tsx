import { useRef, useState } from "react";
import { BlockStack, Button, Card, FlexPopover, Page, Text } from "@xco-agency/corex-ui";

export function FlexPopoverExample() {
  const [open, setOpen] = useState(false);
  const [hoverOpen, setHoverOpen] = useState(false);
  const buttonRef = useRef<HTMLElement | null>(null);
  const hoverRef = useRef<HTMLElement | null>(null);

  return (
    <Page heading="FlexPopover">
      <Card>
        <BlockStack gap="base">
          <Text heading>Floating Filter Panel</Text>
          <Text color="subdued">
            FlexPopover ports to the document body with automatic viewport boundary
            clamping.
          </Text>
          <Text color="subdued">
            FlexPopover ports to the document body with automatic viewport boundary
            clamping.
          </Text>
          <Text color="subdued">
            FlexPopover ports to the document body with automatic viewport boundary
            clamping.
          </Text>
          <Text color="subdued">
            FlexPopover ports to the document body with automatic viewport boundary
            clamping.
          </Text>
          <Text color="subdued">
            FlexPopover ports to the document body with automatic viewport boundary
            clamping.
          </Text>
          <Text color="subdued">
            FlexPopover ports to the document body with automatic viewport boundary
            clamping.
          </Text>
          <Text color="subdued">
            FlexPopover ports to the document body with automatic viewport boundary
            clamping.
          </Text>
          <Button ref={buttonRef} onClick={() => setOpen((prev) => !prev)}>
            {open ? "Close Filter Panel" : "Open Filter Panel"}
          </Button>

          <FlexPopover
            anchorRef={buttonRef}
            isOpen={open}
            onClose={() => setOpen(false)}
            heading="Quick Filters"
            width="280px"
          >
            <BlockStack gap="small-200">
              <Text>Status: Active orders only</Text>
              <Text>Channel: Online Store</Text>
              <Button onClick={() => setOpen(false)}>Apply Filters</Button>
            </BlockStack>
          </FlexPopover>

          <Button ref={hoverRef}>Hover for placement</Button>
          <FlexPopover
            anchorRef={hoverRef}
            isOpen={hoverOpen}
            openOnHover
            onOpen={() => setHoverOpen(true)}
            onClose={() => setHoverOpen(false)}
            position="top"
            heading="Above the button"
            width="240px"
          >
            <Text>
              Stays open while the pointer crosses the gap between the button and this
              panel.
            </Text>
          </FlexPopover>
        </BlockStack>
      </Card>
    </Page>
  );
}

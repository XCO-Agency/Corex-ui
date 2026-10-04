import { useRef, useState } from "react";
import { BlockStack, Button, Card, FlexPopover, Text } from "@xco-agency/corex-ui";

export function FlexPopoverExample() {
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLElement | null>(null);

  return (
    <Card>
      <BlockStack gap="base">
        <Text heading>Floating Filter Panel</Text>
        <Text color="subdued">
          FlexPopover ports to the document body with automatic viewport boundary clamping.
        </Text>
        <Button
          ref={buttonRef}
          onClick={() => setOpen((prev) => !prev)}
        >
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
            <Button size="small" onClick={() => setOpen(false)}>
              Apply Filters
            </Button>
          </BlockStack>
        </FlexPopover>
      </BlockStack>
    </Card>
  );
}

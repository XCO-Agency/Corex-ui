import { useState } from "react";
import {
  Badge,
  BlockStack,
  Button,
  Card,
  Divider,
  FlexPopover,
  InlineStack,
  Page,
  Text,
} from "@xco-agency/corex-ui";

export function FlexPopoverExample() {
  const [controlledOpen, setControlledOpen] = useState(false);

  return (
    <Page heading="FlexPopover">
      <BlockStack gap="base">
        <Card>
          <BlockStack gap="base">
            <Text heading>Composed Floating Popovers</Text>
            <Text color="subdued">
              FlexPopover is composed of FlexPopover.Trigger and FlexPopover.Content. It
              portals into the trigger&apos;s existing document or shadow root with
              automatic viewport boundary clamping, light-dismiss on Escape or outside
              clicks, and hover bridging without requiring manual element refs.
            </Text>

            <Divider />

            <InlineStack gap="base" wrap>
              {/* 1. Uncontrolled Click Toggle */}
              <FlexPopover position="bottom-start">
                <FlexPopover.Trigger>
                  <Button variant="primary">Quick Filters</Button>
                </FlexPopover.Trigger>
                <FlexPopover.Content
                  heading="Quick Filters"
                  width="280px"
                  padding="small"
                >
                  <BlockStack gap="small-200">
                    <InlineStack justifyContent="space-between" alignItems="center">
                      <Text>Status</Text>
                      <Badge tone="success">Active</Badge>
                    </InlineStack>
                    <InlineStack justifyContent="space-between" alignItems="center">
                      <Text>Channel</Text>
                      <Badge tone="info">Online Store</Badge>
                    </InlineStack>
                    <Button>Apply Filters</Button>
                  </BlockStack>
                </FlexPopover.Content>
              </FlexPopover>

              {/* 2. Hover Trigger with Bridge */}
              <FlexPopover openOnHover position="top">
                <FlexPopover.Trigger>
                  <Button>Hover for Details</Button>
                </FlexPopover.Trigger>
                <FlexPopover.Content
                  heading="Hover Bridge"
                  width="260px"
                  padding="small-200"
                >
                  <BlockStack gap="small-200">
                    <Text>
                      Stays open while the pointer traverses the gap between the button
                      and this panel.
                    </Text>
                    <Badge tone="attention">Closes after 150ms</Badge>
                  </BlockStack>
                </FlexPopover.Content>
              </FlexPopover>

              {/* 3. Controlled Open State */}
              <FlexPopover
                isOpen={controlledOpen}
                onClose={() => setControlledOpen(false)}
                position="bottom-end"
              >
                <FlexPopover.Trigger>
                  <Button onClick={() => setControlledOpen((prev) => !prev)}>
                    {controlledOpen ? "Close Controlled" : "Open Controlled"}
                  </Button>
                </FlexPopover.Trigger>
                <FlexPopover.Content
                  heading="Controlled Panel"
                  width="280px"
                  padding="small-200"
                >
                  <BlockStack gap="small-200">
                    <Text>Open state is controlled externally via React state.</Text>
                    <Button onClick={() => setControlledOpen(false)}>Done</Button>
                  </BlockStack>
                </FlexPopover.Content>
              </FlexPopover>

              {/* 4. Minimal Content without Header */}
              <FlexPopover position="right">
                <FlexPopover.Trigger>
                  <Button variant="tertiary">Side Popup (no header)</Button>
                </FlexPopover.Trigger>
                <FlexPopover.Content noHeader width="220px" padding="small-200">
                  <BlockStack gap="small-200">
                    <Text variant="small" heading>
                      Actions
                    </Text>
                    <Text color="subdued">Quick contextual action list.</Text>
                  </BlockStack>
                </FlexPopover.Content>
              </FlexPopover>
            </InlineStack>
          </BlockStack>
        </Card>
      </BlockStack>
    </Page>
  );
}

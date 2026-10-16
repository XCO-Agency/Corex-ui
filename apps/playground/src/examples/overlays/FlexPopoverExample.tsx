import { useState } from "react";
import {
  Badge,
  BlockStack,
  Button,
  Card,
  Divider,
  FlexPopover,
  Clickable,
  Hoverable,
  InlineStack,
  Page,
  Text,
} from "@xco-agency/corex-ui";

function Row({ label, parent }: { label: string; parent?: boolean }) {
  return (
    <Hoverable openDelay={300}>
      <Clickable inlineSize="fill" borderRadius="large" paddingInlineStart="small-200" paddingInlineEnd="small-400" minInlineSize="220px" blockSize="32px">
        <InlineStack alignItems="center" gap="small-500" blockSize="100%">
          <InlineStack gap="small-200" alignItems="center" flex={1}>
            <Text>{label}</Text>
          </InlineStack>
          <Hoverable.Show keepSpace={false} animation="scale">
            <Button icon="arrow-up-right" />
          </Hoverable.Show>
          {parent ? (
            <Hoverable.Hide keepSpace={false} animation="scale">
              <Button icon="chevron-right" variant="tertiary" />
            </Hoverable.Hide>
          ) : null}
        </InlineStack>
      </Clickable>
    </Hoverable>
  );
}

function NavRepro() {
  const names = ["Journeys", "Campaigns", "Content", "Customers"];
  return (
    <div style={{ padding: 40 }}>
      <FlexPopover openOnHover position="bottom-start">
        <FlexPopover.Trigger>
          <Button icon="menu" variant="tertiary" accessibilityLabel="menu" />
        </FlexPopover.Trigger>
        <FlexPopover.Content heading="Nav repro">
          <BlockStack gap="small-400">
            <Row label="Dashboard" />
            {names.map((n) => (
              <FlexPopover key={n} openOnHover position="right-start" offset={4} closeDelay={140} noHeader>
                <FlexPopover.Trigger>
                  <Row label={n} parent />
                </FlexPopover.Trigger>
                <FlexPopover.Content offset={14}>
                  <BlockStack gap="none">
                    {["One", "Two", "Three"].map((c) => (
                      <Row key={c} label={`${n} ${c}`} />
                    ))}
                  </BlockStack>
                </FlexPopover.Content>
              </FlexPopover>
            ))}
          </BlockStack>
        </FlexPopover.Content>
      </FlexPopover>
    </div>
  );
}

export function FlexPopoverExample() {
  const [controlledOpen, setControlledOpen] = useState(false);

  return (
    <Page heading="FlexPopover">
      <NavRepro />
      <BlockStack gap="base">
        <Card>
          <BlockStack gap="base">
            <Text heading>Composed Floating Popovers</Text>
            <Text color="subdued">
              FlexPopover is composed of FlexPopover.Trigger and FlexPopover.Content.
              It portals directly into the document body with automatic viewport boundary clamping,
              light-dismiss on Escape or outside clicks, and hover bridging without requiring manual element refs.
            </Text>

            <Divider />

            <InlineStack gap="base" wrap>
              {/* 1. Uncontrolled Click Toggle */}
              <FlexPopover position="bottom-start">
                <FlexPopover.Trigger>
                  <Button variant="primary">Quick Filters</Button>
                </FlexPopover.Trigger>
                <FlexPopover.Content heading="Quick Filters" width="280px">
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
                <FlexPopover.Content heading="Hover Bridge" width="260px">
                  <BlockStack gap="small-200">
                    <Text>
                      Stays open while the pointer traverses the gap between the button and this panel.
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
                <FlexPopover.Trigger onClick={() => setControlledOpen((prev) => !prev)}>
                  <Button>
                    {controlledOpen ? "Close Controlled" : "Open Controlled"}
                  </Button>
                </FlexPopover.Trigger>
                <FlexPopover.Content heading="Controlled Panel" width="280px">
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
                <FlexPopover.Content noHeader width="220px">
                  <BlockStack gap="small-200">
                    <Text variant="small" heading>Actions</Text>
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

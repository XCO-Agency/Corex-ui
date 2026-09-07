import { useState } from "react";
import {
  Floating,
  Card,
  BlockStack,
  InlineStack,
  Text,
  Badge,
  Button,
  ButtonGroup,
  Divider,
  Icon,
  type FloatingPositionType,
} from "@xco-agency/corex-ui";

const positions: FloatingPositionType[] = [
  "bottom-right",
  "bottom-left",
  "bottom-center",
  "top-right",
  "top-left",
  "top-center",
  "middle-right",
  "middle-left",
  "center",
];

export function FloatingControlsExample() {
  const [position, setPosition] = useState<FloatingPositionType>("bottom-right");
  const [offsetValue, setOffsetValue] = useState<number>(24);
  const [isDemoActive, setIsDemoActive] = useState<boolean>(true);

  return (
    <BlockStack gap="base">
      <Card>
        <BlockStack gap="small-100">
          <Text heading as="h3">
            Floating Controls &amp; Positions
          </Text>
          <Text as="p" color="subdued">
            Choose a position anchor and edge offset to preview how the floating container
            attaches.
          </Text>

          <InlineStack gap="small-200" wrap>
            {positions.map((pos) => (
              <Button
                key={pos}
                variant={position === pos ? "primary" : "secondary"}
                onClick={() => setPosition(pos)}
              >
                {pos}
              </Button>
            ))}
          </InlineStack>

          <Divider />

          <InlineStack gap="small-100" alignItems="center">
            <Text as="strong">Edge Offset:</Text>
            <ButtonGroup>
              {[12, 20, 32, 48].map((val) => (
                <Button
                  key={val}
                  variant={offsetValue === val ? "primary" : "secondary"}
                  onClick={() => setOffsetValue(val)}
                >
                  {val}px
                </Button>
              ))}
            </ButtonGroup>

            <Button
              variant={isDemoActive ? "tertiary" : "primary"}
              onClick={() => setIsDemoActive((prev) => !prev)}
            >
              {isDemoActive ? "Hide Floating Preview" : "Show Floating Preview"}
            </Button>
          </InlineStack>
        </BlockStack>
      </Card>

      {/* Interactive Floating Component Preview */}
      {isDemoActive && (
        <Floating
          position={position}
          offset={offsetValue}
          collapsible
          defaultCollapsed
          collapsedContent={
            <div
              style={{
                background: "var(--p-color-bg-fill-brand, #ff8060)",
                color: "var(--p-color-text-on-fill, #ffffff)",
                padding: "8px 16px",
                borderRadius: "9999px",
                boxShadow: "var(--p-shadow-300, 0 4px 12px rgba(0, 0, 0, 0.15))",
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                fontWeight: 600,
                fontSize: "13px",
              }}
            >
              <span>Quick Assistant</span>
              <Badge tone="info">New</Badge>
            </div>
          }
        >
          {({ collapse }) => (
            <Card>
              <BlockStack gap="small-100">
                <InlineStack justifyContent="space-between" alignItems="center">
                  <InlineStack gap="small-300" alignItems="center">
                    <Icon type="bolt" tone="auto" />
                    <Text heading as="h4">
                      Quick Assistant
                    </Text>
                  </InlineStack>
                  <Button variant="tertiary" icon="chevron-down" onClick={collapse} />
                </InlineStack>

                <Text as="p" color="subdued">
                  Anchored to <strong>{position}</strong> with{" "}
                  <strong>{offsetValue}px</strong> edge offset.
                </Text>

                <Divider />

                <BlockStack gap="small-300">
                  <Button inlineSize="fill" variant="secondary" icon="search">
                    Search Orders
                  </Button>
                  <Button inlineSize="fill" variant="secondary" icon="refresh">
                    Sync Store Catalog
                  </Button>
                  <Button inlineSize="fill" variant="primary" icon="check">
                    Export Report
                  </Button>
                </BlockStack>
              </BlockStack>
            </Card>
          )}
        </Floating>
      )}
    </BlockStack>
  );
}

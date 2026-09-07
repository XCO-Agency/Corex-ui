import {
  Floating,
  Card,
  BlockStack,
  InlineStack,
  Text,
  Badge,
} from "@xco-agency/corex-ui";

export function FloatingAbsoluteExample() {
  return (
    <BlockStack gap="base">
      <Card heading="In-Container Absolute Floating Showcase">
        <BlockStack gap="100">
          <Text as="p" color="subdued">
            Notice how the status badge and publish indicator float inside this bounded
            sandbox container without overflowing.
          </Text>

          <div
            style={{
              position: "relative",
              height: "220px",
              background: "var(--p-color-bg-surface-secondary, #f6f6f7)",
              borderRadius: "8px",
              border: "1px dashed var(--p-color-border, #d1d5db)",
              padding: "20px",
              overflow: "hidden",
            }}
          >
            <BlockStack gap="base">
              <Text as="strong">Sandbox Container</Text>
              <Text as="p" color="subdued">
                Items rendered with <code>strategy=&quot;absolute&quot;</code> respect the
                bounds of their nearest positioned parent.
              </Text>
            </BlockStack>

            <Floating strategy="absolute" position="bottom-right" offset={14} zIndex={10}>
              <div
                style={{
                  background: "var(--p-color-bg-surface, #ffffff)",
                  padding: "6px 12px",
                  borderRadius: "6px",
                  boxShadow: "var(--p-shadow-100, 0 1px 3px rgba(0, 0, 0, 0.1))",
                  border: "1px solid var(--p-color-border, #e3e4e6)",
                }}
              >
                <InlineStack gap="small-200" alignItems="center">
                  <Badge tone="success">Online</Badge>
                  <Text as="span" variant="small">
                    Ready to publish
                  </Text>
                </InlineStack>
              </div>
            </Floating>

            <Floating strategy="absolute" position="top-right" offset={14} zIndex={10}>
              <Badge tone="warning">Draft v2</Badge>
            </Floating>
          </div>
        </BlockStack>
      </Card>
    </BlockStack>
  );
}

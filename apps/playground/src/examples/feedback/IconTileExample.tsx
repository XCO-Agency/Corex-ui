import {
  IconTile,
  BlockStack,
  InlineStack,
  Card,
  Text,
  Icon,
} from "@xco-agency/corex-ui";

export function IconTileExample() {
  return (
    <BlockStack gap="large-200">
      <Card>
        <BlockStack gap="base">
          <Text variant="headingMd" as="h3">
            Tones
          </Text>
          <InlineStack gap="base" blockAlign="center">
            <BlockStack gap="small-100" inlineAlign="center">
              <IconTile tone="success">
                <Icon source="check" tone="inherit" />
              </IconTile>
              <Text variant="bodySm" tone="subdued">
                Success
              </Text>
            </BlockStack>

            <BlockStack gap="small-100" inlineAlign="center">
              <IconTile tone="neutral">
                <Icon source="cart" tone="inherit" />
              </IconTile>
              <Text variant="bodySm" tone="subdued">
                Neutral
              </Text>
            </BlockStack>

            <BlockStack gap="small-100" inlineAlign="center">
              <IconTile tone="caution">
                <Icon source="alert-triangle" tone="inherit" />
              </IconTile>
              <Text variant="bodySm" tone="subdued">
                Caution
              </Text>
            </BlockStack>

            <BlockStack gap="small-100" inlineAlign="center">
              <IconTile tone="subdued">
                <Icon source="settings" tone="inherit" />
              </IconTile>
              <Text variant="bodySm" tone="subdued">
                Subdued
              </Text>
            </BlockStack>
          </InlineStack>
        </BlockStack>
      </Card>

      <Card>
        <BlockStack gap="base">
          <Text variant="headingMd" as="h3">
            Sizes
          </Text>
          <InlineStack gap="base" blockAlign="center">
            <BlockStack gap="small-100" inlineAlign="center">
              <IconTile size="sm" tone="success">
                <Icon source="check" tone="inherit" />
              </IconTile>
              <Text variant="bodySm" tone="subdued">
                Small (32px)
              </Text>
            </BlockStack>

            <BlockStack gap="small-100" inlineAlign="center">
              <IconTile size="md" tone="success">
                <Icon source="check" tone="inherit" />
              </IconTile>
              <Text variant="bodySm" tone="subdued">
                Medium (40px)
              </Text>
            </BlockStack>

            <BlockStack gap="small-100" inlineAlign="center">
              <IconTile size="lg" tone="success">
                <Icon source="check" tone="inherit" />
              </IconTile>
              <Text variant="bodySm" tone="subdued">
                Large (44px)
              </Text>
            </BlockStack>
          </InlineStack>
        </BlockStack>
      </Card>

      <Card>
        <BlockStack gap="base">
          <Text variant="headingMd" as="h3">
            Border Radius
          </Text>
          <InlineStack gap="base" blockAlign="center">
            <BlockStack gap="small-100" inlineAlign="center">
              <IconTile borderRadius="none" tone="neutral">
                <Icon source="apps" tone="inherit" />
              </IconTile>
              <Text variant="bodySm" tone="subdued">
                None
              </Text>
            </BlockStack>

            <BlockStack gap="small-100" inlineAlign="center">
              <IconTile borderRadius="small" tone="neutral">
                <Icon source="apps" tone="inherit" />
              </IconTile>
              <Text variant="bodySm" tone="subdued">
                Small
              </Text>
            </BlockStack>

            <BlockStack gap="small-100" inlineAlign="center">
              <IconTile borderRadius="base" tone="neutral">
                <Icon source="apps" tone="inherit" />
              </IconTile>
              <Text variant="bodySm" tone="subdued">
                Base
              </Text>
            </BlockStack>

            <BlockStack gap="small-100" inlineAlign="center">
              <IconTile borderRadius="large" tone="neutral">
                <Icon source="apps" tone="inherit" />
              </IconTile>
              <Text variant="bodySm" tone="subdued">
                Large
              </Text>
            </BlockStack>

            <BlockStack gap="small-100" inlineAlign="center">
              <IconTile borderRadius="full" tone="neutral">
                <Icon source="apps" tone="inherit" />
              </IconTile>
              <Text variant="bodySm" tone="subdued">
                Full
              </Text>
            </BlockStack>
          </InlineStack>
        </BlockStack>
      </Card>
    </BlockStack>
  );
}

export default IconTileExample;

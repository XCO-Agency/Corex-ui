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
          <Text heading as="h3">
            Tones
          </Text>
          <InlineStack gap="base" alignItems="center">
            <BlockStack gap="small-100" alignItems="center">
              <IconTile tone="success">
                <Icon type="check" tone="auto" />
              </IconTile>
              <Text color="subdued">Success</Text>
            </BlockStack>

            <BlockStack gap="small-100" alignItems="center">
              <IconTile tone="neutral">
                <Icon type="cart" tone="auto" />
              </IconTile>
              <Text color="subdued">Neutral</Text>
            </BlockStack>

            <BlockStack gap="small-100" alignItems="center">
              <IconTile tone="caution">
                <Icon type="alert-triangle" tone="auto" />
              </IconTile>
              <Text color="subdued">Caution</Text>
            </BlockStack>

            <BlockStack gap="small-100" alignItems="center">
              <IconTile tone="subdued">
                <Icon type="settings" tone="auto" />
              </IconTile>
              <Text color="subdued">Subdued</Text>
            </BlockStack>
          </InlineStack>
        </BlockStack>
      </Card>

      <Card>
        <BlockStack gap="base">
          <Text heading as="h3">
            Sizes
          </Text>
          <InlineStack gap="base" alignItems="center">
            <BlockStack gap="small-100" alignItems="center">
              <IconTile size="sm" tone="success">
                <Icon type="check" tone="auto" />
              </IconTile>
              <Text color="subdued">Small (32px)</Text>
            </BlockStack>

            <BlockStack gap="small-100" alignItems="center">
              <IconTile size="md" tone="success">
                <Icon type="check" tone="auto" />
              </IconTile>
              <Text color="subdued">Medium (40px)</Text>
            </BlockStack>

            <BlockStack gap="small-100" alignItems="center">
              <IconTile size="lg" tone="success">
                <Icon type="check" tone="auto" />
              </IconTile>
              <Text color="subdued">Large (44px)</Text>
            </BlockStack>
          </InlineStack>
        </BlockStack>
      </Card>

      <Card>
        <BlockStack gap="base">
          <Text heading as="h3">
            Border Radius
          </Text>
          <InlineStack gap="base" alignItems="center">
            <BlockStack gap="small-100" alignItems="center">
              <IconTile borderRadius="none" tone="neutral">
                <Icon type="apps" tone="auto" />
              </IconTile>
              <Text color="subdued">None</Text>
            </BlockStack>

            <BlockStack gap="small-100" alignItems="center">
              <IconTile borderRadius="small" tone="neutral">
                <Icon type="apps" tone="auto" />
              </IconTile>
              <Text color="subdued">Small</Text>
            </BlockStack>

            <BlockStack gap="small-100" alignItems="center">
              <IconTile borderRadius="base" tone="neutral">
                <Icon type="apps" tone="auto" />
              </IconTile>
              <Text color="subdued">Base</Text>
            </BlockStack>

            <BlockStack gap="small-100" alignItems="center">
              <IconTile borderRadius="large" tone="neutral">
                <Icon type="apps" tone="auto" />
              </IconTile>
              <Text color="subdued">Large</Text>
            </BlockStack>

            <BlockStack gap="small-100" alignItems="center">
              <IconTile borderRadius="full" tone="neutral">
                <Icon type="apps" tone="auto" />
              </IconTile>
              <Text color="subdued">Full</Text>
            </BlockStack>
          </InlineStack>
        </BlockStack>
      </Card>
    </BlockStack>
  );
}

export default IconTileExample;

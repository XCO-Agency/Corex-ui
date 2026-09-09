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
              <IconTile tone="critical">
                <Icon type="delete" tone="auto" />
              </IconTile>
              <Text color="subdued">Critical</Text>
            </BlockStack>

            <BlockStack gap="small-100" alignItems="center">
              <IconTile tone="info">
                <Icon type="info" tone="auto" />
              </IconTile>
              <Text color="subdued">Info</Text>
            </BlockStack>

            <BlockStack gap="small-100" alignItems="center">
              <IconTile tone="caution">
                <Icon type="alert-triangle" tone="auto" />
              </IconTile>
              <Text color="subdued">Caution</Text>
            </BlockStack>

            <BlockStack gap="small-100" alignItems="center">
              <IconTile tone="neutral">
                <Icon type="cart" tone="auto" />
              </IconTile>
              <Text color="subdued">Neutral</Text>
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
            Color Intensity (Base vs Strong)
          </Text>
          <Text as="p" color="subdued">
            Use `color="strong"` for saturated solid backgrounds. Perfect for high-contrast emphasis and white icons.
          </Text>
          <BlockStack gap="base">
            <BlockStack gap="small-200">
              <Text as="span" variant="small" color="subdued">
                Base Intensity (Subtle Tint):
              </Text>
              <InlineStack gap="base" alignItems="center">
                <BlockStack gap="small-100" alignItems="center">
                  <IconTile tone="success" color="base">
                    <Icon type="check" tone="auto" />
                  </IconTile>
                  <Text color="subdued">Success</Text>
                </BlockStack>

                <BlockStack gap="small-100" alignItems="center">
                  <IconTile tone="critical" color="base">
                    <Icon type="delete" tone="auto" />
                  </IconTile>
                  <Text color="subdued">Critical</Text>
                </BlockStack>

                <BlockStack gap="small-100" alignItems="center">
                  <IconTile tone="info" color="base">
                    <Icon type="info" tone="auto" />
                  </IconTile>
                  <Text color="subdued">Info</Text>
                </BlockStack>

                <BlockStack gap="small-100" alignItems="center">
                  <IconTile tone="caution" color="base">
                    <Icon type="alert-triangle" tone="auto" />
                  </IconTile>
                  <Text color="subdued">Caution</Text>
                </BlockStack>

                <BlockStack gap="small-100" alignItems="center">
                  <IconTile tone="neutral" color="base">
                    <Icon type="cart" tone="auto" />
                  </IconTile>
                  <Text color="subdued">Neutral</Text>
                </BlockStack>

                <BlockStack gap="small-100" alignItems="center">
                  <IconTile tone="subdued" color="base">
                    <Icon type="settings" tone="auto" />
                  </IconTile>
                  <Text color="subdued">Subdued</Text>
                </BlockStack>
              </InlineStack>
            </BlockStack>

            <BlockStack gap="small-200">
              <Text as="span" variant="small" color="subdued">
                Strong Intensity (Solid Saturated with White Icons):
              </Text>
              <InlineStack gap="base" alignItems="center">
                <BlockStack gap="small-100" alignItems="center">
                  <IconTile tone="success" color="strong">
                    <Icon type="check" tone="white" />
                  </IconTile>
                  <Text color="subdued">Success</Text>
                </BlockStack>

                <BlockStack gap="small-100" alignItems="center">
                  <IconTile tone="critical" color="strong">
                    <Icon type="delete" tone="white" />
                  </IconTile>
                  <Text color="subdued">Critical</Text>
                </BlockStack>

                <BlockStack gap="small-100" alignItems="center">
                  <IconTile tone="info" color="strong">
                    <Icon type="info" tone="white" />
                  </IconTile>
                  <Text color="subdued">Info</Text>
                </BlockStack>

                <BlockStack gap="small-100" alignItems="center">
                  <IconTile tone="caution" color="strong">
                    <Icon type="alert-triangle" tone="white" />
                  </IconTile>
                  <Text color="subdued">Caution</Text>
                </BlockStack>

                <BlockStack gap="small-100" alignItems="center">
                  <IconTile tone="neutral" color="strong">
                    <Icon type="cart" tone="white" />
                  </IconTile>
                  <Text color="subdued">Neutral</Text>
                </BlockStack>

                <BlockStack gap="small-100" alignItems="center">
                  <IconTile tone="subdued" color="strong">
                    <Icon type="settings" tone="white" />
                  </IconTile>
                  <Text color="subdued">Subdued</Text>
                </BlockStack>
              </InlineStack>
            </BlockStack>
          </BlockStack>
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

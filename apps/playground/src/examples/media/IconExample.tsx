import { Box, BlockStack, Icon, InlineStack, Text, IconTile, Banner } from "@xco-agency/corex-ui";

export function IconExample() {
  return (
    <BlockStack gap="base">
      <Banner
        tone="info"
        title="517 Polaris Icons Available"
        action={{
          content: "Explore All 517 Icons",
          url: "/icons",
        }}
      >
        <Text as="p" variant="small">
          Looking for a specific symbol? Browse our full interactive Icon Library with advanced search, keywords, and ready-to-copy JSX code.
        </Text>
      </Banner>

      <BlockStack gap="small-200">
        <Text as="span" variant="small" color="subdued">
          Standard &amp; Tone Icons
        </Text>
        <InlineStack gap="small-200" alignItems="center">
          <Icon type="save" accessibilityLabel="Save" />
          <Icon type="delete" tone="critical" accessibilityLabel="Delete" />
          <Icon type="check" tone="success" accessibilityLabel="Success" />
          <Icon type="alert-circle" tone="caution" accessibilityLabel="Warning" />
          <Icon type="info" tone="info" accessibilityLabel="Info" />
          <Icon type="search" color="subdued" accessibilityLabel="Subdued" />
        </InlineStack>
      </BlockStack>

      <BlockStack gap="small-200">
        <Text as="span" variant="small" color="subdued">
          White Icons (<b>`tone="white"`</b> or automatically with IconTile{" "}
          <b>`color="strong"`</b>) &amp; Strong Tiles
        </Text>
        <InlineStack gap="base" alignItems="center">
          <InlineStack gap="small-200" alignItems="center">
            <IconTile tone="critical" color="strong" size="sm">
              <Icon type="star" accessibilityLabel="Star" />
            </IconTile>
            <IconTile tone="success" color="strong" size="md">
              <Icon type="heart" tone="white" accessibilityLabel="Heart" />
            </IconTile>
            <IconTile tone="info" color="strong" size="lg">
              <Icon type="lock" tone="white" accessibilityLabel="Lock" />
            </IconTile>
            <IconTile tone="info" color="strong" size="lg">
              <Box paddingInline="base">
                <Text as="span" variant="small" tone="white">
                  In `Text` with `tone="white"`
                </Text>
              </Box>
            </IconTile>
          </InlineStack>
        </InlineStack>
      </BlockStack>
    </BlockStack>
  );
}

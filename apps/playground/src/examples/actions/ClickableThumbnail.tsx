import {
  Badge,
  BlockStack,
  Box,
  Clickable,
  Icon,
  InlineStack,
  Text,
} from "@xco-agency/corex-ui";

/** A compact Clickable used only for the Overview tile image. */
export function ClickableThumbnail() {
  return (
    <Box inlineSize="320px">
      <BlockStack gap="small">
        {[
          { title: "Manage orders", icon: "order", badge: "12 pending" },
          { title: "Customer audiences", icon: "person", badge: "Active" },
        ].map((item) => (
          <Clickable
            key={item.title}
            background="base"
            borderWidth="small-100"
            borderColor="subdued"
            borderRadius="base"
            padding="base"
            inlineSize="fill"
            accessibilityLabel={item.title}
          >
            <InlineStack justifyContent="space-between" alignItems="center" gap="base">
              <InlineStack gap="small" alignItems="center">
                <Icon type={item.icon as never} />
                <Text as="span">{item.title}</Text>
              </InlineStack>
              <Badge>{item.badge}</Badge>
            </InlineStack>
          </Clickable>
        ))}
      </BlockStack>
    </Box>
  );
}

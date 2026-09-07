import {
  Collapsible,
  Card,
  BlockStack,
  InlineStack,
  Text,
  Button,
  Divider,
  Icon,
  Clickable,
} from "@xco-agency/corex-ui";

export function CollapsibleExample() {
  return (
    <Card padding="none">
      <Collapsible
        content={
          <BlockStack gap="small-200" padding="base">
            <Text as="p" color="subdued">
              Orders typically ship within 1-2 business days. Once shipped, you&apos;ll
              receive a tracking link by email. International orders may take an
              additional 3-5 business days to clear customs.
            </Text>
          </BlockStack>
        }
      >
        {({ expanded, toggle }) => (
          <Clickable
            background="transparent"

            padding="base"
            onClick={toggle}
          >
            <InlineStack justifyContent="space-between" alignItems="center">
              <Text heading as="h4">
                When will my order ship?
              </Text>
              <Icon
                type={expanded ? "chevron-up" : "chevron-down"}
                accessibilityLabel={expanded ? "Hide answer" : "Show answer"}
              />
            </InlineStack>
          </Clickable>
        )}
      </Collapsible>
    </Card>
  );
}

import {
  Collapsible,
  Card,
  BlockStack,
  InlineStack,
  Text,
  Button,
  Divider,
} from "@xco-agency/corex-ui";

export function CollapsibleExample() {
  return (
    <Card>
      <Collapsible
        content={
          <BlockStack gap="small-200">
            <Divider />
            <Text as="p" color="subdued">
              Orders typically ship within 1-2 business days. Once shipped, you&apos;ll
              receive a tracking link by email. International orders may take an
              additional 3-5 business days to clear customs.
            </Text>
          </BlockStack>
        }
      >
        {({ expanded, toggle }) => (
          <InlineStack justifyContent="space-between" alignItems="center">
            <Text heading as="h4">
              When will my order ship?
            </Text>
            <Button
              variant="tertiary"
              icon={expanded ? "chevron-up" : "chevron-down"}
              onClick={toggle}
              accessibilityLabel={expanded ? "Hide answer" : "Show answer"}
            />
          </InlineStack>
        )}
      </Collapsible>
    </Card>
  );
}

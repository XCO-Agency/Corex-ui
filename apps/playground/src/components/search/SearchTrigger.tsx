import { Button, InlineStack, Text } from "@xco-agency/corex-ui";

export type SearchTriggerPropsType = {
  onClick?: () => void;
};

export function SearchTrigger({ onClick }: SearchTriggerPropsType) {
  return (
    <Button onClick={onClick} icon="search" inlineSize="fill" accessibilityLabel="Search components">
      <InlineStack alignItems="center" justifyContent="space-between" gap="small">
        <Text color="subdued">Search components</Text>
        <Text color="subdued" variant="small">
          ⌘K
        </Text>
      </InlineStack>
    </Button>
  );
}

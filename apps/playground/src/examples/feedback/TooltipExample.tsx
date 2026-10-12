import { Button, InlineStack, Tooltip } from "@xco-agency/corex-ui";

export function TooltipExample() {
  return (
    <InlineStack gap="base">
      <Tooltip content="Deletes the item permanently">
        <Button tone="critical">Delete</Button>
      </Tooltip>
      <Tooltip content="Draft is a work in progress">
        <Button>draft</Button>
      </Tooltip>
    </InlineStack>
  );
}

import { Button, Tooltip } from "@xco-agency/corex-ui";

export function TooltipExample() {
  return (
    <Tooltip content="Deletes the item permanently">
      <Button tone="critical">Delete</Button>
    </Tooltip>
  );
}

import { Button, Tooltip } from "@xco/corex-ui";

export function TooltipExample() {
  return (
    <Tooltip content="Deletes the item permanently">
      <Button destructive>Delete</Button>
    </Tooltip>
  );
}

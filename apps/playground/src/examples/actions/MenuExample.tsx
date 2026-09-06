import { Button, InlineStack, Menu } from "@xco-agency/corex-ui";

export function MenuExample() {
  return (
    <InlineStack gap="small-200">
      <Button commandFor="actions-menu" icon="menu">
        More actions
      </Button>
      <Menu id="actions-menu">
        <Button icon="duplicate">Duplicate</Button>
        <Button icon="archive">Archive</Button>
        <Button icon="delete" tone="critical">
          Delete
        </Button>
      </Menu>
    </InlineStack>
  );
}

import { Button, Menu, Page } from "@xco/corex-ui";

export function MenuInTitleBarExample() {
  return (
    <Page title="Product Details">
      <Button slot="primary-action" icon="save">
        Save
      </Button>
      <Button slot="secondary-actions" commandFor="app-bridge-actions-menu" icon="menu">
        More actions
      </Button>
      <Menu id="app-bridge-actions-menu">
        <Button icon="duplicate">Duplicate</Button>
        <Button icon="archive">Archive</Button>
        <Button icon="delete" destructive>
          Delete
        </Button>
      </Menu>
    </Page>
  );
}

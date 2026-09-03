import { Badge, Button, Page } from "@xco/corex-ui";

export function AppWindowTitleBarExample() {
  return (
    <Page title="Edit Product">
      <Badge slot="accessory" tone="warning">
        Draft
      </Badge>
      <Button slot="primary-action">Save</Button>
    </Page>
  );
}

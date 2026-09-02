import { Page, Text } from "@xco/corex-ui";

export function PageExample() {
  return (
    <Page title="Products" subtitle="Manage your catalog" primaryAction={{ content: "Add product" }}>
      <Text>Page content goes here.</Text>
    </Page>
  );
}

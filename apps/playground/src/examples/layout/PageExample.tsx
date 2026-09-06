import { Page, Text } from "@xco-agency/corex-ui";

export function PageExample() {
  return (
    <Page
      heading="Products"
      subheading="Manage your catalog"
      primaryAction={{ content: "Add product" }}
    >
      <Text>Page content goes here.</Text>
    </Page>
  );
}

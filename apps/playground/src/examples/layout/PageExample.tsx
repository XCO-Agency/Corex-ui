import { Badge, Page, Text } from "@xco-agency/corex-ui";

export function PageExample() {
  return (
    <Page
      heading="Products"
      accessory={<Badge tone="success">Accessory content</Badge>}
      primaryAction={{ content: "Add product" }}
    >
      <Text>Page content goes here.</Text>
    </Page>
  );
}

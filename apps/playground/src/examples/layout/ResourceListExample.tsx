import {
  Badge,
  BlockStack,
  Card,
  InlineStack,
  ResourceItem,
  ResourceList,
  Text,
  Thumbnail,
} from "@xco-agency/corex-ui";

type ProductType = {
  id: string;
  title: string;
  vendor: string;
  status: "active" | "draft";
};

const products: ProductType[] = [
  { id: "1", title: "Classic tee", vendor: "Acme Supply Co.", status: "active" },
  { id: "2", title: "Canvas cap", vendor: "Acme Supply Co.", status: "draft" },
  { id: "3", title: "Leather tote", vendor: "Northern Goods", status: "active" },
];

export function ResourceListExample() {
  return (
    <Card>
      <ResourceList
        resourceName={{ singular: "product", plural: "products" }}
        items={products}
        renderItem={(product: ProductType, id) => (
          <ResourceItem
            id={id}
            onClick={() => alert(`Open ${product.title}`)}
            media={<Thumbnail alt={product.title} size="small" />}
          >
            <InlineStack gap="small-200" blockAlign="center">
              <BlockStack gap="none">
                <Text fontWeight="medium">{product.title}</Text>
                <Text color="subdued" variant="small">
                  {product.vendor}
                </Text>
              </BlockStack>
              <Badge tone={product.status === "active" ? "success" : "neutral"}>
                {product.status === "active" ? "Active" : "Draft"}
              </Badge>
            </InlineStack>
          </ResourceItem>
        )}
      />
    </Card>
  );
}

import { useState } from "react";
import {
  Badge,
  Box,
  Button,
  Card,
  Icon,
  IndexTable,
  InlineStack,
  Link,
  Text,
  Thumbnail,
  useIndexResourceState,
} from "@xco-agency/corex-ui";

type ProductItemType = {
  id: string;
  name: string;
  thumbnail: string;
  status: "Active" | "Draft" | "Archived";
  inventory: string;
  category: string;
  channels: number;
  catalogs: number;
  productType: string;
  vendor: string;
};

const productsData: ProductItemType[] = [
  {
    id: "prod-1",
    name: "Western Arkansas Button-Up in Dark Hash Floral",
    thumbnail: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=100&auto=format&fit=crop&q=60",
    status: "Active",
    inventory: "60 in stock for 6 variants",
    category: "Clothing Tops",
    channels: 3,
    catalogs: 0,
    productType: "men's button-ups",
    vendor: "Aglini",
  },
  {
    id: "prod-2",
    name: "Dartmouth Shirt in White",
    thumbnail: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=100&auto=format&fit=crop&q=60",
    status: "Active",
    inventory: "126 in stock for 7 variants",
    category: "Clothing Tops",
    channels: 3,
    catalogs: 0,
    productType: "men's button-ups",
    vendor: "Circle of C...",
  },
  {
    id: "prod-3",
    name: "Cream Dress in Painted Floral",
    thumbnail: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=100&auto=format&fit=crop&q=60",
    status: "Active",
    inventory: "114 in stock for 6 variants",
    category: "Dresses",
    channels: 3,
    catalogs: 0,
    productType: "women's dresses",
    vendor: "Amelia To...",
  },
  {
    id: "prod-4",
    name: "Sleeve Dress",
    thumbnail: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=100&auto=format&fit=crop&q=60",
    status: "Active",
    inventory: "60 in stock for 6 variants",
    category: "Dresses",
    channels: 3,
    catalogs: 0,
    productType: "women's dresses",
    vendor: "Hovman",
  },
  {
    id: "prod-5",
    name: "Body Scrub & Exfoliator Regular Price",
    thumbnail: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=100&auto=format&fit=crop&q=60",
    status: "Active",
    inventory: "25 in stock for 1 variant",
    category: "Body Scrubs & Exfoliants",
    channels: 3,
    catalogs: 0,
    productType: "body scrubs",
    vendor: "Monochro...",
  },
];

export function IndexTableExample() {
  const [page, setPage] = useState(1);
  const { selectedResources, allResourcesSelected, handleSelectionChange } =
    useIndexResourceState(productsData);

  return (
    <Card padding="none">
      <IndexTable
        resourceName={{ singular: "product", plural: "products" }}
        itemCount={productsData.length}
        selectedItemsCount={allResourcesSelected ? "All" : selectedResources.length}
        onSelectionChange={handleSelectionChange}
        headings={[
          { title: "Product" },
          { title: "Status" },
          { title: "Inventory" },
          { title: "Category" },
          { title: "Channels", alignment: "center" },
          { title: "Catalogs", alignment: "center" },
          { title: "Product type" },
          { title: "Vendor" },
          { title: "", hidden: true, width: "40px" },
        ]}
        promotedBulkActions={[
          { content: "Bulk edit", onAction: () => alert(`Bulk edit: ${selectedResources.join(", ")}`) },
          { content: "Set as draft", onAction: () => alert(`Set as draft: ${selectedResources.join(", ")}`) },
        ]}
        bulkActions={[
          { content: "Archive products", onAction: () => alert("Archive") },
          { content: "Unlist products", onAction: () => alert("Unlist") },
          { content: "Delete products", destructive: true, onAction: () => alert("Delete") },
          { content: "Include in sales channels", onAction: () => alert("Include in channels") },
          { content: "Exclude from sales channels", onAction: () => alert("Exclude from channels") },
          { content: "Add tags", onAction: () => alert("Add tags") },
          { content: "Remove tags", onAction: () => alert("Remove tags") },
        ]}
        pagination={{
          hasPrevious: page > 1,
          hasNext: page < 3,
          label: `${productsData.length} products`,
          onPrevious: () => setPage((current) => current - 1),
          onNext: () => setPage((current) => current + 1),
        }}
        footerContent={
          <InlineStack align="center" blockAlign="center">
            <Link url="#" onClick={() => alert("Learn more")}>
              Learn more about products
            </Link>
          </InlineStack>
        }
      >
        {productsData.map((product) => (
          <IndexTable.Row
            key={product.id}
            id={product.id}
            selected={selectedResources.includes(product.id)}
            onClick={() => alert(`Open ${product.name}`)}
          >
            <IndexTable.Cell>
              <InlineStack gap="small-300" blockAlign="center" wrap={false}>
                <Thumbnail source={product.thumbnail} alt={product.name} size="small" />
                <Text fontWeight="medium" as="span">
                  {product.name}
                </Text>
              </InlineStack>
            </IndexTable.Cell>

            <IndexTable.Cell>
              <Badge tone="success">{product.status}</Badge>
            </IndexTable.Cell>

            <IndexTable.Cell>
              <Text as="span" color="subdued">
                {product.inventory}
              </Text>
            </IndexTable.Cell>

            <IndexTable.Cell>
              <Text as="span">{product.category}</Text>
            </IndexTable.Cell>

            <IndexTable.Cell alignment="center">
              <InlineStack align="center" gap="small-100" blockAlign="center">
                <Text as="span">{product.channels}</Text>
                <Icon source="chevron-down" tone="neutral" />
              </InlineStack>
            </IndexTable.Cell>

            <IndexTable.Cell alignment="center">
              <Text as="span">{product.catalogs}</Text>
            </IndexTable.Cell>

            <IndexTable.Cell>
              <Text as="span">{product.productType}</Text>
            </IndexTable.Cell>

            <IndexTable.Cell>
              <Text as="span">{product.vendor}</Text>
            </IndexTable.Cell>

            <IndexTable.Cell>
              <Box onClick={(e) => e.stopPropagation()}>
                <Button
                  variant="tertiary"
                  icon="view"
                  accessibilityLabel={`View ${product.name}`}
                  onClick={() => alert(`View ${product.name}`)}
                />
              </Box>
            </IndexTable.Cell>
          </IndexTable.Row>
        ))}
      </IndexTable>
    </Card>
  );
}

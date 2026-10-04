import { useState } from "react";
import {
  Badge,
  Box,
  Button,
  IndexTable,
  InlineStack,
  Link,
  Page,
  reorderItems,
  Text,
  Thumbnail,
  useIndexResourceState,
} from "@xco-agency/corex-ui";
import type { IndexTableSortDirectionType } from "@xco-agency/corex-ui";

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
    thumbnail:
      "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=100&auto=format&fit=crop&q=60",
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
    thumbnail:
      "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=100&auto=format&fit=crop&q=60",
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
    thumbnail:
      "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=100&auto=format&fit=crop&q=60",
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
    thumbnail:
      "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=100&auto=format&fit=crop&q=60",
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
    thumbnail:
      "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=100&auto=format&fit=crop&q=60",
    status: "Active",
    inventory: "25 in stock for 1 variant",
    category: "Body Scrubs & Exfoliants",
    channels: 3,
    catalogs: 0,
    productType: "body scrubs",
    vendor: "Monochro...",
  },
  {
    id: "prod-6",
    name: "Classic Silk Blend Button-Down Shirt",
    thumbnail:
      "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=100&auto=format&fit=crop&q=60",
    status: "Active",
    inventory: "42 in stock for 4 variants",
    category: "Clothing Tops",
    channels: 2,
    catalogs: 1,
    productType: "men's shirts",
    vendor: "Everlane",
  },
  {
    id: "prod-7",
    name: "Organic Botanical Hydrating Body Lotion",
    thumbnail:
      "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=100&auto=format&fit=crop&q=60",
    status: "Active",
    inventory: "88 in stock for 2 variants",
    category: "Skin Care",
    channels: 3,
    catalogs: 0,
    productType: "body lotions",
    vendor: "Kiehl's",
  },
  {
    id: "prod-8",
    name: "Heritage Wool Relaxed Knit Overcoat",
    thumbnail:
      "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&auto=format&fit=crop&q=60",
    status: "Draft",
    inventory: "15 in stock for 3 variants",
    category: "Outerwear",
    channels: 1,
    catalogs: 0,
    productType: "coats & jackets",
    vendor: "Norse Projects",
  },
  {
    id: "prod-9",
    name: "Structured Minimalist Leather Tote Bag",
    thumbnail:
      "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=100&auto=format&fit=crop&q=60",
    status: "Active",
    inventory: "30 in stock for 2 variants",
    category: "Bags & Accessories",
    channels: 3,
    catalogs: 2,
    productType: "tote bags",
    vendor: "Cuyana",
  },
  {
    id: "prod-10",
    name: "Relaxed Fit Chino Trousers in Sand",
    thumbnail:
      "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=100&auto=format&fit=crop&q=60",
    status: "Active",
    inventory: "55 in stock for 5 variants",
    category: "Pants",
    channels: 2,
    catalogs: 0,
    productType: "men's chinos",
    vendor: "A.P.C.",
  },
  {
    id: "prod-11",
    name: "Ceramic Minimalist Pour-Over Coffee Dripper",
    thumbnail:
      "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=100&auto=format&fit=crop&q=60",
    status: "Archived",
    inventory: "0 in stock",
    category: "Kitchen & Dining",
    channels: 1,
    catalogs: 0,
    productType: "coffee ware",
    vendor: "Hario",
  },
  {
    id: "prod-12",
    name: "Handmade Scented Amber & Moss Soy Candle",
    thumbnail:
      "https://images.unsplash.com/photo-1603006905003-be475563bc59?w=100&auto=format&fit=crop&q=60",
    status: "Active",
    inventory: "74 in stock for 3 variants",
    category: "Home Fragrance",
    channels: 3,
    catalogs: 1,
    productType: "candles",
    vendor: "P.F. Candle Co.",
  },
];

/** Sample variants shown as nested rows under the first product. */
const variantsByProduct: Record<
  string,
  { id: string; title: string; inventory: string; selectable?: boolean }[]
> = {
  "prod-1": [
    { id: "prod-1-s", title: "Small", inventory: "20 in stock" },
    { id: "prod-1-m", title: "Medium", inventory: "25 in stock" },
    // selectable={false} hides the checkbox for rows that can't be selected.
    { id: "prod-1-l", title: "Large", inventory: "Discontinued", selectable: false },
  ],
};

export function IndexTableExample() {
  const [page, setPage] = useState(1);
  const [products, setProducts] = useState(productsData);
  const [sortDirection, setSortDirection] = useState<IndexTableSortDirectionType>();
  const { selectedResources, allResourcesSelected, handleSelectionChange } =
    useIndexResourceState(products, {
      // Variants count as part of "select all", so their checkboxes follow it.
      subResourceIDs: (product) =>
        (variantsByProduct[product.id] ?? [])
          .filter((variant) => variant.selectable !== false)
          .map((variant) => variant.id),
    });

  const pageSize = 5;
  const totalPages = Math.ceil(products.length / pageSize);
  const start = products.length === 0 ? 0 : (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, products.length);
  const paginatedProducts = products.slice((page - 1) * pageSize, page * pageSize);

  const handleSort = (_columnIndex: number, direction: IndexTableSortDirectionType) => {
    setSortDirection(direction);
    setProducts((current) =>
      [...current].sort((a, b) =>
        direction === "ascending"
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name),
      ),
    );
  };

  return (
    <Box background="base" position="relative">
      <Page
        heading="IndexTable example"
        inlineSize="large"
        primaryAction={{ content: "Add product", onAction: () => alert("Add product") }}
      >
        <IndexTable
          increasedTableDensity
          resourceName={{ singular: "product", plural: "products" }}
          itemCount={products.length}
          selectedItemsCount={allResourcesSelected ? "All" : selectedResources.length}
          onSelectionChange={handleSelectionChange}
          sortColumnIndex={sortDirection ? 1 : undefined}
          sortDirection={sortDirection}
          onSort={handleSort}
          // Adds a drag handle to each row; Arrow ↑/↓ on a handle also moves it.
          onReorder={(from, to) =>
            setProducts((current) => reorderItems(current, from, to))
          }
          pagination={{
            floating: true,
            hasPrevious: page > 1,
            hasNext: page < totalPages,
            label: `${start} – ${end} of ${products.length}`,
            onPrevious: () => setPage((current) => Math.max(current - 1, 1)),
            onNext: () => setPage((current) => Math.min(current + 1, totalPages)),
          }}
          headings={[
            // Thumbnail column: pinned columns get a fixed width, set by minWidth.
            { title: "", hidden: true, width: "72px" },
            {
              title: "Product",
              sortable: true,
              defaultSortDirection: "ascending",
              minWidth: 220,
            },
            { title: "Status", minWidth: 100 },
            { title: "Inventory", minWidth: 140 },
            { title: "Category", minWidth: 150 },
            { title: "Channels", alignment: "center", minWidth: 90 },
            { title: "Catalogs", alignment: "center", minWidth: 90 },
            { title: "Product type", minWidth: 150 },
            { title: "Vendor", minWidth: 130 },
            { title: "", hidden: true, width: "48px", sticky: "right" },
          ]}
          promotedBulkActions={[
            {
              content: "Bulk edit",
              onAction: () => alert(`Bulk edit: ${selectedResources.join(", ")}`),
            },
            {
              content: "Set as draft",
              onAction: () => alert(`Set as draft: ${selectedResources.join(", ")}`),
            },
          ]}
          bulkActions={[
            { content: "Archive products", onAction: () => alert("Archive") },
            { content: "Unlist products", onAction: () => alert("Unlist") },
            {
              content: "Delete products",
              destructive: true,
              onAction: () => alert("Delete"),
            },
            {
              content: "Include in sales channels",
              onAction: () => alert("Include in channels"),
            },
            {
              content: "Exclude from sales channels",
              onAction: () => alert("Exclude from channels"),
            },
            { content: "Add tags", onAction: () => alert("Add tags") },
            { content: "Remove tags", onAction: () => alert("Remove tags") },
          ]}

          footerContent={
            <InlineStack justifyContent="center" alignItems="center">
              <Link url="#" onClick={() => alert("Learn more")}>
                Learn more about products
              </Link>
            </InlineStack>
          }
        >
          {paginatedProducts.map((product) => (
            <IndexTable.Row
              key={product.id}
              id={product.id}

              selected={selectedResources.includes(product.id)}
              onClick={() => alert(`Open ${product.name}`)}
              subRows={variantsByProduct[product.id]?.map((variant) => (
                <IndexTable.Row
                  key={variant.id}
                  id={variant.id}
                  selected={selectedResources.includes(variant.id)}
                  selectable={variant.selectable}
                >
                  <IndexTable.Cell />
                  <IndexTable.Cell>
                    <Text>{variant.title}</Text>
                  </IndexTable.Cell>
                  <IndexTable.Cell />
                  <IndexTable.Cell>
                    <Text color="subdued">{variant.inventory}</Text>
                  </IndexTable.Cell>
                </IndexTable.Row>
              ))}
            >
              {/* sticky on a cell pins the whole column, header and checkbox included */}
              <IndexTable.Cell sticky="left" flush>
                <Thumbnail source={product.thumbnail} alt={product.name} size="small" />
              </IndexTable.Cell>
              {/* Pinning the name too keeps it — and variant names — in view. */}
              <IndexTable.Cell>
                <Text heading>{product.name}</Text>
              </IndexTable.Cell>

              <IndexTable.Cell>
                <Badge tone="success">{product.status}</Badge>
              </IndexTable.Cell>

              <IndexTable.Cell>
                <Text color="subdued">{product.inventory}</Text>
              </IndexTable.Cell>

              <IndexTable.Cell>
                <Text>{product.category}</Text>
              </IndexTable.Cell>

              <IndexTable.Cell alignment="center">
                <Text>{product.channels}</Text>
              </IndexTable.Cell>

              <IndexTable.Cell alignment="center">
                <Text>{product.catalogs}</Text>
              </IndexTable.Cell>

              <IndexTable.Cell>
                <Text>{product.productType}</Text>
              </IndexTable.Cell>

              <IndexTable.Cell>
                <Text>{product.vendor}</Text>
              </IndexTable.Cell>

              <IndexTable.Cell>
                {/* Clicks on controls inside a row don't open the row. */}
                <Button
                  variant="tertiary"
                  icon="view"
                  accessibilityLabel={`View ${product.name}`}
                  onClick={() => alert(`View ${product.name}`)}
                />
              </IndexTable.Cell>
            </IndexTable.Row>
          ))}
        </IndexTable>
      </Page>
    </Box>
  );
}

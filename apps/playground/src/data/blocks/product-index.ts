import type { ComponentEntry, FileItemType } from "../types";

import { ProductIndexExample } from "@/blocks/product-index/examples/ProductIndexExample";
import ProductIndexExampleRaw from "@/blocks/product-index/examples/ProductIndexExample.tsx?raw";

import ProductIndexFiltersRaw from "@/blocks/product-index/partials/ProductIndexFilters.tsx?raw";
import ProductIndexTableRaw from "@/blocks/product-index/partials/ProductIndexTable.tsx?raw";
import ProductIndexEmptyStateRaw from "@/blocks/product-index/partials/ProductIndexEmptyState.tsx?raw";
import constantsRaw from "@/blocks/product-index/constants.ts?raw";
import productsJsonRaw from "@/blocks/product-index/products.json?raw";
import utilsRaw from "@/blocks/product-index/utils.ts?raw";
import typesRaw from "@/blocks/product-index/types.ts?raw";
import indexRaw from "@/blocks/product-index/index.ts?raw";

const blockFiles: FileItemType[] = [
  {
    name: "ProductIndexExample.tsx",
    path: "examples/ProductIndexExample.tsx",
    code: ProductIndexExampleRaw,
  },
  {
    name: "ProductIndexFilters.tsx",
    path: "partials/ProductIndexFilters.tsx",
    code: ProductIndexFiltersRaw,
  },
  {
    name: "ProductIndexTable.tsx",
    path: "partials/ProductIndexTable.tsx",
    code: ProductIndexTableRaw,
  },
  {
    name: "ProductIndexEmptyState.tsx",
    path: "partials/ProductIndexEmptyState.tsx",
    code: ProductIndexEmptyStateRaw,
  },
  { name: "constants.ts", path: "constants.ts", code: constantsRaw },
  { name: "products.json", path: "products.json", code: productsJsonRaw },
  { name: "utils.ts", path: "utils.ts", code: utilsRaw },
  { name: "types.ts", path: "types.ts", code: typesRaw },
  { name: "index.ts", path: "index.ts", code: indexRaw },
];

export const productIndexBlocks: ComponentEntry[] = [
  {
    name: "Resource Index",
    slug: "product-index",
    category: "Layouts",
    description:
      "Full Shopify admin product index page: IndexFilters with view tabs, saved views, filter pills, sort and column settings, wired to an IndexTable with selection, bulk actions, sortable headings, pagination and an empty state.",
    examples: [
      {
        title: "Index Page",
        Example: ProductIndexExample,
        code: ProductIndexExampleRaw,
        filename: "ProductIndexExample.tsx",
        files: blockFiles,
        npxCommand: "npx @xco-agency/corex-ui@latest add product-index",
      },
    ],
  },
];

import type { ComponentEntry, FileItemType } from "../types";

import { ResourceTableExample } from "@/blocks/resource-table/examples/ResourceTableExample";
import ResourceTableExampleRaw from "@/blocks/resource-table/examples/ResourceTableExample.tsx?raw";

import { ResourceEmptyExample } from "@/blocks/resource-table/examples/ResourceEmptyExample";
import ResourceEmptyExampleRaw from "@/blocks/resource-table/examples/ResourceEmptyExample.tsx?raw";

import ResourceViewTabsRaw from "@/blocks/resource-table/partials/ResourceViewTabs.tsx?raw";
import ResourceFiltersRaw from "@/blocks/resource-table/partials/ResourceFilters.tsx?raw";
import ResourceBulkActionsRaw from "@/blocks/resource-table/partials/ResourceBulkActions.tsx?raw";
import ResourceTableRaw from "@/blocks/resource-table/partials/ResourceTable.tsx?raw";
import ResourceTableRowRaw from "@/blocks/resource-table/partials/ResourceTableRow.tsx?raw";
import ResourcePaginationRaw from "@/blocks/resource-table/partials/ResourcePagination.tsx?raw";
import ResourceEmptyStateRaw from "@/blocks/resource-table/partials/ResourceEmptyState.tsx?raw";
import constantsRaw from "@/blocks/resource-table/constants.ts?raw";
import typesRaw from "@/blocks/resource-table/types.ts?raw";
import indexRaw from "@/blocks/resource-table/index.ts?raw";

const blockFiles: FileItemType[] = [
  {
    name: "ResourceTableExample.tsx",
    path: "examples/ResourceTableExample.tsx",
    code: ResourceTableExampleRaw,
  },
  {
    name: "ResourceEmptyExample.tsx",
    path: "examples/ResourceEmptyExample.tsx",
    code: ResourceEmptyExampleRaw,
  },
  {
    name: "ResourceViewTabs.tsx",
    path: "partials/ResourceViewTabs.tsx",
    code: ResourceViewTabsRaw,
  },
  {
    name: "ResourceFilters.tsx",
    path: "partials/ResourceFilters.tsx",
    code: ResourceFiltersRaw,
  },
  {
    name: "ResourceBulkActions.tsx",
    path: "partials/ResourceBulkActions.tsx",
    code: ResourceBulkActionsRaw,
  },
  {
    name: "ResourceTable.tsx",
    path: "partials/ResourceTable.tsx",
    code: ResourceTableRaw,
  },
  {
    name: "ResourceTableRow.tsx",
    path: "partials/ResourceTableRow.tsx",
    code: ResourceTableRowRaw,
  },
  {
    name: "ResourcePagination.tsx",
    path: "partials/ResourcePagination.tsx",
    code: ResourcePaginationRaw,
  },
  {
    name: "ResourceEmptyState.tsx",
    path: "partials/ResourceEmptyState.tsx",
    code: ResourceEmptyStateRaw,
  },
  {
    name: "constants.ts",
    path: "constants.ts",
    code: constantsRaw,
  },
  {
    name: "types.ts",
    path: "types.ts",
    code: typesRaw,
  },
  {
    name: "index.ts",
    path: "index.ts",
    code: indexRaw,
  },
];

export const resourceTableBlocks: ComponentEntry[] = [
  {
    name: "Resource Table",
    slug: "resource-table",
    category: "Layouts",
    description:
      "Production-ready Shopify admin index and resource table layout with status view tabs, instant search, filters, multi-row selection, bulk action toolbar, pagination, and empty states.",
    examples: [
      {
        title: "Interactive Resource Table",
        Example: ResourceTableExample,
        code: ResourceTableExampleRaw,
        filename: "ResourceTableExample.tsx",
        files: blockFiles,
        npxCommand: "npx @xco-agency/corex-ui add resource-table",
      },
      {
        title: "Empty Zero-Records State",
        Example: ResourceEmptyExample,
        code: ResourceEmptyExampleRaw,
        filename: "ResourceEmptyExample.tsx",
        files: blockFiles,
        npxCommand: "npx @xco-agency/corex-ui add resource-table",
      },
    ],
  },
];

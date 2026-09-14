import type { ComponentEntry, FileItemType } from "../types";

import { InventoryTransferExample } from "@/blocks/inventory-transfer/examples/InventoryTransferExample";
import InventoryTransferExampleRaw from "@/blocks/inventory-transfer/examples/InventoryTransferExample.tsx?raw";

import TransferOriginDestinationCardRaw from "@/blocks/inventory-transfer/partials/TransferOriginDestinationCard.tsx?raw";
import TransferProductsTableCardRaw from "@/blocks/inventory-transfer/partials/TransferProductsTableCard.tsx?raw";
import TransferShipmentDetailsCardRaw from "@/blocks/inventory-transfer/partials/TransferShipmentDetailsCard.tsx?raw";
import TransferSummarySidebarCardRaw from "@/blocks/inventory-transfer/partials/TransferSummarySidebarCard.tsx?raw";
import typesRaw from "@/blocks/inventory-transfer/types.ts?raw";
import constantsRaw from "@/blocks/inventory-transfer/constants.ts?raw";
import indexRaw from "@/blocks/inventory-transfer/index.ts?raw";

const blockFiles: FileItemType[] = [
  {
    name: "InventoryTransferExample.tsx",
    path: "examples/InventoryTransferExample.tsx",
    code: InventoryTransferExampleRaw,
  },
  {
    name: "TransferOriginDestinationCard.tsx",
    path: "partials/TransferOriginDestinationCard.tsx",
    code: TransferOriginDestinationCardRaw,
  },
  {
    name: "TransferProductsTableCard.tsx",
    path: "partials/TransferProductsTableCard.tsx",
    code: TransferProductsTableCardRaw,
  },
  {
    name: "TransferShipmentDetailsCard.tsx",
    path: "partials/TransferShipmentDetailsCard.tsx",
    code: TransferShipmentDetailsCardRaw,
  },
  {
    name: "TransferSummarySidebarCard.tsx",
    path: "partials/TransferSummarySidebarCard.tsx",
    code: TransferSummarySidebarCardRaw,
  },
  {
    name: "types.ts",
    path: "types.ts",
    code: typesRaw,
  },
  {
    name: "constants.ts",
    path: "constants.ts",
    code: constantsRaw,
  },
  {
    name: "index.ts",
    path: "index.ts",
    code: indexRaw,
  },
];

export const inventoryTransferBlocks: ComponentEntry[] = [
  {
    name: "Inventory & Stock Transfer Hub",
    slug: "inventory-transfer",
    category: "Logistics",
    description:
      "Inter-facility stock movement manager with origin-destination stock level checks, SKU allocation table with stock depletion warnings, and carrier bill of lading tracking.",
    examples: [
      {
        title: "Multi-Facility Inventory Transfer",
        Example: InventoryTransferExample,
        code: InventoryTransferExampleRaw,
        filename: "InventoryTransferExample.tsx",
        files: blockFiles,
        npxCommand: "npx @xco-agency/corex-ui add inventory-transfer",
      },
    ],
  },
];

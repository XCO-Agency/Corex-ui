import type { ComponentEntry, FileItemType } from "../types";

import { DiscountRulesExample } from "@/blocks/discount-rules/examples/DiscountRulesExample";
import DiscountRulesExampleRaw from "@/blocks/discount-rules/examples/DiscountRulesExample.tsx?raw";

import DiscountGeneralCardRaw from "@/blocks/discount-rules/partials/DiscountGeneralCard.tsx?raw";
import DiscountTiersCardRaw from "@/blocks/discount-rules/partials/DiscountTiersCard.tsx?raw";
import TargetCollectionsCardRaw from "@/blocks/discount-rules/partials/TargetCollectionsCard.tsx?raw";
import TierPreviewSidebarCardRaw from "@/blocks/discount-rules/partials/TierPreviewSidebarCard.tsx?raw";
import typesRaw from "@/blocks/discount-rules/types.ts?raw";
import constantsRaw from "@/blocks/discount-rules/constants.ts?raw";
import indexRaw from "@/blocks/discount-rules/index.ts?raw";

const blockFiles: FileItemType[] = [
  {
    name: "DiscountRulesExample.tsx",
    path: "examples/DiscountRulesExample.tsx",
    code: DiscountRulesExampleRaw,
  },
  {
    name: "DiscountGeneralCard.tsx",
    path: "partials/DiscountGeneralCard.tsx",
    code: DiscountGeneralCardRaw,
  },
  {
    name: "DiscountTiersCard.tsx",
    path: "partials/DiscountTiersCard.tsx",
    code: DiscountTiersCardRaw,
  },
  {
    name: "TargetCollectionsCard.tsx",
    path: "partials/TargetCollectionsCard.tsx",
    code: TargetCollectionsCardRaw,
  },
  {
    name: "TierPreviewSidebarCard.tsx",
    path: "partials/TierPreviewSidebarCard.tsx",
    code: TierPreviewSidebarCardRaw,
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

export const discountRulesBlocks: ComponentEntry[] = [
  {
    name: "Tiered & Volume Discount Rules",
    slug: "discount-rules",
    category: "Discounts",
    description:
      "Production-ready quantity breaks and tiered discount configuration editor with dynamic tier tables, collection combinability, and a live customer-facing storefront simulation widget.",
    examples: [
      {
        title: "Tiered Discount Configuration",
        Example: DiscountRulesExample,
        code: DiscountRulesExampleRaw,
        filename: "DiscountRulesExample.tsx",
        files: blockFiles,
        npxCommand: "npx @xco-agency/corex-ui add discount-rules",
      },
    ],
  },
];

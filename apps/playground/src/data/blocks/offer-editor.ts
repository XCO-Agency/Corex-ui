import type { ComponentEntry, FileItemType } from "../types";

import { OfferEditorExample } from "@/blocks/offer-editor/examples/OfferEditorExample";
import OfferEditorExampleRaw from "@/blocks/offer-editor/examples/OfferEditorExample.tsx?raw";

import OfferDetailsCardRaw from "@/blocks/offer-editor/partials/OfferDetailsCard.tsx?raw";
import OfferRulesCardRaw from "@/blocks/offer-editor/partials/OfferRulesCard.tsx?raw";
import OfferTargetProductsCardRaw from "@/blocks/offer-editor/partials/OfferTargetProductsCard.tsx?raw";
import OfferStatusSidebarCardRaw from "@/blocks/offer-editor/partials/OfferStatusSidebarCard.tsx?raw";
import OfferSummarySidebarCardRaw from "@/blocks/offer-editor/partials/OfferSummarySidebarCard.tsx?raw";
import OfferSaveBarRaw from "@/blocks/offer-editor/partials/OfferSaveBar.tsx?raw";
import constantsRaw from "@/blocks/offer-editor/constants.ts?raw";
import typesRaw from "@/blocks/offer-editor/types.ts?raw";
import indexRaw from "@/blocks/offer-editor/index.ts?raw";

const blockFiles: FileItemType[] = [
  {
    name: "OfferEditorExample.tsx",
    path: "examples/OfferEditorExample.tsx",
    code: OfferEditorExampleRaw,
  },
  {
    name: "OfferDetailsCard.tsx",
    path: "partials/OfferDetailsCard.tsx",
    code: OfferDetailsCardRaw,
  },
  {
    name: "OfferRulesCard.tsx",
    path: "partials/OfferRulesCard.tsx",
    code: OfferRulesCardRaw,
  },
  {
    name: "OfferTargetProductsCard.tsx",
    path: "partials/OfferTargetProductsCard.tsx",
    code: OfferTargetProductsCardRaw,
  },
  {
    name: "OfferStatusSidebarCard.tsx",
    path: "partials/OfferStatusSidebarCard.tsx",
    code: OfferStatusSidebarCardRaw,
  },
  {
    name: "OfferSummarySidebarCard.tsx",
    path: "partials/OfferSummarySidebarCard.tsx",
    code: OfferSummarySidebarCardRaw,
  },
  {
    name: "OfferSaveBar.tsx",
    path: "partials/OfferSaveBar.tsx",
    code: OfferSaveBarRaw,
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

export const offerEditorBlocks: ComponentEntry[] = [
  {
    name: "Campaign / Offer Editor",
    slug: "offer-editor",
    category: "Layouts",
    description:
      "Standard two-column Shopify admin editor layout (2/3 Main + 1/3 Sidebar) with trigger rules, product pickers, schedule configuration, live summary preview, and sticky save bar.",
    examples: [
      {
        title: "Two-Column Campaign Editor",
        Example: OfferEditorExample,
        code: OfferEditorExampleRaw,
        filename: "OfferEditorExample.tsx",
        files: blockFiles,
        npxCommand: "npx @xco-agency/corex-ui add offer-editor",
      },
    ],
  },
];

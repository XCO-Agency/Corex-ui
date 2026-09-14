import type { ComponentEntry, FileItemType } from "../types";

import { UpsellBuilderExample } from "@/blocks/upsell-builder/examples/UpsellBuilderExample";
import UpsellBuilderExampleRaw from "@/blocks/upsell-builder/examples/UpsellBuilderExample.tsx?raw";

import MilestoneRewardCardRaw from "@/blocks/upsell-builder/partials/MilestoneRewardCard.tsx?raw";
import AddonSelectorCardRaw from "@/blocks/upsell-builder/partials/AddonSelectorCard.tsx?raw";
import TriggerRulesCardRaw from "@/blocks/upsell-builder/partials/TriggerRulesCard.tsx?raw";
import UpsellSummarySidebarCardRaw from "@/blocks/upsell-builder/partials/UpsellSummarySidebarCard.tsx?raw";
import typesRaw from "@/blocks/upsell-builder/types.ts?raw";
import constantsRaw from "@/blocks/upsell-builder/constants.ts?raw";
import indexRaw from "@/blocks/upsell-builder/index.ts?raw";

const blockFiles: FileItemType[] = [
  {
    name: "UpsellBuilderExample.tsx",
    path: "examples/UpsellBuilderExample.tsx",
    code: UpsellBuilderExampleRaw,
  },
  {
    name: "MilestoneRewardCard.tsx",
    path: "partials/MilestoneRewardCard.tsx",
    code: MilestoneRewardCardRaw,
  },
  {
    name: "AddonSelectorCard.tsx",
    path: "partials/AddonSelectorCard.tsx",
    code: AddonSelectorCardRaw,
  },
  {
    name: "TriggerRulesCard.tsx",
    path: "partials/TriggerRulesCard.tsx",
    code: TriggerRulesCardRaw,
  },
  {
    name: "UpsellSummarySidebarCard.tsx",
    path: "partials/UpsellSummarySidebarCard.tsx",
    code: UpsellSummarySidebarCardRaw,
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

export const upsellBuilderBlocks: ComponentEntry[] = [
  {
    name: "Upsell & Cart Add-on Builder",
    slug: "upsell-builder",
    category: "E-Commerce",
    description:
      "Full e-commerce upsell builder featuring progressive milestone spend rewards, opt-in addon checkboxes with thumbnail and pricing overrides, and live AOV analytics.",
    examples: [
      {
        title: "Upsell & Milestone Rewards Configuration",
        Example: UpsellBuilderExample,
        code: UpsellBuilderExampleRaw,
        filename: "UpsellBuilderExample.tsx",
        files: blockFiles,
        npxCommand: "npx @xco-agency/corex-ui add upsell-builder",
      },
    ],
  },
];

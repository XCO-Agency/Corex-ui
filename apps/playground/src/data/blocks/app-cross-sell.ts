import type { ComponentEntry, FileItemType } from "../types";

import { AppCrossSellExample } from "@/blocks/app-cross-sell/examples/AppCrossSellExample";
import AppCrossSellExampleRaw from "@/blocks/app-cross-sell/examples/AppCrossSellExample.tsx?raw";

import { AppCrossSellGridExample } from "@/blocks/app-cross-sell/examples/AppCrossSellGridExample";
import AppCrossSellGridExampleRaw from "@/blocks/app-cross-sell/examples/AppCrossSellGridExample.tsx?raw";

import AppCrossSellRaw from "@/blocks/app-cross-sell/AppCrossSell.tsx?raw";
import AppCrossSellTierProgressRaw from "@/blocks/app-cross-sell/partials/AppCrossSellTierProgress.tsx?raw";
import AppCrossSellRowRaw from "@/blocks/app-cross-sell/partials/AppCrossSellRow.tsx?raw";
import AppIconBadgeRaw from "@/blocks/app-cross-sell/partials/AppIconBadge.tsx?raw";
import constantsRaw from "@/blocks/app-cross-sell/constants.ts?raw";
import utilsRaw from "@/blocks/app-cross-sell/utils.ts?raw";
import typesRaw from "@/blocks/app-cross-sell/types.ts?raw";
import indexRaw from "@/blocks/app-cross-sell/index.ts?raw";

const blockFiles: FileItemType[] = [
  {
    name: "AppCrossSellExample.tsx",
    path: "examples/AppCrossSellExample.tsx",
    code: AppCrossSellExampleRaw,
  },
  {
    name: "AppCrossSellGridExample.tsx",
    path: "examples/AppCrossSellGridExample.tsx",
    code: AppCrossSellGridExampleRaw,
  },
  {
    name: "AppCrossSell.tsx",
    path: "AppCrossSell.tsx",
    code: AppCrossSellRaw,
  },
  {
    name: "AppCrossSellTierProgress.tsx",
    path: "partials/AppCrossSellTierProgress.tsx",
    code: AppCrossSellTierProgressRaw,
  },
  {
    name: "AppCrossSellRow.tsx",
    path: "partials/AppCrossSellRow.tsx",
    code: AppCrossSellRowRaw,
  },
  {
    name: "AppIconBadge.tsx",
    path: "partials/AppIconBadge.tsx",
    code: AppIconBadgeRaw,
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
  { name: "utils.ts", path: "utils.ts", code: utilsRaw },
  {
    name: "index.ts",
    path: "index.ts",
    code: indexRaw,
  },
];

export const appCrossSellBlocks: ComponentEntry[] = [
  {
    name: "App Promotion",
    slug: "app-cross-sell",
    category: "Layouts",
    description:
      "A high-converting multi-app cross-sell promotion banner with milestone discount tiers (10% off for 2 apps, 20% for 3 apps, 30% for 4+ apps), live install states, and dismissible header.",
    examples: [
      {
        title: "Promotion Banner",
        Example: AppCrossSellExample,
        code: AppCrossSellExampleRaw,
        filename: "AppCrossSellExample.tsx",
        files: blockFiles,
        npxCommand: "npx @xco-agency/corex-ui@latest add app-cross-sell",
      },
      {
        title: "Cards Grid",
        Example: AppCrossSellGridExample,
        code: AppCrossSellGridExampleRaw,
        filename: "AppCrossSellGridExample.tsx",
        files: blockFiles,
        npxCommand: "npx @xco-agency/corex-ui@latest add app-cross-sell",
      },
    ],
  },
];

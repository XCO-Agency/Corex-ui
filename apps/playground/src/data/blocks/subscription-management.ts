import type { ComponentEntry, FileItemType } from "../types";

import { SubscriptionManagementExample } from "@/blocks/subscription-management/examples/SubscriptionManagementExample";
import SubscriptionManagementExampleRaw from "@/blocks/subscription-management/examples/SubscriptionManagementExample.tsx?raw";

import ActivePlanHeroCardRaw from "@/blocks/subscription-management/partials/ActivePlanHeroCard.tsx?raw";
import UsageMetersCardRaw from "@/blocks/subscription-management/partials/UsageMetersCard.tsx?raw";
import PlanSwitchComparisonCardRaw from "@/blocks/subscription-management/partials/PlanSwitchComparisonCard.tsx?raw";
import InvoiceHistoryCardRaw from "@/blocks/subscription-management/partials/InvoiceHistoryCard.tsx?raw";
import typesRaw from "@/blocks/subscription-management/types.ts?raw";
import constantsRaw from "@/blocks/subscription-management/constants.ts?raw";
import indexRaw from "@/blocks/subscription-management/index.ts?raw";

const blockFiles: FileItemType[] = [
  {
    name: "SubscriptionManagementExample.tsx",
    path: "examples/SubscriptionManagementExample.tsx",
    code: SubscriptionManagementExampleRaw,
  },
  {
    name: "ActivePlanHeroCard.tsx",
    path: "partials/ActivePlanHeroCard.tsx",
    code: ActivePlanHeroCardRaw,
  },
  {
    name: "UsageMetersCard.tsx",
    path: "partials/UsageMetersCard.tsx",
    code: UsageMetersCardRaw,
  },
  {
    name: "PlanSwitchComparisonCard.tsx",
    path: "partials/PlanSwitchComparisonCard.tsx",
    code: PlanSwitchComparisonCardRaw,
  },
  {
    name: "InvoiceHistoryCard.tsx",
    path: "partials/InvoiceHistoryCard.tsx",
    code: InvoiceHistoryCardRaw,
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

export const subscriptionManagementBlocks: ComponentEntry[] = [
  {
    name: "Subscription & Billing Center",
    slug: "subscription-management",
    category: "Billing & SaaS",
    description:
      "Merchant SaaS billing console featuring active plan hero details, real-time resource quota meters with threshold warnings, dynamic monthly/annual tiered plan comparison, and tax invoice download history.",
    examples: [
      {
        title: "Subscription & Usage Center",
        Example: SubscriptionManagementExample,
        code: SubscriptionManagementExampleRaw,
        filename: "SubscriptionManagementExample.tsx",
        files: blockFiles,
        npxCommand: "npx @xco-agency/corex-ui@latest add subscription-management",
      },
    ],
  },
];

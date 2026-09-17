import type { ComponentEntry, FileItemType } from "../types";

import { PricingPlansExample } from "@/blocks/pricing-plans/examples/PricingPlansExample";
import PricingPlansExampleRaw from "@/blocks/pricing-plans/examples/PricingPlansExample.tsx?raw";

import ActivePlanCardRaw from "@/blocks/pricing-plans/partials/ActivePlanCard.tsx?raw";
import PlanAvatarRaw from "@/blocks/pricing-plans/partials/PlanAvatar.tsx?raw";
import PricingIntervalToggleRaw from "@/blocks/pricing-plans/partials/PricingIntervalToggle.tsx?raw";
import PricingCardRaw from "@/blocks/pricing-plans/partials/PricingCard.tsx?raw";
import PricingUsageMeterRaw from "@/blocks/pricing-plans/partials/PricingUsageMeter.tsx?raw";
import PricingFaqRaw from "@/blocks/pricing-plans/partials/PricingFaq.tsx?raw";
import PricingUpgradeModalRaw from "@/blocks/pricing-plans/partials/PricingUpgradeModal.tsx?raw";
import constantsRaw from "@/blocks/pricing-plans/constants.ts?raw";
import typesRaw from "@/blocks/pricing-plans/types.ts?raw";
import indexRaw from "@/blocks/pricing-plans/index.ts?raw";

const blockFiles: FileItemType[] = [
  {
    name: "PricingPlansExample.tsx",
    path: "examples/PricingPlansExample.tsx",
    code: PricingPlansExampleRaw,
  },
  {
    name: "ActivePlanCard.tsx",
    path: "partials/ActivePlanCard.tsx",
    code: ActivePlanCardRaw,
  },
  {
    name: "PlanAvatar.tsx",
    path: "partials/PlanAvatar.tsx",
    code: PlanAvatarRaw,
  },
  {
    name: "PricingIntervalToggle.tsx",
    path: "partials/PricingIntervalToggle.tsx",
    code: PricingIntervalToggleRaw,
  },
  {
    name: "PricingCard.tsx",
    path: "partials/PricingCard.tsx",
    code: PricingCardRaw,
  },
  {
    name: "PricingUsageMeter.tsx",
    path: "partials/PricingUsageMeter.tsx",
    code: PricingUsageMeterRaw,
  },
  {
    name: "PricingFaq.tsx",
    path: "partials/PricingFaq.tsx",
    code: PricingFaqRaw,
  },
  {
    name: "PricingUpgradeModal.tsx",
    path: "partials/PricingUpgradeModal.tsx",
    code: PricingUpgradeModalRaw,
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

export const pricingBlocks: ComponentEntry[] = [
  {
    name: "Pricing Plans",
    slug: "pricing-plans",
    category: "Layouts",
    description:
      "Subscription plan selection and upgrade layout with billing interval toggle, feature comparison checklist, usage quota progress bars, and Shopify billing confirmation modal.",
    examples: [
      {
        title: "Tiered Pricing & Billing Plans",
        Example: PricingPlansExample,
        code: PricingPlansExampleRaw,
        filename: "PricingPlansExample.tsx",
        files: blockFiles,
        npxCommand: "npx @xco-agency/corex-ui add pricing-plans",
      },
    ],
  },
];

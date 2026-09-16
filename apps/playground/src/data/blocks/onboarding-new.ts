import type { ComponentEntry, FileItemType } from "../types";

import { OnboardingNewExample } from "@/blocks/onboarding-new/examples/OnboardingNewExample";
import OnboardingNewExampleRaw from "@/blocks/onboarding-new/examples/OnboardingNewExample.tsx?raw";

import OnboardingNewRaw from "@/blocks/onboarding-new/OnboardingNew.tsx?raw";
import constantsRaw from "@/blocks/onboarding-new/constants.ts?raw";
import typesRaw from "@/blocks/onboarding-new/types.ts?raw";
import onboardingCssRaw from "@/blocks/onboarding-new/onboarding.css?raw";
import indexRaw from "@/blocks/onboarding-new/index.ts?raw";

import processingStageRaw from "@/blocks/onboarding-new/partials/ProcessingStage.tsx?raw";
import choiceQuestionsRaw from "@/blocks/onboarding-new/partials/ChoiceQuestions.tsx?raw";
import toggleGridRaw from "@/blocks/onboarding-new/partials/ToggleGrid.tsx?raw";
import stylePresetRaw from "@/blocks/onboarding-new/partials/StylePreset.tsx?raw";
import brandColorRaw from "@/blocks/onboarding-new/partials/BrandColor.tsx?raw";
import completeStageRaw from "@/blocks/onboarding-new/partials/CompleteStage.tsx?raw";

const blockFiles: FileItemType[] = [
  {
    name: "OnboardingNewExample.tsx",
    path: "examples/OnboardingNewExample.tsx",
    code: OnboardingNewExampleRaw,
  },
  {
    name: "OnboardingNew.tsx",
    path: "OnboardingNew.tsx",
    code: OnboardingNewRaw,
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
    name: "onboarding.css",
    path: "onboarding.css",
    code: onboardingCssRaw,
  },
  {
    name: "ProcessingStage.tsx",
    path: "partials/ProcessingStage.tsx",
    code: processingStageRaw,
  },
  {
    name: "ChoiceQuestions.tsx",
    path: "partials/ChoiceQuestions.tsx",
    code: choiceQuestionsRaw,
  },
  {
    name: "ToggleGrid.tsx",
    path: "partials/ToggleGrid.tsx",
    code: toggleGridRaw,
  },
  {
    name: "StylePreset.tsx",
    path: "partials/StylePreset.tsx",
    code: stylePresetRaw,
  },
  {
    name: "BrandColor.tsx",
    path: "partials/BrandColor.tsx",
    code: brandColorRaw,
  },
  {
    name: "CompleteStage.tsx",
    path: "partials/CompleteStage.tsx",
    code: completeStageRaw,
  },
  {
    name: "index.ts",
    path: "index.ts",
    code: indexRaw,
  },
];

export const onboardingNewBlocks: ComponentEntry[] = [
  {
    name: "Interactive Store Onboarding",
    slug: "onboarding-new",
    category: "Onboarding",
    description:
      "A modern, interactive multi-step onboarding block featuring store volume qualification, revenue tool toggles, live cart drawer style preset previews, storefront brand scanning, and completion celebration.",
    examples: [
      {
        title: "Store Setup Flow",
        Example: OnboardingNewExample,
        code: OnboardingNewExampleRaw,
        filename: "OnboardingNewExample.tsx",
        files: blockFiles,
        npxCommand: "npx @xco-agency/corex-ui add onboarding-new",
      },
    ],
  },
];

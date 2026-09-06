import type { ComponentEntry, FileItemType } from "../types";

import { OnboardingExample } from "@/blocks/onboarding/examples/OnboardingExample";
import OnboardingExampleRaw from "@/blocks/onboarding/examples/OnboardingExample.tsx?raw";

import OnboardingRaw from "@/blocks/onboarding/onboarding.tsx?raw";
import ProgressHeaderRaw from "@/blocks/onboarding/progress-header.tsx?raw";
import constantsRaw from "@/blocks/onboarding/constants.ts?raw";
import typesRaw from "@/blocks/onboarding/onboarding.types.ts?raw";
import useOnboardingRaw from "@/blocks/onboarding/use-onboarding.ts?raw";
import moduleCssRaw from "@/blocks/onboarding/onboarding.module.css?raw";
import step1Raw from "@/blocks/onboarding/steps/step1-initializing.tsx?raw";
import step2Raw from "@/blocks/onboarding/steps/step2-foundation.tsx?raw";
import step3Raw from "@/blocks/onboarding/steps/step3-configuration.tsx?raw";
import step4Raw from "@/blocks/onboarding/steps/step4-add-tools.tsx?raw";
import step5Raw from "@/blocks/onboarding/steps/step5-shopify-validation.tsx?raw";
import step6Raw from "@/blocks/onboarding/steps/step6-end.tsx?raw";
import indexRaw from "@/blocks/onboarding/index.ts?raw";

const blockFiles: FileItemType[] = [
  {
    name: "OnboardingExample.tsx",
    path: "examples/OnboardingExample.tsx",
    code: OnboardingExampleRaw,
  },
  {
    name: "onboarding.tsx",
    path: "onboarding.tsx",
    code: OnboardingRaw,
  },
  {
    name: "progress-header.tsx",
    path: "progress-header.tsx",
    code: ProgressHeaderRaw,
  },
  {
    name: "constants.ts",
    path: "constants.ts",
    code: constantsRaw,
  },
  {
    name: "onboarding.types.ts",
    path: "onboarding.types.ts",
    code: typesRaw,
  },
  {
    name: "use-onboarding.ts",
    path: "use-onboarding.ts",
    code: useOnboardingRaw,
  },
  {
    name: "onboarding.module.css",
    path: "onboarding.module.css",
    code: moduleCssRaw,
  },
  {
    name: "step1-initializing.tsx",
    path: "steps/step1-initializing.tsx",
    code: step1Raw,
  },
  {
    name: "step2-foundation.tsx",
    path: "steps/step2-foundation.tsx",
    code: step2Raw,
  },
  {
    name: "step3-configuration.tsx",
    path: "steps/step3-configuration.tsx",
    code: step3Raw,
  },
  {
    name: "step4-add-tools.tsx",
    path: "steps/step4-add-tools.tsx",
    code: step4Raw,
  },
  {
    name: "step5-shopify-validation.tsx",
    path: "steps/step5-shopify-validation.tsx",
    code: step5Raw,
  },
  {
    name: "step6-end.tsx",
    path: "steps/step6-end.tsx",
    code: step6Raw,
  },
  {
    name: "index.ts",
    path: "index.ts",
    code: indexRaw,
  },
];

export const onboardingBlocks: ComponentEntry[] = [
  {
    name: "Merchant Onboarding",
    slug: "onboarding",
    category: "Onboarding",
    description:
      "A production-ready multi-step Shopify onboarding wizard block featuring automated store data syncing, revenue foundation activation, live free-shipping threshold configuration, preset tool selection, theme embed verification, and celebration.",
    examples: [
      {
        title: "Multi-Step Onboarding Flow",
        Example: OnboardingExample,
        code: OnboardingExampleRaw,
        filename: "OnboardingExample.tsx",
        files: blockFiles,
        npxCommand: "npx @xco-agency/corex-ui add onboarding",
      },
    ],
  },
];

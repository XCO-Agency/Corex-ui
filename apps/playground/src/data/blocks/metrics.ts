import type { ComponentEntry, FileItemType } from "../types";

import { MetricsDashboardExample } from "@/blocks/metrics-dashboard/MetricsDashboardExample";
import MetricsDashboardExampleRaw from "@/blocks/metrics-dashboard/MetricsDashboardExample.tsx?raw";

import { MetricsDashboardAdvancedExample } from "@/blocks/metrics-dashboard/MetricsDashboardAdvancedExample";
import MetricsDashboardAdvancedExampleRaw from "@/blocks/metrics-dashboard/MetricsDashboardAdvancedExample.tsx?raw";

import indexRaw from "@/blocks/metrics-dashboard/index.ts?raw";

import { AiRecommendationsExample } from "@/blocks/ai-recommendations/AiRecommendationsExample";
import AiRecommendationsExampleRaw from "@/blocks/ai-recommendations/AiRecommendationsExample.tsx?raw";

import AiRecommendationsRaw from "@/blocks/ai-recommendations/AiRecommendations.tsx?raw";
import RecommendationItemRaw from "@/blocks/ai-recommendations/RecommendationItem.tsx?raw";
import RecommendationIllustrationsRaw from "@/blocks/ai-recommendations/RecommendationIllustrations.tsx?raw";
import aiRecommendationsIndexRaw from "@/blocks/ai-recommendations/index.ts?raw";

const aiRecommendationsFiles: FileItemType[] = [
  {
    name: "AiRecommendationsExample.tsx",
    path: "AiRecommendationsExample.tsx",
    code: AiRecommendationsExampleRaw,
  },
  {
    name: "AiRecommendations.tsx",
    path: "AiRecommendations.tsx",
    code: AiRecommendationsRaw,
  },
  {
    name: "RecommendationItem.tsx",
    path: "RecommendationItem.tsx",
    code: RecommendationItemRaw,
  },
  {
    name: "RecommendationIllustrations.tsx",
    path: "RecommendationIllustrations.tsx",
    code: RecommendationIllustrationsRaw,
  },
  {
    name: "index.ts",
    path: "index.ts",
    code: aiRecommendationsIndexRaw,
  },
];

export const metricsBlocks: ComponentEntry[] = [
  {
    name: "Metrics Dashboard",
    slug: "metrics-dashboard",
    category: "Metrics",
    description:
      "A production-ready Shopify metrics dashboard block featuring interactive DatePicker filtering, KPI cards with sparklines, and period-over-period comparative trends.",
    examples: [
      {
        title: "Performance Overview with DatePicker",
        Example: MetricsDashboardExample,
        code: MetricsDashboardExampleRaw,
        filename: "MetricsDashboardExample.tsx",
        files: [
          {
            name: "MetricsDashboardExample.tsx",
            path: "MetricsDashboardExample.tsx",
            code: MetricsDashboardExampleRaw,
          },
          {
            name: "index.ts",
            path: "index.ts",
            code: indexRaw,
          },
        ],
        npxCommand: "npx @xco-agency/corex-ui@latest add metrics-dashboard",
      },
      {
        title: "Independent Card Interactions (Expand vs External Click)",
        Example: MetricsDashboardAdvancedExample,
        code: MetricsDashboardAdvancedExampleRaw,
        filename: "MetricsDashboardAdvancedExample.tsx",
        files: [
          {
            name: "MetricsDashboardAdvancedExample.tsx",
            path: "MetricsDashboardAdvancedExample.tsx",
            code: MetricsDashboardAdvancedExampleRaw,
          },
          {
            name: "index.ts",
            path: "index.ts",
            code: indexRaw,
          },
        ],
        npxCommand: "npx @xco-agency/corex-ui@latest add metrics-dashboard",
      },
    ],
  },
  {
    name: "AI Strategy Copilot",
    slug: "ai-recommendations",
    category: "Metrics",
    description:
      "Order history basket mining and high-impact revenue opportunities with AI-calculated lift badges, custom vector illustrations, and instant 1-click action triggers.",
    examples: [
      {
        title: "AI Strategy Copilot Card",
        Example: AiRecommendationsExample,
        code: AiRecommendationsExampleRaw,
        filename: "AiRecommendationsExample.tsx",
        files: aiRecommendationsFiles,
        npxCommand: "npx @xco-agency/corex-ui@latest add ai-recommendations",
      },
    ],
  },
];

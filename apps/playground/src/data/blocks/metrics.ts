import type { ComponentEntry } from "../types";

import { MetricsDashboardExample } from "@/blocks/metrics-dashboard/MetricsDashboardExample";
import MetricsDashboardExampleRaw from "@/blocks/metrics-dashboard/MetricsDashboardExample.tsx?raw";

import { MetricsDashboardAdvancedExample } from "@/blocks/metrics-dashboard/MetricsDashboardAdvancedExample";
import MetricsDashboardAdvancedExampleRaw from "@/blocks/metrics-dashboard/MetricsDashboardAdvancedExample.tsx?raw";

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
        ],
        npxCommand: "npx @xco-agency/corex-ui add metrics-dashboard",
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
        ],
        npxCommand: "npx @xco-agency/corex-ui add metrics-dashboard",
      },
    ],
  },
];

import type { ComponentEntry } from "../types";

import { MetricsDashboardExample } from "@/blocks/metrics-dashboard/MetricsDashboardExample";
import MetricsDashboardExampleRaw from "@/blocks/metrics-dashboard/MetricsDashboardExample.tsx?raw";

import MetricsPeriodComparisonRaw from "@/blocks/metrics-dashboard/MetricsPeriodComparison.tsx?raw";

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
            name: "MetricsPeriodComparison.tsx",
            path: "MetricsPeriodComparison.tsx",
            code: MetricsPeriodComparisonRaw,
          },
        ],
        npxCommand: "npx @xco-agency/corex-ui add metrics-dashboard",
      },
    ],
  },
];

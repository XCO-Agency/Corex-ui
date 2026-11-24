import type { ComponentEntry, FileItemType } from "../types";

import { AnalyticsChartsExample } from "@/blocks/analytics-charts/examples/AnalyticsChartsExample";
import AnalyticsChartsExampleRaw from "@/blocks/analytics-charts/examples/AnalyticsChartsExample.tsx?raw";
import ChangeIndicatorRaw from "@/blocks/analytics-charts/partials/ChangeIndicator.tsx?raw";
import ChartCardRaw from "@/blocks/analytics-charts/partials/ChartCard.tsx?raw";
import typesRaw from "@/blocks/analytics-charts/types.ts?raw";
import utilsRaw from "@/blocks/analytics-charts/utils.ts?raw";
import sampleDataRaw from "@/blocks/analytics-charts/examples/sampleData.ts?raw";

const blockFiles: FileItemType[] = [
  {
    name: "AnalyticsChartsExample.tsx",
    path: "examples/AnalyticsChartsExample.tsx",
    code: AnalyticsChartsExampleRaw,
  },
  { name: "sampleData.ts", path: "examples/sampleData.ts", code: sampleDataRaw },
  { name: "ChartCard.tsx", path: "partials/ChartCard.tsx", code: ChartCardRaw },
  {
    name: "ChangeIndicator.tsx",
    path: "partials/ChangeIndicator.tsx",
    code: ChangeIndicatorRaw,
  },
  { name: "types.ts", path: "types.ts", code: typesRaw },
  { name: "utils.ts", path: "utils.ts", code: utilsRaw },
];

export const analyticsChartsBlocks: ComponentEntry[] = [
  {
    name: "Analytics Charts",
    slug: "analytics-charts",
    category: "Analytics",
    description:
      "Shopify admin-style analytics charts: metric cards with a defined title and change, a line chart with a dashed comparison period, a column chart, a conversion funnel, a ranked bar list, a donut and a sparkline. The charts are Corex UI components (ChartLine, ChartBar, ChartFunnel, ChartBarList, ChartDonut, ChartSparkline); the block adds the metric card and period helpers around them.",
    examples: [
      {
        title: "Analytics Charts",
        Example: AnalyticsChartsExample,
        code: AnalyticsChartsExampleRaw,
        filename: "AnalyticsChartsExample.tsx",
        files: blockFiles,
        npxCommand: "npx @xco-agency/corex-ui@latest add analytics-charts",
      },
    ],
  },
];

import type { ComponentEntry, FileItemType } from "../types";

import { AnalyticsChartsExample } from "@/blocks/analytics-charts/examples/AnalyticsChartsExample";
import AnalyticsChartsExampleRaw from "@/blocks/analytics-charts/examples/AnalyticsChartsExample.tsx?raw";

import sampleDataRaw from "@/blocks/analytics-charts/examples/sampleData.ts?raw";
import AxesRaw from "@/blocks/analytics-charts/partials/Axes.tsx?raw";
import ChangeIndicatorRaw from "@/blocks/analytics-charts/partials/ChangeIndicator.tsx?raw";
import ChartCardRaw from "@/blocks/analytics-charts/partials/ChartCard.tsx?raw";
import ChartTooltipRaw from "@/blocks/analytics-charts/partials/ChartTooltip.tsx?raw";
import ColumnChartRaw from "@/blocks/analytics-charts/partials/ColumnChart.tsx?raw";
import DonutChartRaw from "@/blocks/analytics-charts/partials/DonutChart.tsx?raw";
import FunnelChartRaw from "@/blocks/analytics-charts/partials/FunnelChart.tsx?raw";
import HorizontalBarListRaw from "@/blocks/analytics-charts/partials/HorizontalBarList.tsx?raw";
import LineChartRaw from "@/blocks/analytics-charts/partials/LineChart.tsx?raw";
import SparklineRaw from "@/blocks/analytics-charts/partials/Sparkline.tsx?raw";
import useActiveIndexRaw from "@/blocks/analytics-charts/hooks/useActiveIndex.ts?raw";
import useChartWidthRaw from "@/blocks/analytics-charts/hooks/useChartWidth.ts?raw";
import constantsRaw from "@/blocks/analytics-charts/constants.ts?raw";
import typesRaw from "@/blocks/analytics-charts/types.ts?raw";
import utilsRaw from "@/blocks/analytics-charts/utils.ts?raw";
import indexRaw from "@/blocks/analytics-charts/index.ts?raw";

const blockFiles: FileItemType[] = [
  {
    name: "AnalyticsChartsExample.tsx",
    path: "examples/AnalyticsChartsExample.tsx",
    code: AnalyticsChartsExampleRaw,
  },
  { name: "sampleData.ts", path: "examples/sampleData.ts", code: sampleDataRaw },
  { name: "ChartCard.tsx", path: "partials/ChartCard.tsx", code: ChartCardRaw },
  { name: "LineChart.tsx", path: "partials/LineChart.tsx", code: LineChartRaw },
  { name: "ColumnChart.tsx", path: "partials/ColumnChart.tsx", code: ColumnChartRaw },
  { name: "FunnelChart.tsx", path: "partials/FunnelChart.tsx", code: FunnelChartRaw },
  {
    name: "HorizontalBarList.tsx",
    path: "partials/HorizontalBarList.tsx",
    code: HorizontalBarListRaw,
  },
  { name: "DonutChart.tsx", path: "partials/DonutChart.tsx", code: DonutChartRaw },
  { name: "Sparkline.tsx", path: "partials/Sparkline.tsx", code: SparklineRaw },
  {
    name: "ChangeIndicator.tsx",
    path: "partials/ChangeIndicator.tsx",
    code: ChangeIndicatorRaw,
  },
  { name: "ChartTooltip.tsx", path: "partials/ChartTooltip.tsx", code: ChartTooltipRaw },
  { name: "Axes.tsx", path: "partials/Axes.tsx", code: AxesRaw },
  { name: "useActiveIndex.ts", path: "hooks/useActiveIndex.ts", code: useActiveIndexRaw },
  { name: "useChartWidth.ts", path: "hooks/useChartWidth.ts", code: useChartWidthRaw },
  { name: "constants.ts", path: "constants.ts", code: constantsRaw },
  { name: "types.ts", path: "types.ts", code: typesRaw },
  { name: "utils.ts", path: "utils.ts", code: utilsRaw },
  { name: "index.ts", path: "index.ts", code: indexRaw },
];

export const analyticsChartsBlocks: ComponentEntry[] = [
  {
    name: "Analytics Charts",
    slug: "analytics-charts",
    category: "Analytics",
    description:
      "Shopify admin-style analytics charts: metric cards with a defined title and change, a line chart with a dashed comparison period, a column chart, a conversion funnel, a ranked bar list, a donut and a sparkline. Dependency-free SVG with hover and keyboard tooltips.",
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

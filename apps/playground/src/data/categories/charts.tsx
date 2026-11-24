import type { ComponentEntry } from "../types";
import { ChartBarExample } from "@/examples/charts/ChartBarExample";
import ChartBarExampleRaw from "@/examples/charts/ChartBarExample.tsx?raw";
import { ChartBarListExample } from "@/examples/charts/ChartBarListExample";
import ChartBarListExampleRaw from "@/examples/charts/ChartBarListExample.tsx?raw";
import { ChartDonutExample } from "@/examples/charts/ChartDonutExample";
import ChartDonutExampleRaw from "@/examples/charts/ChartDonutExample.tsx?raw";
import { ChartFunnelExample } from "@/examples/charts/ChartFunnelExample";
import ChartFunnelExampleRaw from "@/examples/charts/ChartFunnelExample.tsx?raw";
import { ChartLineExample } from "@/examples/charts/ChartLineExample";
import ChartLineExampleRaw from "@/examples/charts/ChartLineExample.tsx?raw";
import { ChartSparklineExample } from "@/examples/charts/ChartSparklineExample";
import ChartSparklineExampleRaw from "@/examples/charts/ChartSparklineExample.tsx?raw";

export const chartsComponents: ComponentEntry[] = [
  {
    name: "ChartBar",
    slug: "chart-bar",
    category: "Charts",
    description:
      "Column chart with labelled gridlines, an optional pale comparison bar beside each column, and a hover and keyboard tooltip.",
    examples: [
      { title: "Orders per day", Example: ChartBarExample, code: ChartBarExampleRaw },
    ],
  },
  {
    name: "ChartBarList",
    slug: "chart-bar-list",
    category: "Charts",
    description:
      "Ranked list with a share and a thin bar per row, and the value and change in a hover card (or in the row with tooltip={false}).",
    examples: [
      {
        title: "Sessions by location",
        Example: ChartBarListExample,
        code: ChartBarListExampleRaw,
      },
    ],
  },
  {
    name: "ChartDonut",
    slug: "chart-donut",
    category: "Charts",
    description:
      "Ring of slices with the total in the centre; hovering a slice or legend row grows it, dims the rest and shows a tooltip.",
    examples: [
      {
        title: "Sales by channel",
        Example: ChartDonutExample,
        code: ChartDonutExampleRaw,
      },
    ],
  },
  {
    name: "ChartFunnel",
    slug: "chart-funnel",
    category: "Charts",
    description:
      "Conversion funnel: label, share, count and change per stage, bars with faded drop-off bands, and a hover card per stage.",
    examples: [
      {
        title: "Conversion rate breakdown",
        Example: ChartFunnelExample,
        code: ChartFunnelExampleRaw,
      },
    ],
  },
  {
    name: "ChartLine",
    slug: "chart-line",
    category: "Charts",
    description:
      "Line chart over dates with an optional dashed comparison period, smooth (default) or sharp curves, and a hover and keyboard tooltip.",
    examples: [
      { title: "Smooth and sharp", Example: ChartLineExample, code: ChartLineExampleRaw },
    ],
  },
  {
    name: "ChartSparkline",
    slug: "chart-sparkline",
    category: "Charts",
    description:
      "Small trend line with a gradient area and an end dot, the same one MetricCard uses. Tones or any CSS colour.",
    examples: [
      {
        title: "Tones and sizes",
        Example: ChartSparklineExample,
        code: ChartSparklineExampleRaw,
      },
    ],
  },
];

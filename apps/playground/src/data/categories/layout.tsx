import type { ComponentEntry } from "../types";
import { BoxExample } from "@/examples/layout/BoxExample";
import BoxExampleRaw from "@/examples/layout/BoxExample.tsx?raw";
import { BlockStackExample } from "@/examples/layout/BlockStackExample";
import BlockStackExampleRaw from "@/examples/layout/BlockStackExample.tsx?raw";
import { InlineStackExample } from "@/examples/layout/InlineStackExample";
import InlineStackExampleRaw from "@/examples/layout/InlineStackExample.tsx?raw";
import { CardExample } from "@/examples/layout/CardExample";
import CardExampleRaw from "@/examples/layout/CardExample.tsx?raw";
import { PageExample } from "@/examples/layout/PageExample";
import PageExampleRaw from "@/examples/layout/PageExample.tsx?raw";
import { HoverableExample } from "@/examples/layout/HoverableExample";
import HoverableExampleRaw from "@/examples/layout/HoverableExample.tsx?raw";
import { SelectableExample } from "@/examples/layout/SelectableExample";
import SelectableExampleRaw from "@/examples/layout/SelectableExample.tsx?raw";
import { DividerExample } from "@/examples/layout/DividerExample";
import DividerExampleRaw from "@/examples/layout/DividerExample.tsx?raw";
import { MetricCardExample } from "@/examples/layout/MetricCardExample";
import MetricCardExampleRaw from "@/examples/layout/MetricCardExample.tsx?raw";
import { TableExample } from "@/examples/layout/TableExample";
import TableExampleRaw from "@/examples/layout/TableExample.tsx?raw";
import { CollapsibleExample } from "@/examples/layout/CollapsibleExample";
import CollapsibleExampleRaw from "@/examples/layout/CollapsibleExample.tsx?raw";
import { CollapsibleFaqExample } from "@/examples/layout/CollapsibleFaqExample";
import CollapsibleFaqExampleRaw from "@/examples/layout/CollapsibleFaqExample.tsx?raw";
import { TransitionExample } from "@/examples/layout/TransitionExample";
import TransitionExampleRaw from "@/examples/layout/TransitionExample.tsx?raw";
import { LayoutExample } from "@/examples/layout/LayoutExample";
import LayoutExampleRaw from "@/examples/layout/LayoutExample.tsx?raw";
import { GridExample } from "@/examples/layout/GridExample";
import GridExampleRaw from "@/examples/layout/GridExample.tsx?raw";
import { QueryContainerExample } from "@/examples/layout/QueryContainerExample";
import QueryContainerExampleRaw from "@/examples/layout/QueryContainerExample.tsx?raw";
import { InlineGridExample } from "@/examples/layout/InlineGridExample";
import InlineGridExampleRaw from "@/examples/layout/InlineGridExample.tsx?raw";
import { FormLayoutExample } from "@/examples/layout/FormLayoutExample";
import FormLayoutExampleRaw from "@/examples/layout/FormLayoutExample.tsx?raw";
import { TextContainerExample } from "@/examples/layout/TextContainerExample";
import TextContainerExampleRaw from "@/examples/layout/TextContainerExample.tsx?raw";
import { ListExample } from "@/examples/layout/ListExample";
import ListExampleRaw from "@/examples/layout/ListExample.tsx?raw";
import { DescriptionListExample } from "@/examples/layout/DescriptionListExample";
import DescriptionListExampleRaw from "@/examples/layout/DescriptionListExample.tsx?raw";
import { IndexTableExample } from "@/examples/layout/IndexTableExample";
import IndexTableExampleRaw from "@/examples/layout/IndexTableExample.tsx?raw";
import { ResourceListExample } from "@/examples/layout/ResourceListExample";
import ResourceListExampleRaw from "@/examples/layout/ResourceListExample.tsx?raw";
import { SkeletonPageExample } from "@/examples/layout/SkeletonPageExample";
import SkeletonPageExampleRaw from "@/examples/layout/SkeletonPageExample.tsx?raw";

export const layoutComponents: ComponentEntry[] = [
  {
    name: "Box",
    slug: "box",
    category: "Layout",
    description:
      "A generic, unopinionated container for padding, background, and border styling.",
    examples: [
      {
        title: "Padded box",
        Example: BoxExample,
        code: BoxExampleRaw,
      },
    ],
  },
  {
    name: "BlockStack",
    slug: "block-stack",
    category: "Layout",
    description: "Stacks its children vertically with consistent spacing.",
    examples: [
      {
        title: "Vertical stack",
        Example: BlockStackExample,
        code: BlockStackExampleRaw,
      },
    ],
  },
  {
    name: "InlineStack",
    slug: "inline-stack",
    category: "Layout",
    description: "Stacks its children horizontally with consistent spacing.",
    examples: [
      {
        title: "Horizontal stack",
        Example: InlineStackExample,
        code: InlineStackExampleRaw,
      },
    ],
  },
  {
    name: "Card",
    slug: "card",
    category: "Layout",
    description:
      "A bordered content surface, optionally with a heading, used to group related content.",
    examples: [
      {
        title: "With a title",
        Example: CardExample,
        code: CardExampleRaw,
      },
    ],
  },
  {
    name: "MetricCard",
    slug: "metric-card",
    category: "Layout",
    description: "",
    examples: [
      {
        title: "A Metric Card",
        Example: MetricCardExample,
        code: MetricCardExampleRaw,
      },
    ],
  },
  {
    name: "Page",
    slug: "page",
    category: "Layout",
    description:
      "The top-level layout wrapper for a screen, with a heading and primary/secondary actions.",
    examples: [
      {
        title: "With a primary action",
        Example: PageExample,
        code: PageExampleRaw,
      },
    ],
  },
  {
    name: "Selectable",
    slug: "selectable",
    category: "Layout",
    description:
      "Wraps a card or any element and draws a toned outline while it is selected. Works standalone or in a group with radio or multi-select behaviour.",
    examples: [
      {
        title: "Plans, channels and tones",
        Example: SelectableExample,
        code: SelectableExampleRaw,
      },
    ],
  },
  {
    name: "Hoverable",
    slug: "hoverable",
    category: "Layout",
    description:
      "Hover group that shows or hides content anywhere inside it with an animation, without adding a box or shifting the layout. Also exposes the hover state to render-function children.",
    examples: [
      {
        title: "Card actions and render function",
        Example: HoverableExample,
        code: HoverableExampleRaw,
      },
    ],
  },
  {
    name: "Divider",
    slug: "divider",
    category: "Layout",
    description: "Creates visual separation between sections of content.",
    examples: [
      {
        title: "Between content",
        Example: DividerExample,
        code: DividerExampleRaw,
      },
    ],
  },
  {
    name: "Table",
    slug: "table",
    category: "Layout",
    description:
      "Displays tabular data with support for expandable sub-rows and custom cell renderers.",
    examples: [
      {
        title: "With expandable sub-rows",
        Example: TableExample,
        code: TableExampleRaw,
      },
    ],
  },
  {
    name: "Collapsible",
    slug: "collapsible",
    category: "Layout",
    description:
      "A reusable expand/collapse wrapper for target-plus-content layouts, animated with a CSS grid-row transition.",
    examples: [
      {
        title: "Basic disclosure",
        Example: CollapsibleExample,
        code: CollapsibleExampleRaw,
      },
      {
        title: "Grouped FAQ rows (single open at a time)",
        Example: CollapsibleFaqExample,
        code: CollapsibleFaqExampleRaw,
      },
    ],
  },
  {
    name: "Transition",
    slug: "transition",
    category: "Layout",
    description:
      "A reusable, lightweight animation primitive supporting preset variants (fade-up, scale, pop, slide-up, etc.) with automatic bi-directional in/out transitions.",
    examples: [
      {
        title: "Variant Presets & In/Out Controls",
        Example: TransitionExample,
        code: TransitionExampleRaw,
      },
    ],
  },
  {
    name: "Grid",
    slug: "grid",
    category: "Layout",
    description:
      "CSS Grid container with responsive tracks (columns/rows), gaps, and Grid.Item placement.",
    examples: [
      {
        title: "Responsive columns and gaps",
        Example: GridExample,
        code: GridExampleRaw,
      },
    ],
  },
  {
    name: "Layout",
    slug: "layout",
    category: "Layout",
    description:
      "v12's page grid: sections that take a fraction of the row on desktop and stack on a phone.",
    examples: [
      {
        title: "Sections in a twelve-column grid",
        Example: LayoutExample,
        code: LayoutExampleRaw,
      },
    ],
  },
  {
    name: "InlineGrid",
    slug: "inline-grid",
    category: "Layout",
    description:
      "Equal or explicitly tracked columns on one row, including v12's fraction names.",
    examples: [
      {
        title: "Counts, tracks and breakpoints",
        Example: InlineGridExample,
        code: InlineGridExampleRaw,
      },
    ],
  },
  {
    name: "QueryContainer",
    slug: "query-container",
    category: "Layout",
    description:
      "Establishes a CSS container query context so child elements adapt based on component size.",
    examples: [
      {
        title: "Container query context",
        Example: QueryContainerExample,
        code: QueryContainerExampleRaw,
      },
    ],
  },
  {
    name: "FormLayout",
    slug: "form-layout",
    category: "Layout",
    description: "Fields in a column, with groups that put several on one wrapping row.",
    examples: [
      {
        title: "Fields and a group",
        Example: FormLayoutExample,
        code: FormLayoutExampleRaw,
      },
    ],
  },
  {
    name: "TextContainer",
    slug: "text-container",
    category: "Layout",
    description: "A column of prose at v12's tight or loose rhythm.",
    examples: [
      {
        title: "Tight and loose",
        Example: TextContainerExample,
        code: TextContainerExampleRaw,
      },
    ],
  },
  {
    name: "List",
    slug: "list",
    category: "Layout",
    description: "Bulleted or numbered lists, on the native list elements.",
    examples: [
      {
        title: "Bulleted and numbered",
        Example: ListExample,
        code: ListExampleRaw,
      },
    ],
  },
  {
    name: "DescriptionList",
    slug: "description-list",
    category: "Layout",
    description: "Term and description pairs in two columns, as a real definition list.",
    examples: [
      {
        title: "Order details",
        Example: DescriptionListExample,
        code: DescriptionListExampleRaw,
      },
    ],
  },
  {
    name: "IndexTable",
    slug: "index-table",
    category: "Layout",
    description:
      "v12's resource table: selection, bulk actions and paging over the Table wrapper.",
    examples: [
      {
        title: "Selectable orders with bulk actions",
        Example: IndexTableExample,
        code: IndexTableExampleRaw,
      },
    ],
  },
  {
    name: "ResourceList",
    slug: "resource-list",
    category: "Layout",
    description: "A list that renders each item through a callback, with clickable rows.",
    examples: [
      {
        title: "Products with media",
        Example: ResourceListExample,
        code: ResourceListExampleRaw,
      },
    ],
  },
  {
    name: "SkeletonPage",
    slug: "skeleton-page",
    category: "Layout",
    description: "A page-shaped loading state: a title row above placeholder content.",
    examples: [
      {
        title: "Loading a page",
        Example: SkeletonPageExample,
        code: SkeletonPageExampleRaw,
      },
    ],
  },
];

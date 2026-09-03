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
import { DividerExample } from "@/examples/layout/DividerExample";
import DividerExampleRaw from "@/examples/layout/DividerExample.tsx?raw";

export const layoutComponents: ComponentEntry[] = [
  {
    name: "Box",
    slug: "box",
    category: "Layout",
    description: "A generic, unopinionated container for padding, background, and border styling.",
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
    description: "A bordered content surface, optionally with a heading, used to group related content.",
    examples: [
      {
        title: "With a title",
        Example: CardExample,
        code: CardExampleRaw,
      },
    ],
  },
  {
    name: "Page",
    slug: "page",
    category: "Layout",
    description: "The top-level layout wrapper for a screen, with a heading and primary/secondary actions.",
    examples: [
      {
        title: "With a primary action",
        Example: PageExample,
        code: PageExampleRaw,
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
];

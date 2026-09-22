import type { ComponentEntry, FileItemType } from "../types";

import { CardsOverviewExample } from "@/blocks/cards/examples/CardsOverviewExample";
import CardsOverviewExampleRaw from "@/blocks/cards/examples/CardsOverviewExample.tsx?raw";

import { CardsMinimalistExample } from "@/blocks/cards/examples/CardsMinimalistExample";
import CardsMinimalistExampleRaw from "@/blocks/cards/examples/CardsMinimalistExample.tsx?raw";

import { CardsMediaExample } from "@/blocks/cards/examples/CardsMediaExample";
import CardsMediaExampleRaw from "@/blocks/cards/examples/CardsMediaExample.tsx?raw";

import { CardsMediaActionExample } from "@/blocks/cards/examples/CardsMediaActionExample";
import CardsMediaActionExampleRaw from "@/blocks/cards/examples/CardsMediaActionExample.tsx?raw";

import MinimalistCardRaw from "@/blocks/cards/partials/MinimalistCard.tsx?raw";
import MediaCardRaw from "@/blocks/cards/partials/MediaCard.tsx?raw";
import MediaActionCardRaw from "@/blocks/cards/partials/MediaActionCard.tsx?raw";
import SelectableCardRaw from "@/blocks/cards/partials/SelectableCard.tsx?raw";

const overviewFiles: FileItemType[] = [
  {
    name: "CardsOverviewExample.tsx",
    path: "examples/CardsOverviewExample.tsx",
    code: CardsOverviewExampleRaw,
  },
  {
    name: "SelectableCard.tsx",
    path: "partials/SelectableCard.tsx",
    code: SelectableCardRaw,
  },
];

const minimalistFiles: FileItemType[] = [
  {
    name: "CardsMinimalistExample.tsx",
    path: "examples/CardsMinimalistExample.tsx",
    code: CardsMinimalistExampleRaw,
  },
  {
    name: "MinimalistCard.tsx",
    path: "partials/MinimalistCard.tsx",
    code: MinimalistCardRaw,
  },
];

const mediaFiles: FileItemType[] = [
  {
    name: "CardsMediaExample.tsx",
    path: "examples/CardsMediaExample.tsx",
    code: CardsMediaExampleRaw,
  },
  {
    name: "MediaCard.tsx",
    path: "partials/MediaCard.tsx",
    code: MediaCardRaw,
  },
];

const mediaActionFiles: FileItemType[] = [
  {
    name: "CardsMediaActionExample.tsx",
    path: "examples/CardsMediaActionExample.tsx",
    code: CardsMediaActionExampleRaw,
  },
  {
    name: "MediaActionCard.tsx",
    path: "partials/MediaActionCard.tsx",
    code: MediaActionCardRaw,
  },
];

export const cardsBlocks: ComponentEntry[] = [
  {
    name: "Cards",
    slug: "cards",
    category: "Layouts & Administration",
    description:
      "Versatile responsive card layouts across 3 essential variants: Minimalist (typography & status), Media (16:9 visual cover, title & description), and Media Actions (cover image, title, description, and interactive action buttons).",
    examples: [
      {
        title: "Overview: 3 Card Variants",
        Example: CardsOverviewExample,
        code: CardsOverviewExampleRaw,
        filename: "CardsOverviewExample.tsx",
        files: overviewFiles,
        npxCommand: "npx @xco-agency/corex-ui@latest add cards",
      },
      {
        title: "Variant 1: Minimalist Cards",
        Example: CardsMinimalistExample,
        code: CardsMinimalistExampleRaw,
        filename: "CardsMinimalistExample.tsx",
        files: minimalistFiles,
        npxCommand: "npx @xco-agency/corex-ui@latest add cards",
      },
      {
        title: "Variant 2: Media Cards (Image + Title + Description)",
        Example: CardsMediaExample,
        code: CardsMediaExampleRaw,
        filename: "CardsMediaExample.tsx",
        files: mediaFiles,
        npxCommand: "npx @xco-agency/corex-ui@latest add cards",
      },
      {
        title: "Variant 3: Media Action Cards (Image + Title + Description + Actions)",
        Example: CardsMediaActionExample,
        code: CardsMediaActionExampleRaw,
        filename: "CardsMediaActionExample.tsx",
        files: mediaActionFiles,
        npxCommand: "npx @xco-agency/corex-ui@latest add cards",
      },
    ],
  },
];

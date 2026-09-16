import type { ComponentEntry, FileItemType } from "../types";

import { SupportHubExample } from "@/blocks/support-hub/examples/SupportHubExample";
import SupportHubExampleRaw from "@/blocks/support-hub/examples/SupportHubExample.tsx?raw";

import { SupportHubBannerExample } from "@/blocks/support-hub/examples/SupportHubBannerExample";
import SupportHubBannerExampleRaw from "@/blocks/support-hub/examples/SupportHubBannerExample.tsx?raw";

import { SupportHubGridExample } from "@/blocks/support-hub/examples/SupportHubGridExample";
import SupportHubGridExampleRaw from "@/blocks/support-hub/examples/SupportHubGridExample.tsx?raw";

import SupportHubRaw from "@/blocks/support-hub/SupportHub.tsx?raw";
import SupportContactCardRaw from "@/blocks/support-hub/partials/SupportContactCard.tsx?raw";
import SupportQuickLinksRaw from "@/blocks/support-hub/partials/SupportQuickLinks.tsx?raw";
import SupportTeamAvatarsRaw from "@/blocks/support-hub/partials/SupportTeamAvatars.tsx?raw";
import constantsRaw from "@/blocks/support-hub/constants.ts?raw";
import typesRaw from "@/blocks/support-hub/types.ts?raw";
import indexRaw from "@/blocks/support-hub/index.ts?raw";

const blockFiles: FileItemType[] = [
  {
    name: "SupportHubExample.tsx",
    path: "examples/SupportHubExample.tsx",
    code: SupportHubExampleRaw,
  },
  {
    name: "SupportHubBannerExample.tsx",
    path: "examples/SupportHubBannerExample.tsx",
    code: SupportHubBannerExampleRaw,
  },
  {
    name: "SupportHubGridExample.tsx",
    path: "examples/SupportHubGridExample.tsx",
    code: SupportHubGridExampleRaw,
  },
  {
    name: "SupportHub.tsx",
    path: "SupportHub.tsx",
    code: SupportHubRaw,
  },
  {
    name: "SupportContactCard.tsx",
    path: "partials/SupportContactCard.tsx",
    code: SupportContactCardRaw,
  },
  {
    name: "SupportQuickLinks.tsx",
    path: "partials/SupportQuickLinks.tsx",
    code: SupportQuickLinksRaw,
  },
  {
    name: "SupportTeamAvatars.tsx",
    path: "partials/SupportTeamAvatars.tsx",
    code: SupportTeamAvatarsRaw,
  },
  {
    name: "constants.ts",
    path: "constants.ts",
    code: constantsRaw,
  },
  {
    name: "types.ts",
    path: "types.ts",
    code: typesRaw,
  },
  {
    name: "index.ts",
    path: "index.ts",
    code: indexRaw,
  },
];

export const supportHubBlocks: ComponentEntry[] = [
  {
    name: "Explore more support",
    slug: "support-hub",
    category: "Growth & Ecosystem",
    description:
      "A merchant assistance and support hub featuring live team avatars, operating schedule, direct chat/call/email actions, and quick-access cards for Feature Requests and FAQ documentation.",
    examples: [
      {
        title: "Explore more support",
        Example: SupportHubExample,
        code: SupportHubExampleRaw,
        filename: "SupportHubExample.tsx",
        files: blockFiles,
        npxCommand: "npx @xco-agency/corex-ui add support-hub",
      },
      {
        title: "Full-Width Horizontal Banner Layout",
        Example: SupportHubBannerExample,
        code: SupportHubBannerExampleRaw,
        filename: "SupportHubBannerExample.tsx",
        files: blockFiles,
        npxCommand: "npx @xco-agency/corex-ui add support-hub",
      },
      {
        title: "3-Column Symmetrical Resource Grid",
        Example: SupportHubGridExample,
        code: SupportHubGridExampleRaw,
        filename: "SupportHubGridExample.tsx",
        files: blockFiles,
        npxCommand: "npx @xco-agency/corex-ui add support-hub",
      },
    ],
  },
];

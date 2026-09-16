import type { ComponentEntry, FileItemType } from "../types";

import { VideoTutorialExample } from "@/blocks/video-tutorial/examples/VideoTutorialExample";
import VideoTutorialExampleRaw from "@/blocks/video-tutorial/examples/VideoTutorialExample.tsx?raw";

import { VideoTutorialCompactExample } from "@/blocks/video-tutorial/examples/VideoTutorialCompactExample";
import VideoTutorialCompactExampleRaw from "@/blocks/video-tutorial/examples/VideoTutorialCompactExample.tsx?raw";

import VideoTutorialCardRaw from "@/blocks/video-tutorial/VideoTutorialCard.tsx?raw";
import constantsRaw from "@/blocks/video-tutorial/constants.ts?raw";
import typesRaw from "@/blocks/video-tutorial/types.ts?raw";
import indexRaw from "@/blocks/video-tutorial/index.ts?raw";

const blockFiles: FileItemType[] = [
  {
    name: "VideoTutorialExample.tsx",
    path: "examples/VideoTutorialExample.tsx",
    code: VideoTutorialExampleRaw,
  },
  {
    name: "VideoTutorialCompactExample.tsx",
    path: "examples/VideoTutorialCompactExample.tsx",
    code: VideoTutorialCompactExampleRaw,
  },
  {
    name: "VideoTutorialCard.tsx",
    path: "VideoTutorialCard.tsx",
    code: VideoTutorialCardRaw,
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

export const videoTutorialBlocks: ComponentEntry[] = [
  {
    name: "Learn how to set up a fully optimized Shopify cart drawer",
    slug: "video-tutorial",
    category: "Growth & Ecosystem",
    description:
      "Educational onboarding card with 16:9 video thumbnail preview, duration timestamp, title, description, and contextual options menu matching Shopify app onboarding.",
    examples: [
      {
        title: "Learn how to set up a fully optimized Shopify cart drawer",
        Example: VideoTutorialExample,
        code: VideoTutorialExampleRaw,
        filename: "VideoTutorialExample.tsx",
        files: blockFiles,
        npxCommand: "npx @xco-agency/corex-ui add video-tutorial",
      },
      {
        title: "Compact Sidebar Video Card",
        Example: VideoTutorialCompactExample,
        code: VideoTutorialCompactExampleRaw,
        filename: "VideoTutorialCompactExample.tsx",
        files: blockFiles,
        npxCommand: "npx @xco-agency/corex-ui add video-tutorial",
      },
    ],
  },
];

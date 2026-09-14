import type { ComponentEntry, FileItemType } from "../types";

import { ReviewModerationExample } from "@/blocks/review-moderation/examples/ReviewModerationExample";
import ReviewModerationExampleRaw from "@/blocks/review-moderation/examples/ReviewModerationExample.tsx?raw";

import ReviewRatingStatsCardRaw from "@/blocks/review-moderation/partials/ReviewRatingStatsCard.tsx?raw";
import ReviewModerationToolbarRaw from "@/blocks/review-moderation/partials/ReviewModerationToolbar.tsx?raw";
import ReviewQueueCardRaw from "@/blocks/review-moderation/partials/ReviewQueueCard.tsx?raw";
import ReviewReplyModalRaw from "@/blocks/review-moderation/partials/ReviewReplyModal.tsx?raw";
import typesRaw from "@/blocks/review-moderation/types.ts?raw";
import constantsRaw from "@/blocks/review-moderation/constants.ts?raw";
import indexRaw from "@/blocks/review-moderation/index.ts?raw";

const blockFiles: FileItemType[] = [
  {
    name: "ReviewModerationExample.tsx",
    path: "examples/ReviewModerationExample.tsx",
    code: ReviewModerationExampleRaw,
  },
  {
    name: "ReviewRatingStatsCard.tsx",
    path: "partials/ReviewRatingStatsCard.tsx",
    code: ReviewRatingStatsCardRaw,
  },
  {
    name: "ReviewModerationToolbar.tsx",
    path: "partials/ReviewModerationToolbar.tsx",
    code: ReviewModerationToolbarRaw,
  },
  {
    name: "ReviewQueueCard.tsx",
    path: "partials/ReviewQueueCard.tsx",
    code: ReviewQueueCardRaw,
  },
  {
    name: "ReviewReplyModal.tsx",
    path: "partials/ReviewReplyModal.tsx",
    code: ReviewReplyModalRaw,
  },
  {
    name: "types.ts",
    path: "types.ts",
    code: typesRaw,
  },
  {
    name: "constants.ts",
    path: "constants.ts",
    code: constantsRaw,
  },
  {
    name: "index.ts",
    path: "index.ts",
    code: indexRaw,
  },
];

export const reviewModerationBlocks: ComponentEntry[] = [
  {
    name: "Review & UGC Moderation Center",
    slug: "review-moderation",
    category: "Feedback",
    description:
      "UGC review moderation dashboard with customer sentiment breakdown, star rating distribution bars, photo gallery previews, and inline public merchant reply composer with template shortcuts.",
    examples: [
      {
        title: "Review & UGC Moderation",
        Example: ReviewModerationExample,
        code: ReviewModerationExampleRaw,
        filename: "ReviewModerationExample.tsx",
        files: blockFiles,
        npxCommand: "npx @xco-agency/corex-ui add review-moderation",
      },
    ],
  },
];

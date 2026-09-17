import type { ComponentEntry, FileItemType } from "../types";

import { ActivityFeedExample } from "@/blocks/activity-feed/examples/ActivityFeedExample";
import ActivityFeedExampleRaw from "@/blocks/activity-feed/examples/ActivityFeedExample.tsx?raw";

import ActivityFiltersRaw from "@/blocks/activity-feed/partials/ActivityFilters.tsx?raw";
import ActivityTimelineItemRaw from "@/blocks/activity-feed/partials/ActivityTimelineItem.tsx?raw";
import ActivityPayloadModalRaw from "@/blocks/activity-feed/partials/ActivityPayloadModal.tsx?raw";
import ActivityEmptyStateRaw from "@/blocks/activity-feed/partials/ActivityEmptyState.tsx?raw";
import constantsRaw from "@/blocks/activity-feed/constants.ts?raw";
import typesRaw from "@/blocks/activity-feed/types.ts?raw";
import indexRaw from "@/blocks/activity-feed/index.ts?raw";

const blockFiles: FileItemType[] = [
  {
    name: "ActivityFeedExample.tsx",
    path: "examples/ActivityFeedExample.tsx",
    code: ActivityFeedExampleRaw,
  },
  {
    name: "ActivityFilters.tsx",
    path: "partials/ActivityFilters.tsx",
    code: ActivityFiltersRaw,
  },
  {
    name: "ActivityTimelineItem.tsx",
    path: "partials/ActivityTimelineItem.tsx",
    code: ActivityTimelineItemRaw,
  },
  {
    name: "ActivityPayloadModal.tsx",
    path: "partials/ActivityPayloadModal.tsx",
    code: ActivityPayloadModalRaw,
  },
  {
    name: "ActivityEmptyState.tsx",
    path: "partials/ActivityEmptyState.tsx",
    code: ActivityEmptyStateRaw,
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

export const activityFeedBlocks: ComponentEntry[] = [
  {
    name: "Activity & Audit Feed",
    slug: "activity-feed",
    category: "Layouts",
    description:
      "Chronological audit trail and activity log feed with search & event filters, user avatars, severity badges, JSON payload inspector modal, and empty states.",
    examples: [
      {
        title: "Activity & Audit Feed",
        Example: ActivityFeedExample,
        code: ActivityFeedExampleRaw,
        filename: "ActivityFeedExample.tsx",
        files: blockFiles,
        npxCommand: "npx @xco-agency/corex-ui@latest add activity-feed",
      },
    ],
  },
];

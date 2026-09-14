import type { ComponentEntry, FileItemType } from "../types";

import { CustomerSegmentsExample } from "@/blocks/customer-segments/examples/CustomerSegmentsExample";
import CustomerSegmentsExampleRaw from "@/blocks/customer-segments/examples/CustomerSegmentsExample.tsx?raw";

import SegmentFilterBuilderCardRaw from "@/blocks/customer-segments/partials/SegmentFilterBuilderCard.tsx?raw";
import AudienceReachCardRaw from "@/blocks/customer-segments/partials/AudienceReachCard.tsx?raw";
import MatchedCustomersTableCardRaw from "@/blocks/customer-segments/partials/MatchedCustomersTableCard.tsx?raw";
import SegmentActionsBarRaw from "@/blocks/customer-segments/partials/SegmentActionsBar.tsx?raw";
import typesRaw from "@/blocks/customer-segments/types.ts?raw";
import constantsRaw from "@/blocks/customer-segments/constants.ts?raw";
import indexRaw from "@/blocks/customer-segments/index.ts?raw";

const blockFiles: FileItemType[] = [
  {
    name: "CustomerSegmentsExample.tsx",
    path: "examples/CustomerSegmentsExample.tsx",
    code: CustomerSegmentsExampleRaw,
  },
  {
    name: "SegmentFilterBuilderCard.tsx",
    path: "partials/SegmentFilterBuilderCard.tsx",
    code: SegmentFilterBuilderCardRaw,
  },
  {
    name: "AudienceReachCard.tsx",
    path: "partials/AudienceReachCard.tsx",
    code: AudienceReachCardRaw,
  },
  {
    name: "MatchedCustomersTableCard.tsx",
    path: "partials/MatchedCustomersTableCard.tsx",
    code: MatchedCustomersTableCardRaw,
  },
  {
    name: "SegmentActionsBar.tsx",
    path: "partials/SegmentActionsBar.tsx",
    code: SegmentActionsBarRaw,
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

export const customerSegmentsBlocks: ComponentEntry[] = [
  {
    name: "Customer Segmentation & Audience Filter",
    slug: "customer-segments",
    category: "Marketing",
    description:
      "Advanced customer cohort builder with dynamic predicate filter rules, live matching reach estimation, sample matched customer table, and bulk export actions.",
    examples: [
      {
        title: "Customer Segment Filter Hub",
        Example: CustomerSegmentsExample,
        code: CustomerSegmentsExampleRaw,
        filename: "CustomerSegmentsExample.tsx",
        files: blockFiles,
        npxCommand: "npx @xco-agency/corex-ui add customer-segments",
      },
    ],
  },
];

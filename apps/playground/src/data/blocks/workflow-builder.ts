import type { ComponentEntry, FileItemType } from "../types";

import { WorkflowBuilderExample } from "@/blocks/workflow-builder/examples/WorkflowBuilderExample";
import WorkflowBuilderExampleRaw from "@/blocks/workflow-builder/examples/WorkflowBuilderExample.tsx?raw";

import WorkflowTriggerCardRaw from "@/blocks/workflow-builder/partials/WorkflowTriggerCard.tsx?raw";
import WorkflowConditionsCardRaw from "@/blocks/workflow-builder/partials/WorkflowConditionsCard.tsx?raw";
import WorkflowActionsCardRaw from "@/blocks/workflow-builder/partials/WorkflowActionsCard.tsx?raw";
import WorkflowStatusSidebarCardRaw from "@/blocks/workflow-builder/partials/WorkflowStatusSidebarCard.tsx?raw";
import typesRaw from "@/blocks/workflow-builder/types.ts?raw";
import constantsRaw from "@/blocks/workflow-builder/constants.ts?raw";
import indexRaw from "@/blocks/workflow-builder/index.ts?raw";

const blockFiles: FileItemType[] = [
  {
    name: "WorkflowBuilderExample.tsx",
    path: "examples/WorkflowBuilderExample.tsx",
    code: WorkflowBuilderExampleRaw,
  },
  {
    name: "WorkflowTriggerCard.tsx",
    path: "partials/WorkflowTriggerCard.tsx",
    code: WorkflowTriggerCardRaw,
  },
  {
    name: "WorkflowConditionsCard.tsx",
    path: "partials/WorkflowConditionsCard.tsx",
    code: WorkflowConditionsCardRaw,
  },
  {
    name: "WorkflowActionsCard.tsx",
    path: "partials/WorkflowActionsCard.tsx",
    code: WorkflowActionsCardRaw,
  },
  {
    name: "WorkflowStatusSidebarCard.tsx",
    path: "partials/WorkflowStatusSidebarCard.tsx",
    code: WorkflowStatusSidebarCardRaw,
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

export const workflowBuilderBlocks: ComponentEntry[] = [
  {
    name: "Workflow & Automation Builder",
    slug: "workflow-builder",
    category: "Automation",
    description:
      "Visual trigger-condition-action workflow automation builder for Shopify stores with sequential operations, AND/OR logic gates, and dry-run execution testing.",
    examples: [
      {
        title: "Store Event Automation Flow",
        Example: WorkflowBuilderExample,
        code: WorkflowBuilderExampleRaw,
        filename: "WorkflowBuilderExample.tsx",
        files: blockFiles,
        npxCommand: "npx @xco-agency/corex-ui@latest add workflow-builder",
      },
    ],
  },
];

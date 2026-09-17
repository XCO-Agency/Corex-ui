import type { ComponentEntry, FileItemType } from "../types";

import { NotificationTemplatesExample } from "@/blocks/notification-templates/examples/NotificationTemplatesExample";
import NotificationTemplatesExampleRaw from "@/blocks/notification-templates/examples/NotificationTemplatesExample.tsx?raw";

import TemplateConfigCardRaw from "@/blocks/notification-templates/partials/TemplateConfigCard.tsx?raw";
import DynamicVariablesCardRaw from "@/blocks/notification-templates/partials/DynamicVariablesCard.tsx?raw";
import TemplateEditorCardRaw from "@/blocks/notification-templates/partials/TemplateEditorCard.tsx?raw";
import DevicePreviewSidebarCardRaw from "@/blocks/notification-templates/partials/DevicePreviewSidebarCard.tsx?raw";
import typesRaw from "@/blocks/notification-templates/types.ts?raw";
import constantsRaw from "@/blocks/notification-templates/constants.ts?raw";
import indexRaw from "@/blocks/notification-templates/index.ts?raw";

const blockFiles: FileItemType[] = [
  {
    name: "NotificationTemplatesExample.tsx",
    path: "examples/NotificationTemplatesExample.tsx",
    code: NotificationTemplatesExampleRaw,
  },
  {
    name: "TemplateConfigCard.tsx",
    path: "partials/TemplateConfigCard.tsx",
    code: TemplateConfigCardRaw,
  },
  {
    name: "DynamicVariablesCard.tsx",
    path: "partials/DynamicVariablesCard.tsx",
    code: DynamicVariablesCardRaw,
  },
  {
    name: "TemplateEditorCard.tsx",
    path: "partials/TemplateEditorCard.tsx",
    code: TemplateEditorCardRaw,
  },
  {
    name: "DevicePreviewSidebarCard.tsx",
    path: "partials/DevicePreviewSidebarCard.tsx",
    code: DevicePreviewSidebarCardRaw,
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

export const notificationTemplatesBlocks: ComponentEntry[] = [
  {
    name: "Notification & Template Designer",
    slug: "notification-templates",
    category: "Marketing",
    description:
      "Dual-pane notification and marketing copy editor with clickable Liquid variable tag injection, multi-channel (SMS/Email) configuration, and live mobile phone mockup simulation.",
    examples: [
      {
        title: "Transactional Message Designer",
        Example: NotificationTemplatesExample,
        code: NotificationTemplatesExampleRaw,
        filename: "NotificationTemplatesExample.tsx",
        files: blockFiles,
        npxCommand: "npx @xco-agency/corex-ui@latest add notification-templates",
      },
    ],
  },
];

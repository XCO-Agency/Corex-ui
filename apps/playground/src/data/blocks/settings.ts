import type { ComponentEntry, FileItemType } from "../types";

import { AnnotatedSettingsExample } from "@/blocks/settings-layout/examples/AnnotatedSettingsExample";
import AnnotatedSettingsExampleRaw from "@/blocks/settings-layout/examples/AnnotatedSettingsExample.tsx?raw";

import { NavigationSettingsExample } from "@/blocks/settings-layout/examples/NavigationSettingsExample";
import NavigationSettingsExampleRaw from "@/blocks/settings-layout/examples/NavigationSettingsExample.tsx?raw";

import AnnotatedSectionRaw from "@/blocks/settings-layout/partials/AnnotatedSection.tsx?raw";
import GeneralSettingsCardRaw from "@/blocks/settings-layout/partials/GeneralSettingsCard.tsx?raw";
import NotificationSettingsCardRaw from "@/blocks/settings-layout/partials/NotificationSettingsCard.tsx?raw";
import SecuritySettingsCardRaw from "@/blocks/settings-layout/partials/SecuritySettingsCard.tsx?raw";
import DangerZoneCardRaw from "@/blocks/settings-layout/partials/DangerZoneCard.tsx?raw";
import SettingsSaveBarRaw from "@/blocks/settings-layout/partials/SettingsSaveBar.tsx?raw";
import typesRaw from "@/blocks/settings-layout/types.ts?raw";
import indexRaw from "@/blocks/settings-layout/index.ts?raw";

const blockFiles: FileItemType[] = [
  {
    name: "AnnotatedSettingsExample.tsx",
    path: "examples/AnnotatedSettingsExample.tsx",
    code: AnnotatedSettingsExampleRaw,
  },
  {
    name: "NavigationSettingsExample.tsx",
    path: "examples/NavigationSettingsExample.tsx",
    code: NavigationSettingsExampleRaw,
  },

  {
    name: "AnnotatedSection.tsx",
    path: "partials/AnnotatedSection.tsx",
    code: AnnotatedSectionRaw,
  },
  {
    name: "GeneralSettingsCard.tsx",
    path: "partials/GeneralSettingsCard.tsx",
    code: GeneralSettingsCardRaw,
  },
  {
    name: "NotificationSettingsCard.tsx",
    path: "partials/NotificationSettingsCard.tsx",
    code: NotificationSettingsCardRaw,
  },
  {
    name: "SecuritySettingsCard.tsx",
    path: "partials/SecuritySettingsCard.tsx",
    code: SecuritySettingsCardRaw,
  },
  {
    name: "DangerZoneCard.tsx",
    path: "partials/DangerZoneCard.tsx",
    code: DangerZoneCardRaw,
  },
  {
    name: "SettingsSaveBar.tsx",
    path: "partials/SettingsSaveBar.tsx",
    code: SettingsSaveBarRaw,
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

export const settingsBlocks: ComponentEntry[] = [
  {
    name: "Settings Layout",
    slug: "settings-layout",
    category: "Layouts",
    description:
      "Production-ready Shopify settings page layouts composed with Corex UI components, supporting annotated two-column and vertical navigation patterns.",
    examples: [
      {
        title: "Annotated Two-Column Settings",
        Example: AnnotatedSettingsExample,
        code: AnnotatedSettingsExampleRaw,
        filename: "AnnotatedSettingsExample.tsx",
        files: blockFiles,
        npxCommand: "npx @xco-agency/corex-ui add settings-layout",
      },
      {
        title: "Vertical Navigation Settings",
        Example: NavigationSettingsExample,
        code: NavigationSettingsExampleRaw,
        filename: "NavigationSettingsExample.tsx",
        files: blockFiles,
        npxCommand: "npx @xco-agency/corex-ui add settings-layout",
      },
    ],
  },
];

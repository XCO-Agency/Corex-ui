import type { ComponentEntry, FileItemType } from "../types";

import { IntegrationsHubExample } from "@/blocks/integrations-hub/examples/IntegrationsHubExample";
import IntegrationsHubExampleRaw from "@/blocks/integrations-hub/examples/IntegrationsHubExample.tsx?raw";

import IntegrationCategoryTabsRaw from "@/blocks/integrations-hub/partials/IntegrationCategoryTabs.tsx?raw";
import IntegrationCardRaw from "@/blocks/integrations-hub/partials/IntegrationCard.tsx?raw";
import IntegrationConfigModalRaw from "@/blocks/integrations-hub/partials/IntegrationConfigModal.tsx?raw";
import WebhookLogCardRaw from "@/blocks/integrations-hub/partials/WebhookLogCard.tsx?raw";
import constantsRaw from "@/blocks/integrations-hub/constants.ts?raw";
import typesRaw from "@/blocks/integrations-hub/types.ts?raw";
import indexRaw from "@/blocks/integrations-hub/index.ts?raw";

const blockFiles: FileItemType[] = [
  {
    name: "IntegrationsHubExample.tsx",
    path: "examples/IntegrationsHubExample.tsx",
    code: IntegrationsHubExampleRaw,
  },
  {
    name: "IntegrationCategoryTabs.tsx",
    path: "partials/IntegrationCategoryTabs.tsx",
    code: IntegrationCategoryTabsRaw,
  },
  {
    name: "IntegrationCard.tsx",
    path: "partials/IntegrationCard.tsx",
    code: IntegrationCardRaw,
  },
  {
    name: "IntegrationConfigModal.tsx",
    path: "partials/IntegrationConfigModal.tsx",
    code: IntegrationConfigModalRaw,
  },
  {
    name: "WebhookLogCard.tsx",
    path: "partials/WebhookLogCard.tsx",
    code: WebhookLogCardRaw,
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

export const integrationsBlocks: ComponentEntry[] = [
  {
    name: "Integrations Hub",
    slug: "integrations-hub",
    category: "Layouts",
    description:
      "App integrations and webhooks directory with service filter tabs, connection status indicators, live sync toggles, API key credentials modal, and webhook delivery log table.",
    examples: [
      {
        title: "App Integrations & Webhooks Hub",
        Example: IntegrationsHubExample,
        code: IntegrationsHubExampleRaw,
        filename: "IntegrationsHubExample.tsx",
        files: blockFiles,
        npxCommand: "npx @xco-agency/corex-ui@latest add integrations-hub",
      },
    ],
  },
];

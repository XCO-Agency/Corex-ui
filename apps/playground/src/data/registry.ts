import { actionsComponents } from "./categories/actions";
import { formsComponents } from "./categories/forms";
import { layoutComponents } from "./categories/layout";
import { feedbackComponents } from "./categories/feedback";
import { mediaComponents } from "./categories/media";
import { overlaysComponents } from "./categories/overlays";
import { typographyComponents } from "./categories/typography";
import { navigationComponents } from "./categories/navigation";
import { appBridgeComponents } from "./categories/app-bridge";
import { settingsBlocks } from "./blocks/settings";
import { resourceTableBlocks } from "./blocks/resource-table";
import { pricingBlocks } from "./blocks/pricing";
import { integrationsBlocks } from "./blocks/integrations";
import { activityFeedBlocks } from "./blocks/activity-feed";
import { metricsBlocks } from "./blocks/metrics";
import { onboardingBlocks } from "./blocks/onboarding";
import { discountRulesBlocks } from "./blocks/discount-rules";
import { workflowBuilderBlocks } from "./blocks/workflow-builder";
import { notificationTemplatesBlocks } from "./blocks/notification-templates";
import { subscriptionManagementBlocks } from "./blocks/subscription-management";
import { appCrossSellBlocks } from "./blocks/app-cross-sell";
import { videoTutorialBlocks } from "./blocks/video-tutorial";
import { supportHubBlocks } from "./blocks/support-hub";
import type { ComponentEntry } from "./types";

export { categories } from "./types";
export type { Category, ComponentEntry, ComponentExample } from "./types";

/**
 * Combines every category's components into one flat list, in the same
 * order the sidebar/overview iterate `categories`. Add a new component by
 * adding it to (or creating) its category file under `data/categories/`, not
 * by editing this file.
 */
export const registry: ComponentEntry[] = [
  ...actionsComponents,
  ...formsComponents,
  ...layoutComponents,
  ...feedbackComponents,
  ...mediaComponents,
  ...overlaysComponents,
  ...typographyComponents,
  ...navigationComponents,
  ...appBridgeComponents,
];

export type BlockGroupType = {
  category: string;
  components: ComponentEntry[];
};

export const blocks: BlockGroupType[] = [
  {
    category: "E-Commerce & Merchandising",
    components: [
      ...discountRulesBlocks,
      ...pricingBlocks,
    ],
  },
  {
    category: "Marketing & Automation",
    components: [
      ...workflowBuilderBlocks,
      ...notificationTemplatesBlocks,
    ],
  },
  {
    category: "Operations & Logistics",
    components: [
      ...integrationsBlocks,
    ],
  },
  {
    category: "Billing & SaaS",
    components: subscriptionManagementBlocks,
  },
  {
    category: "Layouts & Administration",
    components: [
      ...settingsBlocks,
      ...resourceTableBlocks,
      ...activityFeedBlocks,
    ],
  },
  {
    category: "Metrics",
    components: metricsBlocks,
  },
  {
    category: "Onboarding",
    components: onboardingBlocks,
  },
  {
    category: "Growth & Ecosystem",
    components: [
      ...appCrossSellBlocks,
      ...videoTutorialBlocks,
      ...supportHubBlocks,
    ],
  },
];

export const allEntries: ComponentEntry[] = [
  ...registry,
  ...blocks.flatMap((b) => b.components),
];

export function findEntryBySlug(slug: string): ComponentEntry | undefined {
  return (
    registry.find((item) => item.slug === slug) ??
    blocks.flatMap((b) => b.components).find((item) => item.slug === slug)
  );
}

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
import { productIndexBlocks } from "./blocks/product-index";
import { pricingBlocks } from "./blocks/pricing";
import { integrationsBlocks } from "./blocks/integrations";
import { activityFeedBlocks } from "./blocks/activity-feed";
import { metricsBlocks } from "./blocks/metrics";
import { onboardingBlocks } from "./blocks/onboarding";
import { onboardingNewBlocks } from "./blocks/onboarding-new";
import { notificationTemplatesBlocks } from "./blocks/notification-templates";
import { appCrossSellBlocks } from "./blocks/app-cross-sell";
import { videoTutorialBlocks } from "./blocks/video-tutorial";
import { supportHubBlocks } from "./blocks/support-hub";
import { cardsBlocks } from "./blocks/cards";
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

const byName = (a: ComponentEntry, b: ComponentEntry) => a.name.localeCompare(b.name);

/**
 * Ready-made blocks, grouped by what they are for. Group order is fixed;
 * blocks inside a group are sorted by name.
 */
export const blocks: BlockGroupType[] = [
  {
    category: "Onboarding",
    components: [...onboardingBlocks, ...onboardingNewBlocks],
  },
  {
    category: "Settings",
    components: [
      ...settingsBlocks,
      ...integrationsBlocks,
      ...notificationTemplatesBlocks,
      ...pricingBlocks,
    ],
  },
  {
    category: "Layouts",
    components: [
      ...productIndexBlocks,
      ...cardsBlocks,
      ...activityFeedBlocks,
      ...supportHubBlocks,
      ...videoTutorialBlocks,
      ...appCrossSellBlocks,
    ],
  },
  {
    category: "Analytics",
    components: metricsBlocks,
  },
].map((group) => ({ ...group, components: [...group.components].sort(byName) }));

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

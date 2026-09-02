import { actionsComponents } from "./categories/actions";
import { formsComponents } from "./categories/forms";
import { layoutComponents } from "./categories/layout";
import { feedbackComponents } from "./categories/feedback";
import { mediaComponents } from "./categories/media";
import { overlaysComponents } from "./categories/overlays";
import { typographyComponents } from "./categories/typography";
import { navigationComponents } from "./categories/navigation";
import { appBridgeComponents } from "./categories/app-bridge";
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

export const blocks = [];

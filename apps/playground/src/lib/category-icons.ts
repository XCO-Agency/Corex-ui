import type { IconType } from "@xco-agency/corex-ui";

export const CATEGORY_ICONS: Record<string, IconType> = {
  Actions: "button",
  Forms: "forms",
  Layout: "layout-block",
  Feedback: "chat",
  Media: "image",
  Overlays: "layout-popup",
  Typography: "text",
  Navigation: "compass",
  "App Bridge": "store",
  Layouts: "layout-columns-2",
  Settings: "settings",
  Metrics: "chart-vertical",
  Onboarding: "rocket",
  Utilities: "code",
  "Growth & Ecosystem": "star",
  Analytics: "chart-vertical",
};

export function getCategoryIcon(category: string): IconType {
  return CATEGORY_ICONS[category] ?? "categories";
}

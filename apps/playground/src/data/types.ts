export const categories = [
  "Actions",
  "Forms",
  "Layout",
  "Feedback",
  "Media",
  "Overlays",
  "Typography",
  "Navigation",
  "App Bridge",
] as const;

export type CategoryType = (typeof categories)[number];
export type Category = CategoryType;

export type ComponentExampleType = {
  title: string;
  Example: React.ComponentType;
};
export type ComponentExample = ComponentExampleType;

export type ComponentEntryType = {
  name: string;
  slug: string;
  category: CategoryType;
  description: string;
  examples: ComponentExampleType[];
  /**
   * True for components whose live behavior only works inside a real
   * embedded Shopify admin session (App Bridge's `window.shopify` global,
   * `s-app-window`'s loaded content). The example still renders real,
   * copyable code, but the detail page shows a note instead of pretending
   * the interaction works in this standalone playground.
   */
  requiresEmbeddedContext?: boolean;
};
export type ComponentEntry = ComponentEntryType;

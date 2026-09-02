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

export type Category = (typeof categories)[number];

export interface ComponentExample {
  title: string;
  code: string;
  Example: React.ComponentType;
}

export interface ComponentEntry {
  name: string;
  slug: string;
  category: Category;
  description: string;
  examples: ComponentExample[];
  /**
   * True for components whose live behavior only works inside a real
   * embedded Shopify admin session (App Bridge's `window.shopify` global,
   * `s-app-window`'s loaded content). The example still renders real,
   * copyable code, but the detail page shows a note instead of pretending
   * the interaction works in this standalone playground.
   */
  requiresEmbeddedContext?: boolean;
}

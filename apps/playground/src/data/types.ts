export const categories = [
  "Actions",
  "Forms",
  "Layout",
  "Charts",
  "Feedback",
  "Media",
  "Overlays",
  "Typography",
  "Navigation",
  "App Bridge",
] as const;

export type CategoryType =
  (typeof categories)[number] | "Layouts" | "Metrics" | (string & {});
export type Category = CategoryType;

export type FileItemType = {
  name: string;
  path: string;
  code: string;
};

/**
 * How the preview frame places an example. `centered` suits small content
 * (most components); `full` gives the example the whole frame (blocks, pages,
 * tables). The frame applies it, so examples carry no centering code.
 */
export type PreviewLayoutType = "centered" | "full";

export type ComponentExampleType = {
  title: string;
  Example: React.ComponentType;
  /** Raw source code of the component, imported via Vite ?raw */
  code?: string;
  /** Optional filename, e.g. "ButtonVariants.tsx" */
  filename?: string;
  /** Optional files structure for future multi-file blocks */
  files?: FileItemType[];
  /** Optional npx command for blocks */
  npxCommand?: string;
  /** Overrides the entry's `layout` for this example. */
  layout?: PreviewLayoutType;
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
  /**
   * Preview placement for the entry's examples. Defaults to `centered` for
   * components and `full` for blocks (examples with an `npxCommand`).
   */
  layout?: PreviewLayoutType;
  /**
   * A compact example used only for the Overview tile image, when the first
   * example is too large to read at that size.
   */
  thumbnail?: React.ComponentType;
};
export type ComponentEntry = ComponentEntryType;

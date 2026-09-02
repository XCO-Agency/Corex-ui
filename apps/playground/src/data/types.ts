export const categories = [
  "Actions",
  "Forms",
  "Layout",
  "Feedback",
  "Overlays",
  "Typography",
  "Navigation",
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
}

export type CanvasViewportType = "100%" | "768px" | "375px";

export type TocItemType = {
  id: string;
  title: string;
  level?: number;
};

export type ComponentNavigationItemType = {
  name: string;
  slug: string;
  category: string;
} | null | undefined;

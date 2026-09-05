import {
  MousePointerClick,
  CheckSquare,
  LayoutGrid,
  MessageSquare,
  Image,
  SquareStack,
  Type,
  Compass,
  ShoppingBag,
  Layers,
  SlidersHorizontal,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";
import type { CategoryType } from "@/data/types";

export const CATEGORY_ICONS: Record<CategoryType, LucideIcon> = {
  Actions: MousePointerClick,
  Forms: CheckSquare,
  Layout: LayoutGrid,
  Feedback: MessageSquare,
  Media: Image,
  Overlays: SquareStack,
  Typography: Type,
  Navigation: Compass,
  "App Bridge": ShoppingBag,
  Layouts: SlidersHorizontal,
  Settings: SlidersHorizontal,
  Metrics: TrendingUp,
};

export function getCategoryIcon(category: string): LucideIcon {
  return CATEGORY_ICONS[category] ?? Layers;
}

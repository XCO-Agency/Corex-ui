import type { ReactNode } from "react";
import type { ToneType } from "@xco-agency/corex-ui";

export type CardVariantType = "minimalist" | "media" | "media-actions";

export type CardBadgeToneType = "info" | "success" | "warning" | "critical" | "neutral" | ToneType;

export type CardBadgeType = {
  text: string;
  tone?: CardBadgeToneType;
};

export type CardActionType = {
  content: string;
  onAction?: () => void;
  url?: string;
  disabled?: boolean;
  loading?: boolean;
  destructive?: boolean;
};

export type CardItemDataType = {
  id: string;
  title: string;
  description: string;
  badge?: CardBadgeType;
  metaText?: string;
  imageUrl?: string;
  imageAlt?: string;
  primaryAction?: CardActionType;
  secondaryAction?: CardActionType;
};

export type BlockCardPropsType = {
  variant?: CardVariantType;
  title: string;
  description: string;
  badge?: CardBadgeType;
  metaText?: string;
  imageUrl?: string;
  imageAlt?: string;
  primaryAction?: CardActionType;
  secondaryAction?: CardActionType;
  selectable?: boolean;
  selected?: boolean;
  onSelectChange?: (selected: boolean) => void;
  onOptionsClick?: () => void;
  children?: ReactNode;
};

export type MinimalistCardPropsType = {
  title: string;
  description: string;
  badge?: CardBadgeType;
  metaText?: string;
  selectable?: boolean;
  selected?: boolean;
  onSelectChange?: (selected: boolean) => void;
  onOptionsClick?: () => void;
  children?: ReactNode;
};

export type MediaCardPropsType = {
  title: string;
  description: string;
  imageUrl: string;
  imageAlt?: string;
  badge?: CardBadgeType;
  metaText?: string;
  selectable?: boolean;
  selected?: boolean;
  onSelectChange?: (selected: boolean) => void;
  onOptionsClick?: () => void;
  children?: ReactNode;
};

export type MediaActionCardPropsType = {
  title: string;
  description: string;
  imageUrl: string;
  imageAlt?: string;
  badge?: CardBadgeType;
  metaText?: string;
  primaryAction?: CardActionType;
  secondaryAction?: CardActionType;
  selectable?: boolean;
  selected?: boolean;
  onSelectChange?: (selected: boolean) => void;
  onOptionsClick?: () => void;
  children?: ReactNode;
};

export type SelectableCardPropsType = {
  title: string;
  description?: string;
  imageUrl: string;
  imageAlt?: string;
  selected?: boolean;
  onSelectChange?: (selected: boolean) => void;
  onTitleChange?: (newTitle: string) => void;
};

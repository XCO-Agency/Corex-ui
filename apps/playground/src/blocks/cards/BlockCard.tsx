import { MinimalistCard, type CardBadgeType } from "./partials/MinimalistCard";
import { MediaCard } from "./partials/MediaCard";
import { MediaActionCard, type CardActionType } from "./partials/MediaActionCard";
import type { ReactNode } from "react";

export type CardVariantType = "minimalist" | "media" | "media-actions";

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

export function BlockCard({
  variant = "minimalist",
  title,
  description,
  badge,
  metaText,
  imageUrl,
  imageAlt,
  primaryAction,
  secondaryAction,
  selectable,
  selected,
  onSelectChange,
  onOptionsClick,
  children,
}: BlockCardPropsType) {
  if (variant === "media-actions" && imageUrl) {
    return (
      <MediaActionCard
        title={title}
        description={description}
        imageUrl={imageUrl}
        imageAlt={imageAlt}
        badge={badge}
        metaText={metaText}
        primaryAction={primaryAction}
        secondaryAction={secondaryAction}
        selectable={selectable}
        selected={selected}
        onSelectChange={onSelectChange}
        onOptionsClick={onOptionsClick}
      >
        {children}
      </MediaActionCard>
    );
  }

  if (variant === "media" && imageUrl) {
    return (
      <MediaCard
        title={title}
        description={description}
        imageUrl={imageUrl}
        imageAlt={imageAlt}
        badge={badge}
        metaText={metaText}
        selectable={selectable}
        selected={selected}
        onSelectChange={onSelectChange}
        onOptionsClick={onOptionsClick}
      >
        {children}
      </MediaCard>
    );
  }

  return (
    <MinimalistCard
      title={title}
      description={description}
      badge={badge}
      metaText={metaText}
      selectable={selectable}
      selected={selected}
      onSelectChange={onSelectChange}
      onOptionsClick={onOptionsClick}
    >
      {children}
    </MinimalistCard>
  );
}

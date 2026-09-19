import { MinimalistCard } from "./partials/MinimalistCard";
import { MediaCard } from "./partials/MediaCard";
import { MediaActionCard } from "./partials/MediaActionCard";
import type { BlockCardPropsType } from "./types";

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

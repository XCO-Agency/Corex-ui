import type { CSSProperties, ReactNode } from "react";
import type { StackGapType } from "../../types/common";

export type ResourceListPropsType<T = unknown> = {
  items?: T[];
  renderItem?: (item: T, id: string, index: number) => ReactNode;
  /** Used for the list's accessible name. */
  resourceName?: { singular: string; plural: string };
  /** Replaces the whole list when there are no items. */
  emptyState?: ReactNode;
  loading?: boolean;
  gap?: StackGapType;
  id?: string;
  className?: string;
  style?: CSSProperties;
};

export type ResourceItemPropsType = {
  children?: ReactNode;
  id?: string;
  /** Renders the item as a link instead of a button. */
  url?: string;
  onClick?: () => void;
  accessibilityLabel?: string;
  /** Leading content: an avatar, thumbnail or icon. */
  media?: ReactNode;
  /** @deprecated v12 kept row actions visible; pass them in `children`. */
  persistActions?: boolean;
  /** @deprecated v12's row actions; pass them in `children`. */
  shortcutActions?: unknown;
  /** @deprecated No `s-clickable` equivalent. */
  verticalAlignment?: string;
  selected?: boolean;
  className?: string;
  style?: CSSProperties;
};

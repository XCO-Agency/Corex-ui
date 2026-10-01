import type { CSSProperties, ReactNode } from "react";
import type { IconType } from "../../types/common";
import type { IconSourceType } from "../Icon/Icon.types";

export type ActionListItemType = {
  content?: ReactNode;
  onAction?: () => void;
  /** An icon name, or a Polaris SVG component. */
  icon?: IconType | IconSourceType;
  destructive?: boolean;
  disabled?: boolean;
  /** Renders the item as a link. */
  url?: string;
  /** A second line under the label. */
  helpText?: ReactNode;
  /** Marks the current choice, e.g. the active sort. */
  active?: boolean;
  prefix?: ReactNode;
  suffix?: ReactNode;
};

export type ActionListSectionType = {
  title?: ReactNode;
  items: ActionListItemType[];
};

export type ActionListPropsType = {
  items?: ActionListItemType[];
  sections?: ActionListSectionType[];
  /** @deprecated v12 switched the items between `button` and `menuitem`. */
  actionRole?: string;
  id?: string;
  className?: string;
  style?: CSSProperties;
};

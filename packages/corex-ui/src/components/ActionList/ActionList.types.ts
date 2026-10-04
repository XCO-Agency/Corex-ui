import type {  ReactNode } from "react";
import type { IconType } from "../../types/common";
import type { IconSourceType } from "../Icon/Icon.types";

export type ActionListItemType = {
  content?: ReactNode;
  onAction?: () => void;
  /** An icon name, or a Polaris SVG component. */
  icon?: IconType | IconSourceType;
  destructive?: boolean;
  disabled?: boolean;
  /** @deprecated prefer using `href` */
  url?: string;

  /** Renders the item as a link. */
  href?: string;
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
  /** @deprecated prefer using `children` */
  activator?: ReactNode;

  /**
   * The trigger of action list popover. It will auto wrap the trigger in a Popover
   */
  children?: ReactNode;

  /** The list of action items. */
  items?: ActionListItemType[];

  /** The list of action sections. */
  sections?: ActionListSectionType[];

  /** The ID of the list. */
  id?: string;
};

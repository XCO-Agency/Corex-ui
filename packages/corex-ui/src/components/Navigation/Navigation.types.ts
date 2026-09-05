import type * as React from "react";
import type { IconSourceType } from "../Icon/Icon.types";

export type NavigationItemType = {
  id: string;
  label: string;
  /** Polaris icon name (e.g. `"import"`, `"search"`, `"star"`) or Polaris SVG component */
  icon?: IconSourceType;
  url?: string;
  badge?: React.ReactNode;
  disabled?: boolean;
  selected?: boolean;
  onClick?: () => void;
  subItems?: NavigationItemType[];
};

export type NavigationSectionType = {
  title?: string;
  items: NavigationItemType[];
  action?: {
    icon?: IconSourceType;
    accessibilityLabel?: string;
    onClick?: () => void;
  };
};

export type NavigationPropsType = {
  sections: NavigationSectionType[];
  selectedId?: string;
  onSelect?: (id: string) => void;
  searchable?: boolean;
  searchPlaceholder?: string;
  searchValue?: string;
  onSearchChange?: (val: string) => void;
  children?: React.ReactNode;
  id?: string;
};

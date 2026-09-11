import type * as React from "react";
import type { IconType, PolarisPropsType } from "../../types/common";
import { BoxPropsType } from "../Box";

export type NavigationItemPropsType = {
  id?: string;
  label?: string;
  /** Polaris icon name (e.g. `"import"`, `"search"`, `"star"`) or Polaris SVG component */
  icon?: IconType;
  url?: string;
  badge?: React.ReactNode;
  disabled?: boolean;
  selected?: boolean;
  onClick?: () => void;
  children?: React.ReactNode;
  ariaLabel?: string;
};

export type NavigationItemType = NavigationItemPropsType;

export type NavigationActionType =
  | {
      icon?: IconType;
      accessibilityLabel?: string;
      onClick?: () => void;
    }
  | React.ReactNode;

export type NavigationLabelPropsType = {
  children?: React.ReactNode;
  action?: NavigationActionType;
};

import type { SearchFieldPropsType } from "../SearchField";

export type NavigationSectionPropsType = {
  title?: string;
  action?: NavigationActionType;
  items?: NavigationItemPropsType[];
  children?: React.ReactNode;
};

export type NavigationSectionType = NavigationSectionPropsType;

export type NavigationSearchPropsType = SearchFieldPropsType;

export type NavigationFooterPropsType = {
  children?: React.ReactNode;
  divider?: boolean;
  className?: string;
  style?: React.CSSProperties;
};

export type NavigationContextType = {
  search?: string;
  setSearch?: (val: string) => void;
  selectedId?: string;
  onSelect?: (id: string) => void;
};

export type NavigationPropsType = BoxPropsType & {
  defaultSelected?: string;
  sectionned?: boolean;
  sticky?: boolean | number;
};

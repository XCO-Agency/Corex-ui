import type * as React from "react";
import type { IconType, PolarisPropsType } from "../../types/common";
import { BoxPropsType } from "../Box";
import type { SearchFieldPropsType } from "../SearchField";

export type NavigationItemPropsType<TId extends string | number = string> = {
  id?: TId;
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

export type NavigationItemType<TId extends string | number = string> = NavigationItemPropsType<TId>;

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

export type NavigationSectionPropsType<TId extends string | number = string> = {
  title?: string;
  action?: NavigationActionType;
  items?: NavigationItemPropsType<TId>[];
  children?: React.ReactNode;
};

export type NavigationSectionType<TId extends string | number = string> = NavigationSectionPropsType<TId>;

export type NavigationSearchPropsType = SearchFieldPropsType;

export type NavigationFooterPropsType = {
  children?: React.ReactNode;
  divider?: boolean;
  className?: string;
  style?: React.CSSProperties;
};

export type NavigationContextType<TId extends string | number = string> = {
  search?: string;
  setSearch?: (val: string) => void;
  selectedId?: TId;
  onSelect?: (id: TId) => void;
};

export type NavigationPropsType<TId extends string | number = string> = BoxPropsType & {
  /** Currently selected navigation item ID (controlled mode). */
  selected?: TId;
  /** Initial selected navigation item ID (uncontrolled mode). */
  defaultSelected?: TId;
  /** Callback fired when the selected navigation item changes. */
  onChange?: (selected: TId) => void;
  /** Callback fired when the selected navigation item changes. Alias for `onChange`. */
  onSelect?: (selected: TId) => void;
  /** Callback fired when the selected navigation item changes. Alias for `onChange`. */
  onChanged?: (selected: TId) => void;
  sectionned?: boolean;
  sticky?: boolean | number;
};

export type NavigationItemComponentType = {
  <TId extends string | number = string>(
    props: NavigationItemPropsType<TId> & { ref?: React.Ref<HTMLElement> },
  ): React.ReactElement | null;
  displayName?: string;
};

export type NavigationComponentType = {
  <TId extends string | number = string>(
    props: NavigationPropsType<TId> & { ref?: React.Ref<HTMLElement> },
  ): React.ReactElement | null;
  displayName?: string;
  Item: NavigationItemComponentType;
  Label: React.ForwardRefExoticComponent<
    NavigationLabelPropsType & React.RefAttributes<HTMLDivElement>
  >;
  Section: React.ForwardRefExoticComponent<
    NavigationSectionPropsType<any> & React.RefAttributes<HTMLDivElement>
  >;
  Search: React.ForwardRefExoticComponent<
    NavigationSearchPropsType & React.RefAttributes<HTMLElement>
  >;
  Footer: React.ForwardRefExoticComponent<
    NavigationFooterPropsType & React.RefAttributes<HTMLDivElement>
  >;
};


import type { ReactNode } from "react";

export type TabItemType = {
  id: string | number;
  content?: ReactNode;
  label?: string;
  description?: string;
  badge?: string | number;
  icon?: ReactNode;
  disabled?: boolean;
  accessibilityLabel?: string;
};

export type TabDescriptor = TabItemType;

export type TabsPropsType<T = string | number> = {
  tabs: TabItemType[];
  /** Index of the selected tab (legacy numeric 0-indexed API). */
  selected?: number;
  /** Callback with the index of the selected tab (legacy API). */
  onSelect?: (selectedTabIndex: number) => void;
  /** ID of the currently selected tab (extended API). */
  selectedTab?: T | null;
  /** Callback when a tab ID changes (extended API). */
  onTabChange?: (tabId: T) => void;
  showBadge?: boolean;
  showContent?: boolean;
  showTooltip?: boolean;
  rightSide?: ReactNode;
  /** Content of the currently selected tab's panel. */
  children?: ReactNode;
  className?: string;
  id?: string;
};

export type TabsProps<T = string | number> = TabsPropsType<T>;

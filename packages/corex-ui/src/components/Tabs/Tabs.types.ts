import type { ReactNode } from "react";
import { IconType } from "../../types/common";

export type TabItemType = {
  id: string | number;
  content?: ReactNode;
  label?: string;
  tooltip?: string;
  badge?: string | number;
  icon?: IconType;
  disabled?: boolean;
  accessibilityLabel?: string;
};

export type TabsPropsType<T = string | number> = {
  tabs: TabItemType[];
  /** @deprecated selected use selectedTab instead */
  selected?: number;
  /** @deprecated onSelect use onTabChange instead  */
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

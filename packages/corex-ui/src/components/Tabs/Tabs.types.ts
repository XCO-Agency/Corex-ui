import type { ReactNode } from "react";
import { IconType, ToneType } from "../../types/common";

export type TabItemType = {
  id: string | number;
  label?: string;
  tooltip?: string;
  icon?: IconType;
  badge?: ReactNode;
  badgeTone?: ToneType;
  disabled?: boolean;
  accessibilityLabel?: string;
};

export type TabsPropsType = {
  tabs: TabItemType[];
  /** ID of the currently selected tab (extended API). */
  selected?: number | null;
  /** Callback when a tab ID changes (extended API). */
  onSelect?: (index: number) => void;
  showBadge?: boolean;
  rightSide?: ReactNode;
  /** Content of the currently selected tab's panel. */
  children?: ReactNode;
  className?: string;
  id?: string;
};

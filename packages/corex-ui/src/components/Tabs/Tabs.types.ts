import type { ReactNode } from "react";
import { IconType, ToneType } from "../../types/common";

export type TabItemType<TId extends string | number = string> = {
  id: TId;
  label?: string;
  tooltip?: string;
  icon?: IconType;
  badge?: ReactNode;
  badgeTone?: ToneType;
  disabled?: boolean;
  accessibilityLabel?: string;
};

export type TabsPropsType<TId extends string | number = string> = {
  tabs: TabItemType<TId>[];
  /**
   * Index of the currently selected tab (Polaris index-based API).
   * @deprecated Use `value` instead to select tabs by ID.
   */
  selected?: number | null;
  /**
   * Callback when a tab index changes (Polaris index-based API).
   * @deprecated Use `onChange` instead to handle selection by tab ID.
   */
  onSelect?: (index: number) => void;
  /** ID of the currently selected tab. */
  value?: TId | null;
  /** Callback when a tab is selected, passing the tab ID. */
  onChange?: (id: TId) => void;
  showBadge?: boolean;
  rightSide?: ReactNode;
  /** Content of the currently selected tab's panel. */
  children?: ReactNode;
  className?: string;
  id?: string;
};

export type TabsComponentType = {
  <TId extends string | number = string>(
    props: TabsPropsType<TId> & { ref?: React.Ref<HTMLDivElement> },
  ): React.ReactElement | null;
  displayName?: string;
};

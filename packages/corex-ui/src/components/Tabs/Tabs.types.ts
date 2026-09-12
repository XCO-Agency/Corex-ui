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
   * Index or ID of the currently selected tab.
   * Can be a tab index (number) for Polaris compatibility or tab ID (`TId`).
   */
  selected?: TId | number | null;
  /**
   * Callback when a tab is selected. Receives tab ID (`TId`) or index (`number`).
   */
  onSelect?: ((selected: TId) => void) | ((index: number) => void);
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

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

/** `segment` = pill track (default). `card` = folder tabs connected to a panel. */
export type TabsVariantType = "segment" | "card";

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
  /**
   * Visual style.
   * - `segment`: pill track with sliding thumb (default)
   * - `card`: folder-style tabs that connect into `Tabs.Content`
   */
  variant?: TabsVariantType;
  showBadge?: boolean;
  rightSide?: ReactNode;
  inlineSize?: "auto" | "fill" | "fit";
  /**
   * Minimalist compact dropdown mode, rendering a dropdown selector button
   * inspired by Shopify Polaris IndexFilters view switcher.
   */
  compact?: boolean;
  /**
   * Bar extras (segment/compact) and/or `Tabs.Content` panels (card variant).
   */
  children?: ReactNode;
  className?: string;
  id?: string;
};

export type TabsContentPropsType = {
  /** Tab id this panel belongs to. */
  value: string | number;
  children?: ReactNode;
  className?: string;
  id?: string;
};

export type TabsContextType = {
  selectedValue: string | number | null | undefined;
  variant: TabsVariantType;
};

export type TabsComponentType = {
  <TId extends string | number = string>(
    props: TabsPropsType<TId> & { ref?: React.Ref<HTMLDivElement> },
  ): React.ReactElement | null;
  displayName?: string;
  Content: React.ForwardRefExoticComponent<
    TabsContentPropsType & React.RefAttributes<HTMLDivElement>
  >;
};

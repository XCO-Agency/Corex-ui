import type { CSSProperties, ReactNode } from "react";

/** v12's mode enum. Only `Default` and `Filtering` ever meant anything here. */
export const IndexFiltersMode = {
  Default: "DEFAULT",
  Filtering: "FILTERING",
  EditingColumns: "EDITING_COLUMNS",
} as const;

export type IndexFiltersModeType =
  (typeof IndexFiltersMode)[keyof typeof IndexFiltersMode];

export type IndexFiltersTabType = {
  id: string;
  content?: ReactNode;
  index?: number;
  isLocked?: boolean;
  /** v12 let a tab carry its own action as well as the parent's `onSelect`. */
  onAction?: () => void;
};

export type IndexFiltersFilterType = {
  key: string;
  label?: ReactNode;
  /** The control shown in the filter's popover, e.g. a `ChoiceList`. */
  filter?: ReactNode;
  shortcut?: boolean;
  pinned?: boolean;
  disabled?: boolean;
};

export type IndexFiltersAppliedFilterType = {
  key: string;
  label?: ReactNode;
  onRemove?: (key: string) => void;
};

export type IndexFiltersSortOptionType = {
  label?: string;
  value: string;
  /** v12's per-direction label, e.g. "Newest first". Preferred over `label`. */
  directionLabel?: string;
};

export type IndexFiltersPropsType = {
  tabs?: IndexFiltersTabType[];
  selected?: number;
  onSelect?: (index: number) => void;

  queryValue?: string;
  queryPlaceholder?: string;
  onQueryChange?: (value: string) => void;
  onQueryClear?: () => void;

  filters?: IndexFiltersFilterType[];
  appliedFilters?: IndexFiltersAppliedFilterType[];
  onClearAll?: () => void;

  sortOptions?: IndexFiltersSortOptionType[];
  sortSelected?: string[];
  onSort?: (value: string[]) => void;

  disabled?: boolean;
  loading?: boolean;
  hideFilters?: boolean;
  hideQueryField?: boolean;

  /** Controls that belong on the filter row but are not filters. */
  trailing?: ReactNode;

  /** @deprecated Saved views have no 2.x equivalent; accepted so call sites compile. */
  mode?: IndexFiltersModeType | string;
  /** @deprecated See `mode`. */
  setMode?: (mode: IndexFiltersModeType | string) => void;
  /** @deprecated See `mode`. */
  canCreateNewView?: boolean;
  /** @deprecated See `mode`. */
  cancelAction?: unknown;
  /** @deprecated See `mode`. */
  primaryAction?: unknown;

  id?: string;
  className?: string;
  style?: CSSProperties;
};

export type UseSetIndexFiltersModeResultType = {
  mode: IndexFiltersModeType | string;
  setMode: (mode: IndexFiltersModeType | string) => void;
};

import type * as React from "react";
import type { ReactNode } from "react";

/**
 * Filter option choice item.
 */
export type IndexFilterOptionType = {
  label: string;
  value: string;
};

/**
 * Filter operator item (e.g. "Is", "Is not").
 */
export type IndexFilterOperatorType = {
  label: string;
  value: string;
};

/**
 * An individual filter definition for the IndexFilters component.
 */
export type IndexFilterItemType = {
  /** Unique key identifying the filter (e.g. "vendor", "tag", "status"). */
  key: string;
  /** Label for the filter (e.g. "Vendor", "Tag", "Status"). */
  label: string;
  /** Custom filter controls rendered inside the filter's value popover (e.g. RangeSlider). */
  filter?: ReactNode;
  /** Predefined options for the value popover (e.g. ["Apple", "Noise", "Sony"]). */
  options?: IndexFilterOptionType[];
  /** Available operators for this filter. Defaults to "Is" / "Is not". */
  operators?: IndexFilterOperatorType[];
  /** Default operator value. Defaults to the first operator. */
  defaultOperator?: string;
  /** Disables the filter in the filters popover. */
  disabled?: boolean;
  /**
   * Whether to allow multiple selections. Defaults to true.
   * If set to false, only one choice can be selected at a time.
   */
  allowMultiple?: boolean;
};

/**
 * An active/applied filter pill (e.g. "Tag is not exclude_search").
 */
export type IndexAppliedFilterType = {
  /** Key matching the filter (e.g. "tag", "vendor"). */
  key: string;
  /** Filter property name (e.g. "Tag", "Vendor"). Defaults to the filter label. */
  field?: string;
  /** Operator value or label (e.g. "is_not", "is not"). */
  operator?: string;
  /** Active value or values (e.g. "exclude_search"). */
  value?: string | string[];
  /** Overrides the value text shown in the pill. */
  label?: string;
  /** Callback fired when the pill is removed (× button or Backspace). */
  onRemove: (key: string) => void;
};

/**
 * Option item for table sorting in the columns/sort popover.
 */
export type IndexFilterSortOptionType = {
  /** Human-readable label (e.g. "Created", "Title"). */
  label: string;
  /** Sort key or value (e.g. "created_at", "title"). */
  value: string;
};

/**
 * Column item for column visibility in the columns popover.
 */
export type IndexFilterColumnItemType = {
  /** Unique column key. */
  key: string;
  /** Column header label (e.g. "Status", "Inventory"). */
  label: string;
  /** Whether the column is currently visible in the table. Defaults to true. */
  visible?: boolean;
  /** Whether the column is locked/disabled and cannot be toggled. */
  disabled?: boolean;
};

/**
 * Props for the unified search and filter input (IndexFilters.SearchField).
 */
export type IndexFiltersSearchFieldPropsType = {
  /** Current search query string. */
  queryValue?: string;
  /** Placeholder text for the search input. Defaults to "search by keywords". */
  queryPlaceholder?: string;
  /** Callback when search query changes. */
  onQueryChange?: (value: string) => void;
  /** Callback when search query is cleared. */
  onQueryClear?: () => void;
  /** Callback on search input blur. */
  onQueryBlur?: () => void;
  /** Callback on search input focus. */
  onQueryFocus?: () => void;
  /** Debounce delay in ms for `onQueryChange`. Defaults to 300. Use 0 for immediate updates. */
  debounceDelay?: number;

  /** Content rendered on the left of the search input, typically `<Tabs compact ... />`. */
  tabs?: ReactNode;

  /** Available filter items. */
  filters?: IndexFilterItemType[];
  /** Currently applied filter pills. */
  appliedFilters?: IndexAppliedFilterType[];
  /**
   * Callback when a filter is picked from the filters popover.
   * `index` is the position in `appliedFilters` where the new pill should be
   * inserted (the caret position between pills when the popover was opened).
   */
  onAddFilter?: (filterKey: string, index: number) => void;
  /** Callback when a filter value is selected in the value popover. */
  onFilterSelect?: (
    filterKey: string,
    value: string | string[],
    operator?: string,
  ) => void;
  /** Callback when a filter operator changes. */
  onOperatorChange?: (filterKey: string, operator: string) => void;
  /** Callback when the user clicks "Clear search and filters". */
  onClearAll?: () => void;
  /** Whether the search field is disabled. */
  disabled?: boolean;
  /** Optional DOM element ID. */
  id?: string;
};

// Aliases for backwards compatibility
export type FilterOptionType = IndexFilterOptionType;
export type FilterOperatorType = IndexFilterOperatorType;
export type FilterItemType = IndexFilterItemType;
export type AppliedFilterType = IndexAppliedFilterType;
export type FilterSortOptionType = IndexFilterSortOptionType;
export type FilterColumnItemType = IndexFilterColumnItemType;
export type FiltersSearchFieldPropsType = IndexFiltersSearchFieldPropsType;

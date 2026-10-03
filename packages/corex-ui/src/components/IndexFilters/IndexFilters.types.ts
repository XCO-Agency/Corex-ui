import type * as React from "react";
import type { ReactNode } from "react";
import type { IconType } from "../../types/common";
import type { BoxPropsType } from "../Box/Box.types";

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
 * Sort option for `IndexFilters.ViewOptionsSort`.
 */
export type IndexFilterSortOptionType = {
  /** Human-readable label (e.g. "Created", "Title"). */
  label: string;
  /** Sort key or value (e.g. "created_at", "title"). */
  value: string;
  /** Disables the option in the select. */
  disabled?: boolean;
};

/**
 * Switch row for `IndexFilters.ViewOptionsToggles` (e.g. "Hide archived").
 */
export type IndexFilterViewToggleItemType = {
  /** Unique toggle key, reported by the section's `onChange`. */
  key: string;
  /** Row label (e.g. "Hide archived"). */
  label: string;
  /** Icon shown before the label. */
  icon?: IconType;
  /** Whether the switch is on. */
  checked: boolean;
  /** Disables the switch. */
  disabled?: boolean;
  /** Per-item change handler; fires alongside the section's `onChange`. */
  onChange?: (checked: boolean) => void;
};

/**
 * Column for `IndexFilters.ViewOptionsColumns`.
 *
 * Keep one array as the single source of truth for the table: `onChange` hands
 * back the full list, reordered and with `visible` updated.
 */
export type IndexFilterColumnItemType = {
  /** Unique column key. */
  key: string;
  /** Column label shown in the list (e.g. "Status", "Inventory"). */
  label: string;
  /** Whether the column is visible in the table. Defaults to true. */
  visible?: boolean;
  /** Whether the column can be hidden. Defaults to true. */
  hideable?: boolean;
  /** Whether the column can be dragged. Defaults to true; fixed columns keep their position. */
  reorderable?: boolean;
};

/**
 * Props for `IndexFilters.ViewOptions`: the popover holding the view sections.
 */
export type IndexFiltersViewOptionsPropsType = {
  /** Sections: `ViewOptionsSort`, `ViewOptionsToggles`, `ViewOptionsColumns` or any content. Dividers are added between them. */
  children?: ReactNode;
  /** Custom trigger element; replaces the default icon button. */
  activator?: React.ReactElement;
  /** Icon of the default trigger button. Defaults to "layout-columns-3". */
  icon?: IconType;
  /** Accessibility label of the default trigger button. Defaults to "View options". */
  accessibilityLabel?: string;
  /** Disables the default trigger button. */
  disabled?: boolean;
  /** Minimum width of the popover content. Defaults to "260px". */
  minInlineSize?: BoxPropsType["minInlineSize"];
  /** Maximum width of the popover content. */
  maxInlineSize?: BoxPropsType["maxInlineSize"];
  /** Popover ID. Auto-generated if omitted. */
  id?: string;
};

/**
 * Props for `IndexFilters.ViewOptionsSort`.
 */
export type IndexFiltersViewOptionsSortPropsType = {
  /** Row label. Defaults to "Sort by". */
  label?: string;
  /** Icon shown before the label. Defaults to "sort". Pass `null` to hide it. */
  icon?: IconType | null;
  options: IndexFilterSortOptionType[];
  /** Selected sort value. */
  value?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
};

/**
 * Props for `IndexFilters.ViewOptionsToggles`.
 */
export type IndexFiltersViewOptionsTogglesPropsType = {
  items: IndexFilterViewToggleItemType[];
  /** Fires with the toggled item's key and its new state. */
  onChange?: (key: string, checked: boolean) => void;
};

/**
 * Props for `IndexFilters.ViewOptionsColumns`.
 */
export type IndexFiltersViewOptionsColumnsPropsType<
  C extends IndexFilterColumnItemType = IndexFilterColumnItemType,
> = {
  /** Columns in display order. */
  columns: C[];
  /** Fires with the full column list after a show/hide or a reorder. */
  onChange?: (columns: C[]) => void;
  /** Section title. Defaults to "Columns". Pass `null` to hide it. */
  title?: ReactNode;
  /** Layout of the list and the drag axis. Defaults to "vertical". */
  direction?: "vertical" | "horizontal";
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

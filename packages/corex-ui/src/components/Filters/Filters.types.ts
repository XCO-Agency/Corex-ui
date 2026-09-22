import type { ReactNode } from "react";

/**
 * Filter option choice item.
 */
export type FilterOptionType = {
  label: string;
  value: string;
};

/**
 * Filter operator item (e.g. "Is", "Is not").
 */
export type FilterOperatorType = {
  label: string;
  value: string;
};

/**
 * An individual filter definition for the Filters component.
 */
export type FilterItemType = {
  /** Unique key identifying the filter (e.g. "vendor", "tag", "status"). */
  key: string;
  /** Label for the filter (e.g. "Vendor", "Tag", "Status"). */
  label: string;
  /** Custom filter controls rendered inside the filter's popover (e.g. ChoiceList, Select, RangeSlider). */
  filter?: ReactNode;
  /** Predefined options for dropdown selection (e.g. ["Apple", "Noise", "Sony"]). */
  options?: FilterOptionType[];
  /** Available operators for this filter (e.g. [{ label: "Is", value: "is" }, { label: "Is not", value: "is_not" }]). */
  operators?: FilterOperatorType[];
  /** Default operator value. Defaults to "is". */
  defaultOperator?: string;
  /**
   * When true, renders a shortcut button directly in the filter bar (e.g. "Vendor ▾").
   * Clicking it opens this filter's popover.
   */
  shortcut?: boolean;
  /** Disables the filter shortcut trigger. */
  disabled?: boolean;
  /** When true, hides the individual clear button in the popover. */
  hideClearButton?: boolean;
  /** Whether the filter is pinned to the shortcut bar. */
  pinned?: boolean;
};

/**
 * An active/applied filter pill (e.g. "Tag is not exclude_search").
 */
export type AppliedFilterType = {
  /** Key matching the filter (e.g. "tag", "vendor"). */
  key: string;
  /** Filter property name if structured (e.g. "Tag", "Vendor"). */
  field?: string;
  /** Operator label if structured (e.g. "is", "is not"). */
  operator?: string;
  /** Active value or values (e.g. "exclude_search"). */
  value?: string | string[];
  /** Display label for the applied filter pill (or custom ReactNode). */
  label?: string | ReactNode;
  /** Callback fired when the user clicks the remove button on this filter pill. */
  onRemove: (key: string) => void;
  /** Optional callback fired when clicking the pill body itself (e.g. to re-open its filter popover). */
  onClick?: (key: string) => void;
  /** Whether this applied filter came from a shortcut. */
  shortcut?: boolean;
};

/**
 * Option item for table sorting in the columns/sort popover.
 */
export type FilterSortOptionType = {
  /** Human-readable label (e.g. "Created", "Title"). */
  label: string;
  /** Sort key or value (e.g. "created_at", "title"). */
  value: string;
  /** Direction (optional, e.g. "asc" | "desc"). */
  direction?: "asc" | "desc";
};

/**
 * Column item for column visibility and reordering in the columns popover.
 */
export type FilterColumnItemType = {
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
 * Props for the comprehensive declarative Filters component.
 */
export type FiltersPropsType<TViewId extends string | number = string> = {
  /** Current search query string. */
  queryValue?: string;
  /** Placeholder text for the search input. Defaults to "search by keywords". */
  queryPlaceholder?: string;
  /** Callback when search query changes. */
  onQueryChange?: (query: string) => void;
  /** Callback when search query is cleared. */
  onQueryClear?: () => void;
  /** Callback on search input blur. */
  onQueryBlur?: () => void;
  /** Callback on search input focus. */
  onQueryFocus?: () => void;
  /** Debounce delay in ms for `onQueryChange`. Default is 0 (immediate). */
  debounceDelay?: number;

  /** Available filter items. */
  filters?: FilterItemType[];
  /** Currently applied filter pills. */
  appliedFilters?: AppliedFilterType[];
  /** Callback when user clicks "Clear all" or "Clear search and filters". */
  onClearAll?: () => void;
  /** Callback when a filter option is selected from the focus dropdown. */
  onFilterSelect?: (filterKey: string, value: string, operator?: string) => void;
  /** Callback when a filter operator changes in the focus dropdown. */
  onOperatorChange?: (filterKey: string, operator: string) => void;

  /** Slot for compact tabs (e.g. `<Tabs compact ... />`). */
  tabs?: ReactNode;
  /** Alias slot for views / tabs content rendered on the left of the search bar. */
  views?: ReactNode;
  /** Generic left slot for custom content rendered on the left of the search bar. */
  leftSlot?: ReactNode;

  /** Available sorting options for the Columns/Sort popover. */
  sortOptions?: FilterSortOptionType[];
  /** Currently active sort value. */
  sortValue?: string;
  /** Callback when sort option changes. */
  onSortChange?: (sortValue: string) => void;

  /** Columns list for the Column visibility popover. */
  columns?: FilterColumnItemType[];
  /** Callback when a column's visibility eye is toggled. */
  onColumnToggle?: (columnKey: string, visible: boolean) => void;

  /** Hide archived switch state in the Columns popover. */
  hideArchived?: boolean;
  /** Callback when hide archived toggle switch changes. */
  onHideArchivedChange?: (checked: boolean) => void;

  /** Callback when clicking the refresh button. */
  onRefresh?: () => void;
  /** Loading state for the refresh button. */
  refreshing?: boolean;

  /** Callback when clicking the Save button. */
  onSave?: () => void;
  /** Whether the Save button is disabled. */
  saveDisabled?: boolean;
  /** Custom label for the save button. Defaults to "Save". */
  saveLabel?: string;

  /** Additional custom actions on the right side. */
  actions?: ReactNode;
  /** Right side slot (overrides default columns, refresh, save if provided). */
  rightSide?: ReactNode;

  /** Disables the entire filter toolbar. */
  disabled?: boolean;
  /** Hides the search field. */
  hideQueryField?: boolean;
  /** Hides the filter shortcuts and filters button. */
  hideFilters?: boolean;
  /** Whether to render border and background around the toolbar. Defaults to false (transparent). */
  border?: boolean;

  /** Composable toolbar elements (e.g. <Filters.SearchField />, <Filters.Actions>). */
  children?: ReactNode;
  /** Optional DOM element ID. */
  id?: string;
  /** Optional class name. */
  className?: string;
};

/**
 * Props for the modular Search subcomponent.
 */
export type FiltersSearchPropsType = {
  value?: string;
  placeholder?: string;
  onChange?: (value: string) => void;
  onBlur?: () => void;
  onFocus?: () => void;
  disabled?: boolean;
  debounceDelay?: number;
  id?: string;
};

/**
 * Props for the unified interactive search and filter input container (Filters.SearchField).
 */
export type FiltersSearchFieldPropsType<T = unknown> = {
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

  /** Slot for compact tabs (e.g. `<Tabs compact ... />`). */
  tabs?: ReactNode;
  /** Alias slot for views / tabs content rendered on the left of the search bar. */
  views?: ReactNode;
  /** Generic left slot for custom content rendered on the left of the search bar. */
  leftSlot?: ReactNode;

  /** Available filter items. */
  filters?: FilterItemType[];
  /** Currently applied filter pills. */
  appliedFilters?: AppliedFilterType[];
  /** Callback when a filter option is selected from the focus dropdown. */
  onFilterSelect?: (filterKey: string, value: string, operator?: string) => void;
  /** Callback when a filter operator changes in the focus dropdown. */
  onOperatorChange?: (filterKey: string, operator: string) => void;
  /** Callback when user clicks "Clear all" or "Clear search and filters". */
  onClearAll?: () => void;
  /** Whether the search field is disabled. */
  disabled?: boolean;
  /** Optional DOM element ID. */
  id?: string;
};

/**
 * Props for the modular Shortcut button subcomponent.
 */
export type FiltersShortcutPropsType = {
  filter: FilterItemType;
  isActive?: boolean;
  disabled?: boolean;
};

/**
 * Props for the modular Applied filters strip subcomponent.
 */
export type FiltersAppliedPropsType = {
  appliedFilters: AppliedFilterType[];
  onClearAll?: () => void;
  clearLabel?: string;
  disabled?: boolean;
};

/**
 * Props for a single Applied filter pill subcomponent.
 */
export type FiltersAppliedPillPropsType = {
  filter: AppliedFilterType;
  disabled?: boolean;
};

/**
 * Props for the Columns & Sort popover subcomponent.
 */
export type FiltersColumnsPopoverPropsType = {
  sortOptions?: FilterSortOptionType[];
  sortValue?: string;
  onSortChange?: (value: string) => void;
  hideArchived?: boolean;
  onHideArchivedChange?: (checked: boolean) => void;
  columns?: FilterColumnItemType[];
  onColumnToggle?: (columnKey: string, visible: boolean) => void;
  disabled?: boolean;
  id?: string;
};

/**
 * Props for the Actions container subcomponent.
 */
export type FiltersActionsPropsType = {
  children?: ReactNode;
};

/**
 * Compound component type definition for Filters.
 */
export type FiltersComponentType = {
  <TViewId extends string | number = string>(
    props: FiltersPropsType<TViewId> & { ref?: React.Ref<HTMLDivElement> },
  ): React.ReactElement | null;
  displayName?: string;
  SearchField: <T = unknown>(
    props: FiltersSearchFieldPropsType<T>,
  ) => React.ReactElement | null;
  Search: React.FC<FiltersSearchPropsType>;
  Shortcut: React.FC<FiltersShortcutPropsType>;
  Applied: React.FC<FiltersAppliedPropsType>;
  AppliedPill: React.FC<FiltersAppliedPillPropsType>;
  Columns: React.FC<FiltersColumnsPopoverPropsType>;
  ColumnsPopover: React.FC<FiltersColumnsPopoverPropsType>;
  Actions: React.FC<FiltersActionsPropsType>;
};

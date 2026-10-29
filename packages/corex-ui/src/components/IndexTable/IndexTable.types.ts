import type { CSSProperties, ReactNode } from "react";
import type { BadgePropsType } from "../Badge";

/** v12's three-argument selection shape, kept so existing handlers still fit. */
export type IndexTableSelectionTypeType = "page" | "single" | "all";

/** Pins a column to the left or right edge while the table scrolls sideways. */
export type IndexTableStickyType = "left" | "right";

export type IndexTableSortDirectionType = "ascending" | "descending";

/** A badge next to a heading's title: its content alone, or content and tone. */
export type IndexTableHeadingBadgeType =
  | ReactNode
  | { content: ReactNode; tone?: BadgePropsType["tone"] };

export type IndexTableHeadingType = {
  id?: string;
  title?: ReactNode;
  /** Shown when the title is hovered or focused; the title gets a dotted underline. */
  tooltip?: ReactNode;
  /** Rendered after the title, e.g. a count or a "New" marker. */
  badge?: IndexTableHeadingBadgeType;
  /** Renders an empty header cell, for a column of controls. */
  hidden?: boolean;
  /** Right-aligns the column. */
  format?: "base" | "currency" | "numeric" | string;
  alignment?: "start" | "center" | "end";
  /** Optional custom width for this column (e.g. "120px", "2fr", "minmax(140px, 1fr)"). */
  width?: string;
  /**
   * Narrowest the column may get, in px. Columns never shrink below it, so a
   * narrow screen scrolls sideways instead of squashing content.
   */
  minWidth?: number;
  /**
   * Widest the column may get, in px. Columns size to their content (cells and
   * heading) between `minWidth` and this; content past it wraps, or truncates
   * with `truncate`. @default 260, or `--cx-it-cell-max-width`
   */
  maxWidth?: number;
  /**
   * Pins the column. A sticky column gets a fixed width (`width` in px, else
   * `minWidth`) so the offsets of neighbouring sticky columns stay exact.
   */
  sticky?: IndexTableStickyType;
  /** Makes the heading a sort toggle; see `sortColumnIndex` / `onSort`. */
  sortable?: boolean;
  /** Direction applied when the column is first sorted. @default "descending" */
  defaultSortDirection?: IndexTableSortDirectionType;
};

export type IndexTableBulkActionType = {
  id?: string;
  content?: ReactNode;
  onAction?: () => void;
  loading?: boolean;
  destructive?: boolean;
  disabled?: boolean;
  icon?: string;
};

export type IndexTablePaginationType = {
  floating?: boolean;
  hasPrevious?: boolean;
  hasNext?: boolean;
  onPrevious?: () => void;
  onNext?: () => void;
  label?: ReactNode;
  previousTooltip?: string;
  nextTooltip?: string;
};

export type IndexTablePropsType = {
  children?: ReactNode;
  /** Headings can be strings or IndexTableHeadingType objects. */
  headings?: (string | ReactNode | IndexTableHeadingType)[];
  /** Direct rows matrix (DataTable format: 2D array of cells). */
  rows?: (ReactNode | string | number)[][];
  /** Column content types (DataTable format: ["text", "numeric", ...]). */
  columnContentTypes?: ("text" | "numeric")[];
  itemCount?: number;
  /** A count, or `"All"` when every row across every page is selected. */
  selectedItemsCount?: number | "All";
  /**
   * - `"single"`: one row, `selection` is its id.
   * - `"page"`: the rows currently shown (header checkbox, "Select page");
   *   `pageIds` lists their ids, sub-rows included. Rows on other pages are
   *   left as they are.
   * - `"all"`: every resource across every page ("Select all", "Deselect all").
   */
  onSelectionChange?: (
    selectionType: IndexTableSelectionTypeType,
    toggleType: boolean,
    selection?: string,
    pageIds?: string[],
  ) => void;
  selectable?: boolean;
  bulkActions?: IndexTableBulkActionType[];
  /** Promoted bulk actions shown directly next to the selection count dropdown. */
  promotedBulkActions?: IndexTableBulkActionType[];
  resourceName?: { singular: string; plural: string };
  loading?: boolean;
  /** Replaces the whole table or body when there are no items. */
  emptyState?: ReactNode;
  /** Pagination controls. */
  pagination?: IndexTablePaginationType;
  /** Optional custom CSS grid template columns (e.g. "44px 2fr 1fr 1fr"). */
  gridTemplateColumns?: string;
  /** Custom footer content (e.g. "Learn more about products" link). */
  footerContent?: ReactNode;
  /** Whether to allow toggling "Show all selected". */
  showAllSelectedToggle?: boolean;
  id?: string;
  className?: string;
  style?: CSSProperties;
  // DataTable compatibility props
  increasedTableDensity?: boolean;
  truncate?: boolean;
  verticalAlign?: "top" | "bottom" | "middle" | "baseline";
  hasZebraStriping?: boolean;
  /** Index of the currently sorted column. */
  sortColumnIndex?: number;
  sortDirection?: IndexTableSortDirectionType;
  /** Called when a sortable heading is clicked, with the column and its next direction. */
  onSort?: (columnIndex: number, direction: IndexTableSortDirectionType) => void;
  /**
   * Turns on drag-to-reorder: each top-level row gets a drag handle (also
   * movable with Alt+↑/↓). Called with the row's old and new index; reorder
   * your data with `reorderItems`.
   */
  onReorder?: (fromIndex: number, toIndex: number) => void;
  /**
   * Keeps the header row (and the bulk bar) pinned to the top of the page
   * while it scrolls. Pass a number to offset it from the top in px, e.g. under
   * a fixed app bar. @default true
   */
  stickyHeader?: boolean | number;
};

/** Background tone used to highlight a row; matches IconTile's tones. */
export type IndexTableRowToneType =
  | "info"
  | "success"
  | "warning"
  | "caution"
  | "critical"
  | "neutral"
  | "subdued";

export type IndexTableRowPropsType = {
  children?: ReactNode;
  id?: string;
  selected?: boolean;
  position?: number;
  onClick?: () => void;
  disabled?: boolean;
  /**
   * Shows this row's selection checkbox. Set `false` for rows that can't be
   * selected, e.g. informational sub-rows. @default true
   */
  selectable?: boolean;
  /**
   * Nested rows (`<IndexTable.Row>` elements) shown under this row when it is
   * expanded — e.g. a product's variants. Adds an expand toggle to the first cell.
   */
  subRows?: ReactNode;
  /** Controlled expanded state for `subRows`. */
  expanded?: boolean;
  /** Initial expanded state when uncontrolled. @default false */
  defaultExpanded?: boolean;
  onExpandedChange?: (expanded: boolean) => void;
  /** Highlights the row with a tone background. Selection still takes precedence. */
  tone?: IndexTableRowToneType;
  /**
   * Highlights the row with a custom colour (any CSS colour, e.g. `"#fef3c7"`).
   * Overrides `tone`; hover darkens it slightly.
   */
  background?: string;
  className?: string;
  style?: CSSProperties;
};

export type IndexTableCellPropsType = {
  children?: ReactNode;
  /**
   * Pins this cell's column. Setting it on any cell pins the whole column,
   * header and selection checkbox included.
   */
  sticky?: IndexTableStickyType;
  flush?: boolean;
  format?: "base" | "currency" | "numeric" | string;
  alignment?: "start" | "center" | "end";
  /**
   * Columns this cell covers, like a native `<td colSpan>`. The next cell
   * starts after them, and a row (or sub-row) only gets filler cells for the
   * columns its cells leave uncovered. Capped at the columns left in the row.
   * Alignment and pinning follow the first column it covers.
   * @default 1
   */
  colSpan?: number;
  className?: string;
  style?: CSSProperties;
};

export type UseIndexResourceStateOptionsType<T> = {
  resourceIDResolver?: (resource: T) => string;
  selectedResources?: string[];
  /**
   * Ids of a resource's nested rows (`subRows`), e.g. its variants. They are
   * included when the whole page or all resources are selected.
   */
  subResourceIDs?: (resource: T) => string[];
};

export type UseIndexResourceStateResultType = {
  selectedResources: string[];
  allResourcesSelected: boolean;
  handleSelectionChange: (
    selectionType: IndexTableSelectionTypeType,
    toggleType: boolean,
    selection?: string,
    pageIds?: string[],
  ) => void;
  clearSelection: () => void;
  removeSelectedResources: (ids: string[]) => void;
};

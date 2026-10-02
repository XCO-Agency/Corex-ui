import type { CSSProperties, ReactNode } from "react";

/** v12's three-argument selection shape, kept so existing handlers still fit. */
export type IndexTableSelectionTypeType = "page" | "single" | "all";

export type IndexTableHeadingType = {
  id?: string;
  title?: ReactNode;
  /** Renders an empty header cell, for a column of controls. */
  hidden?: boolean;
  /** Right-aligns the column. */
  format?: "base" | "currency" | "numeric" | string;
  alignment?: "start" | "center" | "end";
  /** Optional custom width for this column (e.g. "120px", "2fr", "minmax(140px, 1fr)"). */
  width?: string;
};

export type IndexTableBulkActionType = {
  id?: string;
  content?: ReactNode;
  onAction?: () => void;
  destructive?: boolean;
  disabled?: boolean;
  icon?: string;
};

export type IndexTablePaginationType = {
  hasPrevious?: boolean;
  hasNext?: boolean;
  onPrevious?: () => void;
  onNext?: () => void;
  label?: ReactNode;
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
  onSelectionChange?: (
    selectionType: IndexTableSelectionTypeType,
    toggleType: boolean,
    selection?: string,
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
};

export type IndexTableRowPropsType = {
  children?: ReactNode;
  id?: string;
  selected?: boolean;
  position?: number;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  style?: CSSProperties;
};

export type IndexTableCellPropsType = {
  children?: ReactNode;
  flush?: boolean;
  format?: "base" | "currency" | "numeric" | string;
  alignment?: "start" | "center" | "end";
  className?: string;
  style?: CSSProperties;
};

export type UseIndexResourceStateOptionsType<T> = {
  resourceIDResolver?: (resource: T) => string;
  selectedResources?: string[];
};

export type UseIndexResourceStateResultType = {
  selectedResources: string[];
  allResourcesSelected: boolean;
  handleSelectionChange: (
    selectionType: IndexTableSelectionTypeType,
    toggleType: boolean,
    selection?: string,
  ) => void;
  clearSelection: () => void;
  removeSelectedResources: (ids: string[]) => void;
};

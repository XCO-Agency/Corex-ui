import type { CSSProperties, ReactNode } from "react";

/** v12's three-argument selection shape, kept so existing handlers still fit. */
export type IndexTableSelectionTypeType = "page" | "single" | "all";

export type IndexTableHeadingType = {
  title?: ReactNode;
  /** Renders an empty header cell, for a column of controls. */
  hidden?: boolean;
  /** Right-aligns the column, through `s-table-header`'s own `format`. */
  format?: "base" | "currency" | "numeric";
};

export type IndexTableBulkActionType = {
  content?: ReactNode;
  onAction?: () => void;
  destructive?: boolean;
  disabled?: boolean;
};

export type IndexTablePaginationType = {
  hasPrevious?: boolean;
  hasNext?: boolean;
  onPrevious?: () => void;
  onNext?: () => void;
};

export type IndexTablePropsType = {
  children?: ReactNode;
  headings?: IndexTableHeadingType[];
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
  /** v12 drew these ahead of the rest; here they share one row. */
  promotedBulkActions?: IndexTableBulkActionType[];
  resourceName?: { singular: string; plural: string };
  loading?: boolean;
  /** Replaces the whole table when there are no items. */
  emptyState?: ReactNode;
  /** @deprecated `s-table` draws its own rows; striping is not reproduced. */
  hasZebraStriping?: boolean;
  /**
   * v12 took the pager as one object, where `Table` takes flat props. Left in a
   * rest spread it would land on `s-table` as an attribute and the list would
   * simply have no pager.
   */
  pagination?: IndexTablePaginationType;
  id?: string;
  className?: string;
  style?: CSSProperties;
};

export type IndexTableRowPropsType = {
  children?: ReactNode;
  id?: string;
  selected?: boolean;
  /** v12's row index. Not used; `s-table-row` needs no position. */
  position?: number;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  style?: CSSProperties;
};

export type IndexTableCellPropsType = {
  children?: ReactNode;
  /** @deprecated v12 removed the cell's padding; `s-table-cell` has one inset. */
  flush?: boolean;
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

import type { ReactNode } from "react";
import type {
  IndexFilterColumnItemType,
  IndexFilterItemType,
  IndexFilterSortOptionType,
  IndexFiltersSavedViewType,
  IndexTableSortDirectionType,
  TabItemType,
} from "@xco-agency/corex-ui";

export type ProductIndexStatusType = "active" | "draft" | "archived";

export type ProductIndexItemType = {
  id: string;
  title: string;
  imageUrl: string;
  status: ProductIndexStatusType;
  inventory: number;
  variants: number;
  category: string;
  vendor: string;
  productType: string;
  tags: string[];
  channels: number;
  price: number;
  updatedAt: string;
};

/** Built-in status tabs; saved views add their own ids next to these. */
export type ProductIndexStatusTabIdType = "all" | ProductIndexStatusType;

export type ProductIndexFilterKeyType = "status" | "vendor" | "category" | "tag";

export type ProductIndexOperatorType = "is" | "is_not";

/**
 * An applied filter kept in state. `onRemove` callbacks are attached when the
 * filters are handed to `IndexFilters`, so state stays plain and serializable.
 */
export type ProductIndexFilterValueType = {
  key: ProductIndexFilterKeyType;
  operator: ProductIndexOperatorType;
  value: string | string[];
};

export type ProductIndexSortKeyType = "title" | "inventory" | "price" | "updatedAt";

export type ProductIndexSortType = {
  key: ProductIndexSortKeyType;
  direction: IndexTableSortDirectionType;
};

/** A view saved with the built-in IndexFilters save action, rendered as a tab. */
export type ProductIndexSavedViewType = {
  id: string;
  name: string;
  query: string;
  filters: ProductIndexFilterValueType[];
};

export type ProductIndexColumnKeyType =
  | "product"
  | "status"
  | "inventory"
  | "category"
  | "vendor"
  | "productType"
  | "channels"
  | "price"
  | "updatedAt";

export type ProductIndexColumnType = IndexFilterColumnItemType & {
  key: ProductIndexColumnKeyType;
  /** Narrowest the table column may get, in px. */
  minWidth?: number;
  alignment?: "start" | "center" | "end";
  sticky?: "left" | "right";
};

export type ProductIndexFiltersPropsType = {
  tabs: TabItemType[];
  selectedTab: string;
  onSelectTab: (tabId: string) => void;
  query: string;
  onQueryChange: (query: string) => void;
  filterDefinitions: IndexFilterItemType[];
  appliedFilters: ProductIndexFilterValueType[];
  onAppliedFiltersChange: (filters: ProductIndexFilterValueType[]) => void;
  onClearAll: () => void;
  sortOptions: IndexFilterSortOptionType[];
  sort: ProductIndexSortType;
  onSortChange: (sort: ProductIndexSortType) => void;
  hideArchived: boolean;
  onHideArchivedChange: (hide: boolean) => void;
  columns: ProductIndexColumnType[];
  onColumnsChange: (columns: ProductIndexColumnType[]) => void;
  existingViewNames: string[];
  onSaveView: (view: IndexFiltersSavedViewType) => void;
  /** Set when the selected tab is a saved view; shows the delete action. */
  onDeleteView?: () => void;
  onExport: () => void;
  onRefresh: () => void;
  refreshing: boolean;
};

export type ProductIndexTablePropsType = {
  products: ProductIndexItemType[];
  totalCount: number;
  columns: ProductIndexColumnType[];
  selectedIds: string[];
  allSelected: boolean;
  onSelectionChange: (
    selectionType: "page" | "single" | "all",
    toggleType: boolean,
    selection?: string,
    pageIds?: string[],
  ) => void;
  sort: ProductIndexSortType;
  onSortChange: (sort: ProductIndexSortType) => void;
  page: number;
  pageCount: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onBulkStatusChange: (status: ProductIndexStatusType) => void;
  onBulkDelete: () => void;
  onOpenProduct: (product: ProductIndexItemType) => void;
  emptyState: ReactNode;
  loading?: boolean;
};

export type ProductIndexEmptyStatePropsType = {
  onClearAll: () => void;
};

import type * as React from "react";

export type ResourceStatusType = "active" | "draft" | "archived";

export type ResourceItemType = {
  id: string;
  title: string;
  sku: string;
  vendor: string;
  category: string;
  status: ResourceStatusType;
  inventory: number;
  price: string;
  imageUrl?: string;
  updatedAt: string;
};

export type ResourceTabIdType = "all" | "active" | "draft" | "archived";

export type ResourceTabItemType = {
  id: ResourceTabIdType;
  content: string;
  count?: number;
};

export type ResourceFiltersType = {
  query: string;
  tab: ResourceTabIdType;
  status: string;
  category: string;
};

export type ResourceBulkActionType = {
  label: string;
  onAction: (selectedIds: string[]) => void;
  destructive?: boolean;
  disabled?: boolean;
};

export type ResourceViewTabsPropsType = {
  tabs: ResourceTabItemType[];
  selectedTab: ResourceTabIdType;
  onSelectTab: (tabId: ResourceTabIdType) => void;
};

export type ResourceFiltersPropsType = {
  filters: ResourceFiltersType;
  categories: string[];
  hasActiveFilters: boolean;
  onQueryChange: (query: string) => void;
  onStatusChange: (status: string) => void;
  onCategoryChange: (category: string) => void;
  onClearFilters: () => void;
};

export type ResourceBulkActionsPropsType = {
  selectedCount: number;
  totalCount: number;
  onDeselectAll: () => void;
  onBulkStatusChange: (status: ResourceStatusType) => void;
  onBulkDelete: () => void;
};

export type ResourceTablePropsType = {
  items: ResourceItemType[];
  selectedIds: Set<string>;
  allSelected: boolean;
  indeterminate: boolean;
  onToggleSelectAll: () => void;
  onToggleSelectItem: (id: string) => void;
  onDeleteItem?: (id: string) => void;
  onStatusChange?: (id: string, status: ResourceStatusType) => void;
};

export type ResourceTableRowPropsType = {
  item: ResourceItemType;
  isSelected: boolean;
  onToggleSelect: () => void;
  onDelete?: () => void;
  onStatusChange?: (status: ResourceStatusType) => void;
};

export type ResourcePaginationPropsType = {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  onPreviousPage: () => void;
  onNextPage: () => void;
};

export type ResourceEmptyStatePropsType = {
  type: "no-results" | "zero-records";
  query?: string;
  onClearFilters?: () => void;
  onCreateResource?: () => void;
};

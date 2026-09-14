import * as React from "react";
import { Page, Card, BlockStack } from "@xco-agency/corex-ui";
import {
  DEFAULT_PAGE_SIZE,
  MOCK_RESOURCES,
  RESOURCE_CATEGORIES,
} from "../constants";
import { ResourceBulkActions } from "../partials/ResourceBulkActions";
import { ResourceEmptyState } from "../partials/ResourceEmptyState";
import { ResourceFilters } from "../partials/ResourceFilters";
import { ResourcePagination } from "../partials/ResourcePagination";
import { ResourceTable } from "../partials/ResourceTable";
import { ResourceViewTabs } from "../partials/ResourceViewTabs";
import type {
  ResourceFiltersType,
  ResourceItemType,
  ResourceStatusType,
  ResourceTabIdType,
  ResourceTabItemType,
} from "../types";

export function ResourceTableExample() {
  const [items, setItems] = React.useState<ResourceItemType[]>(MOCK_RESOURCES);
  const [filters, setFilters] = React.useState<ResourceFiltersType>({
    query: "",
    tab: "all",
    status: "all",
    category: "All categories",
  });
  const [currentPage, setCurrentPage] = React.useState(1);
  const [selectedIds, setSelectedIds] = React.useState<Set<string>>(new Set());

  const hasActiveFilters =
    filters.query !== "" ||
    filters.status !== "all" ||
    filters.category !== "All categories";

  const handleQueryChange = (query: string) => {
    setFilters((prev) => ({ ...prev, query }));
    setCurrentPage(1);
  };

  const handleStatusChange = (status: string) => {
    setFilters((prev) => ({ ...prev, status }));
    setCurrentPage(1);
  };

  const handleCategoryChange = (category: string) => {
    setFilters((prev) => ({ ...prev, category }));
    setCurrentPage(1);
  };

  const handleTabChange = (tab: ResourceTabIdType) => {
    setFilters((prev) => ({ ...prev, tab }));
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setFilters({
      query: "",
      tab: "all",
      status: "all",
      category: "All categories",
    });
    setCurrentPage(1);
  };

  const filteredItems = React.useMemo(() => {
    return items.filter((item) => {
      // Tab filter
      if (filters.tab !== "all" && item.status !== filters.tab) {
        return false;
      }
      // Status dropdown filter
      if (filters.status !== "all" && item.status !== filters.status) {
        return false;
      }
      // Category dropdown filter
      if (
        filters.category !== "All categories" &&
        item.category !== filters.category
      ) {
        return false;
      }
      // Search query
      if (filters.query.trim()) {
        const q = filters.query.toLowerCase();
        const matchesTitle = item.title.toLowerCase().includes(q);
        const matchesSku = item.sku.toLowerCase().includes(q);
        const matchesVendor = item.vendor.toLowerCase().includes(q);
        if (!matchesTitle && !matchesSku && !matchesVendor) {
          return false;
        }
      }
      return true;
    });
  }, [items, filters]);

  const tabsWithCounts: ResourceTabItemType[] = React.useMemo(() => {
    return [
      { id: "all", content: "All", count: items.length },
      {
        id: "active",
        content: "Active",
        count: items.filter((i) => i.status === "active").length,
      },
      {
        id: "draft",
        content: "Draft",
        count: items.filter((i) => i.status === "draft").length,
      },
      {
        id: "archived",
        content: "Archived",
        count: items.filter((i) => i.status === "archived").length,
      },
    ];
  }, [items]);

  const totalPages = Math.ceil(filteredItems.length / DEFAULT_PAGE_SIZE);
  const paginatedItems = React.useMemo(() => {
    const startIndex = (currentPage - 1) * DEFAULT_PAGE_SIZE;
    return filteredItems.slice(startIndex, startIndex + DEFAULT_PAGE_SIZE);
  }, [filteredItems, currentPage]);

  const pageIds = paginatedItems.map((i) => i.id);
  const allSelected =
    pageIds.length > 0 && pageIds.every((id) => selectedIds.has(id));
  const someSelected =
    pageIds.some((id) => selectedIds.has(id)) && !allSelected;

  const handleToggleSelectAll = () => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (allSelected) {
        pageIds.forEach((id) => next.delete(id));
      } else {
        pageIds.forEach((id) => next.add(id));
      }
      return next;
    });
  };

  const handleToggleSelectItem = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleBulkStatusChange = (status: ResourceStatusType) => {
    setItems((prev) =>
      prev.map((item) =>
        selectedIds.has(item.id) ? { ...item, status } : item,
      ),
    );
    setSelectedIds(new Set());
  };

  const handleBulkDelete = () => {
    setItems((prev) => prev.filter((item) => !selectedIds.has(item.id)));
    setSelectedIds(new Set());
  };

  const handleItemStatusChange = (id: string, status: ResourceStatusType) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status } : item)),
    );
  };

  const handleDeleteItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  };

  const handleAddProduct = () => {
    const newId = `prod-${Date.now()}`;
    const newItem: ResourceItemType = {
      id: newId,
      title: "New Artisan Ceramic Mug",
      sku: `CER-MUG-${Math.floor(100 + Math.random() * 900)}`,
      vendor: "Studio Terra",
      category: "Home & Kitchen",
      status: "active",
      inventory: 25,
      price: "$34.00",
      imageUrl:
        "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=100&h=100&fit=crop",
      updatedAt: "Just now",
    };
    setItems((prev) => [newItem, ...prev]);
  };

  return (
    <Page
      heading="Products"
      subheading="Manage all catalog items, inventory levels, variants, and statuses."
      inlineSize="large"
      primaryAction={{
        content: "Add product",
        onAction: handleAddProduct,
      }}
    >
      <BlockStack gap="base">
        <Card padding="none">
          {/* Status Tabs */}
          <ResourceViewTabs
            tabs={tabsWithCounts}
            selectedTab={filters.tab}
            onSelectTab={handleTabChange}
          />

          {/* Search and Filters */}
          <ResourceFilters
            filters={filters}
            categories={RESOURCE_CATEGORIES}
            hasActiveFilters={hasActiveFilters}
            onQueryChange={handleQueryChange}
            onStatusChange={handleStatusChange}
            onCategoryChange={handleCategoryChange}
            onClearFilters={handleClearFilters}
          />

          {/* Contextual Bulk Action Bar */}
          <ResourceBulkActions
            selectedCount={selectedIds.size}
            totalCount={items.length}
            onDeselectAll={() => setSelectedIds(new Set())}
            onBulkStatusChange={handleBulkStatusChange}
            onBulkDelete={handleBulkDelete}
          />

          {/* Data Table or Empty State */}
          {filteredItems.length === 0 ? (
            <ResourceEmptyState
              type="no-results"
              query={filters.query}
              onClearFilters={handleClearFilters}
            />
          ) : (
            <>
              <ResourceTable
                items={paginatedItems}
                selectedIds={selectedIds}
                allSelected={allSelected}
                indeterminate={someSelected}
                onToggleSelectAll={handleToggleSelectAll}
                onToggleSelectItem={handleToggleSelectItem}
                onDeleteItem={handleDeleteItem}
                onStatusChange={handleItemStatusChange}
              />

              <ResourcePagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={filteredItems.length}
                pageSize={DEFAULT_PAGE_SIZE}
                onPreviousPage={() =>
                  setCurrentPage((p) => Math.max(1, p - 1))
                }
                onNextPage={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
              />
            </>
          )}
        </Card>
      </BlockStack>
    </Page>
  );
}

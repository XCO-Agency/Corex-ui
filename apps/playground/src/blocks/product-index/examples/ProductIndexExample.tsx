import { useMemo, useState } from "react";
import { Banner, BlockStack, Page, useIndexResourceState } from "@xco-agency/corex-ui";
import type { IndexFiltersSavedViewType, TabItemType } from "@xco-agency/corex-ui";
import {
  DEFAULT_PRODUCT_INDEX_SORT,
  MOCK_PRODUCTS,
  PRODUCT_INDEX_COLUMNS,
  PRODUCT_INDEX_FILTERS,
  PRODUCT_INDEX_PAGE_SIZE,
  PRODUCT_INDEX_SORT_OPTIONS,
  PRODUCT_INDEX_STATUS_TABS,
} from "../constants";
import { ProductIndexEmptyState } from "../partials/ProductIndexEmptyState";
import { ProductIndexFilters } from "../partials/ProductIndexFilters";
import { ProductIndexTable } from "../partials/ProductIndexTable";
import { fromSavedFilters, matchesFilters, sortProducts } from "../utils";
import type {
  ProductIndexColumnType,
  ProductIndexFilterValueType,
  ProductIndexItemType,
  ProductIndexSavedViewType,
  ProductIndexSortType,
  ProductIndexStatusType,
} from "../types";

export function ProductIndexExample() {
  const [products, setProducts] = useState<ProductIndexItemType[]>(MOCK_PRODUCTS);
  const [selectedTab, setSelectedTab] = useState("all");
  const [savedViews, setSavedViews] = useState<ProductIndexSavedViewType[]>([]);
  const [query, setQuery] = useState("");
  const [appliedFilters, setAppliedFilters] = useState<ProductIndexFilterValueType[]>([]);
  const [sort, setSort] = useState<ProductIndexSortType>(DEFAULT_PRODUCT_INDEX_SORT);
  const [hideArchived, setHideArchived] = useState(false);
  const [columns, setColumns] = useState<ProductIndexColumnType[]>(PRODUCT_INDEX_COLUMNS);
  const [page, setPage] = useState(1);
  const [refreshing, setRefreshing] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  const showNotice = (message: string) => {
    setNotice(message);
    setTimeout(() => setNotice(null), 4000);
  };

  /* ---------------------------------------------------------------- views */

  const savedView = savedViews.find((view) => view.id === selectedTab);
  const statusTab = PRODUCT_INDEX_STATUS_TABS.find((tab) => tab.id === selectedTab);

  const tabs: TabItemType[] = [
    ...PRODUCT_INDEX_STATUS_TABS,
    ...savedViews.map((view) => ({ id: view.id, label: view.name })),
  ];

  const handleSelectTab = (tabId: string) => {
    setSelectedTab(tabId);
    setPage(1);
    // Each view owns its search and filters: saved views restore theirs,
    // status tabs start clean.
    const view = savedViews.find((item) => item.id === tabId);
    setQuery(view?.query ?? "");
    setAppliedFilters(view?.filters ?? []);
  };

  const handleSaveView = (view: IndexFiltersSavedViewType) => {
    const id = `view-${Date.now()}`;
    setSavedViews((prev) => [
      ...prev,
      { id, name: view.name, query: view.query, filters: fromSavedFilters(view.filters) },
    ]);
    setSelectedTab(id);
    showNotice(`View "${view.name}" saved.`);
  };

  const handleDeleteView = () => {
    if (!savedView) return;
    setSavedViews((prev) => prev.filter((view) => view.id !== savedView.id));
    handleSelectTab("all");
    showNotice(`View "${savedView.name}" deleted.`);
  };

  /* ------------------------------------------------------------- filtering */

  const filteredProducts = useMemo(() => {
    const status = statusTab && statusTab.id !== "all" ? statusTab.id : null;
    const visible = products.filter(
      (product) =>
        (!status || product.status === status) &&
        !(hideArchived && product.status === "archived") &&
        matchesFilters(product, query, appliedFilters),
    );
    return sortProducts(visible, sort);
  }, [products, statusTab, hideArchived, query, appliedFilters, sort]);

  const pageCount = Math.max(
    1,
    Math.ceil(filteredProducts.length / PRODUCT_INDEX_PAGE_SIZE),
  );
  const currentPage = Math.min(page, pageCount);
  const pageProducts = filteredProducts.slice(
    (currentPage - 1) * PRODUCT_INDEX_PAGE_SIZE,
    currentPage * PRODUCT_INDEX_PAGE_SIZE,
  );

  const handleQueryChange = (next: string) => {
    setQuery(next);
    setPage(1);
  };

  const handleFiltersChange = (next: ProductIndexFilterValueType[]) => {
    setAppliedFilters(next);
    setPage(1);
  };

  const handleClearAll = () => {
    setQuery("");
    setAppliedFilters([]);
    setPage(1);
  };

  /* ------------------------------------------------------------- selection */

  const {
    selectedResources,
    allResourcesSelected,
    handleSelectionChange,
    clearSelection,
  } = useIndexResourceState(filteredProducts);

  const handleBulkStatusChange = (status: ProductIndexStatusType) => {
    const ids = new Set(selectedResources);
    setProducts((prev) =>
      prev.map((product) => (ids.has(product.id) ? { ...product, status } : product)),
    );
    showNotice(`${ids.size} product(s) set to ${status}.`);
    clearSelection();
  };

  const handleBulkDelete = () => {
    const ids = new Set(selectedResources);
    setProducts((prev) => prev.filter((product) => !ids.has(product.id)));
    showNotice(`${ids.size} product(s) deleted.`);
    clearSelection();
  };

  /* --------------------------------------------------------------- actions */

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 700);
  };

  const handleExport = () =>
    showNotice(`Exporting ${filteredProducts.length} filtered product(s) as CSV.`);

  return (
    <Page
      inlineSize="large"
      heading="Products"
      primaryAction={{
        content: "Add product",
        onAction: () => showNotice("Opening the new product form."),
      }}
    >
      <BlockStack gap="small-200">
        {notice ? (
          <Banner tone="info" onDismiss={() => setNotice(null)}>
            {notice}
          </Banner>
        ) : null}

        <ProductIndexFilters
          tabs={tabs}
          selectedTab={selectedTab}
          onSelectTab={handleSelectTab}
          query={query}
          onQueryChange={handleQueryChange}
          filterDefinitions={PRODUCT_INDEX_FILTERS}
          appliedFilters={appliedFilters}
          onAppliedFiltersChange={handleFiltersChange}
          onClearAll={handleClearAll}
          sortOptions={PRODUCT_INDEX_SORT_OPTIONS}
          sort={sort}
          onSortChange={setSort}
          hideArchived={hideArchived}
          onHideArchivedChange={setHideArchived}
          columns={columns}
          onColumnsChange={setColumns}
          existingViewNames={tabs.map((tab) => tab.label ?? "")}
          onSaveView={handleSaveView}
          onDeleteView={savedView ? handleDeleteView : undefined}
          onExport={handleExport}
          onRefresh={handleRefresh}
          refreshing={refreshing}
        />

        <ProductIndexTable
          products={pageProducts}
          totalCount={filteredProducts.length}
          columns={columns}
          selectedIds={selectedResources}
          allSelected={allResourcesSelected}
          onSelectionChange={handleSelectionChange}
          sort={sort}
          onSortChange={setSort}
          page={currentPage}
          pageCount={pageCount}
          pageSize={PRODUCT_INDEX_PAGE_SIZE}
          onPageChange={setPage}
          onBulkStatusChange={handleBulkStatusChange}
          onBulkDelete={handleBulkDelete}
          onOpenProduct={(product) => showNotice(`Opening "${product.title}".`)}
          emptyState={<ProductIndexEmptyState onClearAll={handleClearAll} />}
          loading={refreshing}
        />
      </BlockStack>
    </Page>
  );
}

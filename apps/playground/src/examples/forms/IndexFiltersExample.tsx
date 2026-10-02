import { useState } from "react";
import {
  Badge,
  BlockStack,
  Box,
  Button,
  Card,
  Clickable,
  EmptyState,
  Icon,
  IndexFilters,
  InlineStack,
  Link,
  Page,
  Table,
  Tabs,
  Text,
} from "@xco-agency/corex-ui";
import type {
  IndexAppliedFilterType,
  IndexFilterColumnItemType,
  IndexFilterItemType,
  IndexFilterSortOptionType,
  TabItemType,
} from "@xco-agency/corex-ui";

type ProductItemType = {
  id: string;
  title: string;
  vendor: string;
  status: "active" | "draft" | "archived";
  inventory: number;
  category: string;
  channels: string;
  productType: string;
  tags: string[];
  created: string;
  updated: string;
};

const initialProducts: ProductItemType[] = [
  {
    id: "prod-1",
    title: "Shipping protection",
    vendor: "wevente",
    status: "active",
    inventory: 120,
    category: "Services",
    channels: "1",
    productType: "Kaching Cart Upsell Toggle",
    tags: ["protection", "shipping"],
    created: "2026-03-10",
    updated: "2026-09-12",
  },
  {
    id: "prod-2",
    title: "VIP 2",
    vendor: "wevente",
    status: "active",
    inventory: 0,
    category: "Services",
    channels: "1",
    productType: "Membership",
    tags: ["vip", "membership"],
    created: "2026-04-05",
    updated: "2026-09-14",
  },
  {
    id: "prod-3",
    title: "VIP",
    vendor: "wevente",
    status: "active",
    inventory: 45,
    category: "Subscription Services",
    channels: "1",
    productType: "Membership",
    tags: ["vip", "subscription", "badge-25% OFF"],
    created: "2026-01-12",
    updated: "2026-08-20",
  },
  {
    id: "prod-4",
    title: "The Minimalist Backpack",
    vendor: "Apple",
    status: "draft",
    inventory: 15,
    category: "Backpacks",
    channels: "2",
    productType: "Luggage",
    tags: ["bag", "travel", "Promo"],
    created: "2026-05-18",
    updated: "2026-09-01",
  },
  {
    id: "prod-5",
    title: "Aura Loop Smart Wristband",
    vendor: "Sony",
    status: "active",
    inventory: 80,
    category: "Wristbands",
    channels: "1",
    productType: "Accessories",
    tags: ["fitness", "sports", "badge-25% OFF"],
    created: "2026-02-15",
    updated: "2026-07-10",
  },
  {
    id: "prod-6",
    title: "Hidden Archive Item",
    vendor: "wevente",
    status: "archived",
    inventory: 0,
    category: "Audio",
    channels: "1",
    productType: "Headphones",
    tags: ["exclude_search", "hidden"],
    created: "2025-11-20",
    updated: "2026-03-01",
  },
];

const viewTabs: TabItemType[] = [
  { id: "all", label: "All" },
  { id: "active", label: "Active" },
  { id: "draft", label: "Draft" },
  { id: "archived", label: "Archived" },
];

const sortOptionsList: IndexFilterSortOptionType[] = [
  { label: "Created", value: "created" },
  { label: "Updated", value: "updated" },
  { label: "Title", value: "title" },
  { label: "Inventory", value: "inventory" },
];

const initialColumns: IndexFilterColumnItemType[] = [
  { key: "product", label: "Product", visible: true },
  { key: "status", label: "Status", visible: true },
  { key: "inventory", label: "Inventory", visible: true },
  { key: "category", label: "Category", visible: true },
  { key: "channels", label: "Channels", visible: true },
  { key: "productType", label: "Product type", visible: true },
  { key: "vendor", label: "Vendor", visible: true },
  { key: "created", label: "Created", visible: false },
  { key: "updated", label: "Updated", visible: false },
];

const filterDefinitions: IndexFilterItemType[] = [
  {
    key: "vendor",
    label: "Vendor",
    options: [
      { label: "wevente", value: "wevente" },
      { label: "Apple", value: "apple" },
      { label: "Noise", value: "noise" },
      { label: "Sony", value: "sony" },
    ],
    operators: [
      { label: "Is", value: "is" },
      { label: "Is not", value: "is_not" },
    ],
    defaultOperator: "is",
  },
  {
    key: "tag",
    label: "Tag",
    options: [
      { label: "badge-25% OFF", value: "badge-25% OFF" },
      { label: "Promo", value: "Promo" },
      { label: "badge-50% off", value: "badge-50% off" },
      { label: "Black", value: "Black" },
      { label: "clubify", value: "clubify" },
      { label: "convoy", value: "convoy" },
      { label: "exclude", value: "exclude" },
      { label: "exclude_search", value: "exclude_search" },
      { label: "headphone", value: "headphone" },
      { label: "hidden", value: "hidden" },
    ],
    operators: [
      { label: "Is", value: "is" },
      { label: "Is not", value: "is_not" },
    ],
    defaultOperator: "is_not",
  },
  {
    key: "status",
    label: "Status",
    allowMultiple: false,
    options: [
      { label: "Active", value: "active" },
      { label: "Draft", value: "draft" },
      { label: "Archived", value: "archived" },
    ],
  },
  {
    key: "category",
    label: "Category",
    options: [
      { label: "Services", value: "Services" },
      { label: "Subscription Services", value: "Subscription Services" },
      { label: "Backpacks", value: "Backpacks" },
      { label: "Wristbands", value: "Wristbands" },
      { label: "Audio", value: "Audio" },
    ],
  },
  { key: "channels", label: "Sales channel" },
  { key: "region", label: "Region catalog" },
  { key: "b2b", label: "B2B catalog" },
  { key: "location", label: "Company location catalog" },
  { key: "channelCatalog", label: "Channel catalog" },
  { key: "retail", label: "Retail catalog" },
  { key: "unassigned", label: "Unassigned catalog" },
];

export function IndexFiltersExample() {
  const [selectedView, setSelectedView] = useState("all");
  const [query, setQuery] = useState("");
  const [appliedFilters, setAppliedFilters] = useState<IndexAppliedFilterType[]>([
    {
      key: "tag",
      field: "Tag",
      operator: "is not",
      value: "exclude_search",
      onRemove: () => handleRemoveFilter("tag"),
    },
  ]);
  const [sortValue, setSortValue] = useState("created");
  const [hideArchived, setHideArchived] = useState(false);
  const [columns, setColumns] = useState<IndexFilterColumnItemType[]>(initialColumns);
  const [refreshing, setRefreshing] = useState(false);
  const [savedNotice, setSavedNotice] = useState("");

  const handleRemoveFilter = (filterKey: string) => {
    setAppliedFilters((prev) => prev.filter((f) => f.key !== filterKey));
  };

  const handleAddFilter = (filterKey: string, index: number) => {
    const filterDef = filterDefinitions.find((f) => f.key === filterKey);
    const fieldLabel = filterDef?.label ?? filterKey;
    const defaultOp = filterDef?.defaultOperator ?? "is";

    setAppliedFilters((prev) => {
      if (prev.some((f) => f.key === filterKey)) return prev;
      const next = [...prev];
      // Insert the pill where the caret was when the filter was picked.
      next.splice(index, 0, {
        key: filterKey,
        field: fieldLabel,
        operator: defaultOp === "is_not" ? "is not" : defaultOp,
        value: filterDef?.allowMultiple !== false ? [] : "",
        onRemove: () => handleRemoveFilter(filterKey),
      });
      return next;
    });
  };

  const handleFilterSelect = (
    filterKey: string,
    value: string | string[],
    operator = "is",
  ) => {
    setAppliedFilters((prev) => {
      const filterDef = filterDefinitions.find((f) => f.key === filterKey);
      const fieldLabel = filterDef?.label ?? filterKey;
      const existing = prev.find((f) => f.key === filterKey);
      const isMultiple = filterDef?.allowMultiple !== false;

      // If array is empty, remove the pill
      if (Array.isArray(value) && value.length === 0) {
        return prev.filter((f) => f.key !== filterKey);
      }
      if (!isMultiple && !value) {
        return prev.filter((f) => f.key !== filterKey);
      }

      const updatedFilter: IndexAppliedFilterType = {
        key: filterKey,
        field: fieldLabel,
        operator: operator === "is_not" ? "is not" : operator,
        value,
        onRemove: () => handleRemoveFilter(filterKey),
      };

      if (existing) {
        return prev.map((f) => (f.key === filterKey ? updatedFilter : f));
      }
      return [...prev, updatedFilter];
    });
  };

  const handleOperatorChange = (filterKey: string, operator: string) => {
    setAppliedFilters((prev) =>
      prev.map((f) =>
        f.key === filterKey
          ? { ...f, operator: operator === "is_not" ? "is not" : operator }
          : f,
      ),
    );
  };

  const handleColumnToggle = (columnKey: string, visible: boolean) => {
    setColumns((prev) =>
      prev.map((col) => (col.key === columnKey ? { ...col, visible } : col)),
    );
  };

  const handleClearAll = () => {
    setQuery("");
    setAppliedFilters([]);
  };

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 600);
  };

  const handleSave = () => {
    setSavedNotice(
      `Saved view "${selectedView}" with ${appliedFilters.length} active filter(s)`,
    );
    setTimeout(() => setSavedNotice(""), 3000);
  };

  // Filter products based on search, view tabs, applied filters, and column visibility
  const filteredProducts = initialProducts.filter((product) => {
    // 1. Hide archived switch
    if (hideArchived && product.status === "archived") {
      return false;
    }

    // 2. View Tab filter
    if (selectedView !== "all" && product.status !== selectedView) {
      return false;
    }

    // 3. Keyword Search across title, vendor, tags
    if (query.trim()) {
      const q = query.toLowerCase();
      const matchTitle = product.title.toLowerCase().includes(q);
      const matchVendor = product.vendor.toLowerCase().includes(q);
      const matchTags = product.tags.some((t) => t.toLowerCase().includes(q));
      if (!matchTitle && !matchVendor && !matchTags) return false;
    }

    // 4. Applied Filters logic
    for (const applied of appliedFilters) {
      const isNot = applied.operator === "is_not" || applied.operator === "is not";
      const filterValues = Array.isArray(applied.value)
        ? applied.value
        : applied.value
          ? [applied.value]
          : [];

      if (filterValues.length === 0) continue;

      if (applied.key === "vendor") {
        const matches = filterValues.some(
          (v) => product.vendor.toLowerCase() === v.toLowerCase(),
        );
        if (isNot ? matches : !matches) return false;
      } else if (applied.key === "status") {
        const matches = filterValues.some(
          (v) => product.status.toLowerCase() === v.toLowerCase(),
        );
        if (isNot ? matches : !matches) return false;
      } else if (applied.key === "tag") {
        const matches = filterValues.some((v) =>
          product.tags.some((t) => t.toLowerCase() === v.toLowerCase()),
        );
        if (isNot ? matches : !matches) return false;
      } else if (applied.key === "category") {
        const matches = filterValues.some(
          (v) => product.category.toLowerCase() === v.toLowerCase(),
        );
        if (isNot ? matches : !matches) return false;
      }
    }

    return true;
  });

  return (
    <Page>
      <BlockStack gap="large-100" inlineSize="100%">
        {savedNotice ? (
          <Box background="strong" borderRadius="base" padding="small-200">
            <Text variant="small" tone="neutral">
              {savedNotice}
            </Text>
          </Box>
        ) : null}

        {/* Primary Composable IndexFilters Toolbar (Transparent & No Border) */}
        <IndexFilters>
          <IndexFilters.SearchField
            tabs={
              <Tabs
                tabs={viewTabs}
                selected={selectedView}
                onSelect={(tabId: string | number) => setSelectedView(String(tabId))}
                compact
              />
            }
            queryValue={query}
            queryPlaceholder="search by keywords"
            onQueryChange={setQuery}
            onQueryClear={() => setQuery("")}
            filters={filterDefinitions}
            appliedFilters={appliedFilters}
            onAddFilter={handleAddFilter}
            onFilterSelect={handleFilterSelect}
            onOperatorChange={handleOperatorChange}
            onClearAll={handleClearAll}
          />

          <IndexFilters.Actions>
            <IndexFilters.Columns
              sortOptions={sortOptionsList}
              sortValue={sortValue}
              onSortChange={setSortValue}
              hideArchived={hideArchived}
              onHideArchivedChange={setHideArchived}
              columns={columns}
              onColumnToggle={handleColumnToggle}
            />

            <Button
              variant="tertiary"
              onClick={handleRefresh}
              disabled={refreshing}
              icon="refresh"
            />

            <Button variant="tertiary" onClick={handleSave}>
              Save
            </Button>
          </IndexFilters.Actions>
        </IndexFilters>

        {/* Table is rendered outside IndexFilters in its own Card/Box */}
        <Card>
          {filteredProducts.length === 0 ? (
            <Box paddingBlock="large-300" paddingInline="large-100">
              <EmptyState
                heading="No products found"
                title="No products found"
                icon="search"
                action={{
                  content: "Clear search and filters",
                  onAction: handleClearAll,
                }}
              >
                <BlockStack gap="small-200" inlineAlign="center">
                  <Text tone="neutral">Try changing the filters or search term</Text>
                  <Link url="#">Learn more about products</Link>
                </BlockStack>
              </EmptyState>
            </Box>
          ) : (
            <Table variant="auto">
              <Table.HeaderRow>
                {columns.find((c) => c.key === "product")?.visible !== false && (
                  <Table.HeaderCell>Product</Table.HeaderCell>
                )}
                {columns.find((c) => c.key === "status")?.visible !== false && (
                  <Table.HeaderCell>Status</Table.HeaderCell>
                )}
                {columns.find((c) => c.key === "inventory")?.visible !== false && (
                  <Table.HeaderCell>Inventory</Table.HeaderCell>
                )}
                {columns.find((c) => c.key === "category")?.visible !== false && (
                  <Table.HeaderCell>Category</Table.HeaderCell>
                )}
                {columns.find((c) => c.key === "channels")?.visible !== false && (
                  <Table.HeaderCell>Channels</Table.HeaderCell>
                )}
                {columns.find((c) => c.key === "productType")?.visible !== false && (
                  <Table.HeaderCell>Type</Table.HeaderCell>
                )}
                {columns.find((c) => c.key === "vendor")?.visible !== false && (
                  <Table.HeaderCell>Vendor</Table.HeaderCell>
                )}
                {columns.find((c) => c.key === "created")?.visible !== false && (
                  <Table.HeaderCell>Created</Table.HeaderCell>
                )}
                {columns.find((c) => c.key === "updated")?.visible !== false && (
                  <Table.HeaderCell>Updated</Table.HeaderCell>
                )}
              </Table.HeaderRow>
              <Table.Body>
                {filteredProducts.map((prod) => (
                  <Table.Row key={prod.id}>
                    {columns.find((c) => c.key === "product")?.visible !== false && (
                      <Table.Cell>
                        <BlockStack gap="small-500">
                          <Link url="#">
                            <Text heading>{prod.title}</Text>
                          </Link>
                          {prod.tags.length > 0 && (
                            <InlineStack gap="small-400">
                              {prod.tags.slice(0, 3).map((tag) => (
                                <Badge key={tag} tone="neutral">
                                  {tag}
                                </Badge>
                              ))}
                            </InlineStack>
                          )}
                        </BlockStack>
                      </Table.Cell>
                    )}
                    {columns.find((c) => c.key === "status")?.visible !== false && (
                      <Table.Cell>
                        <Badge
                          tone={
                            prod.status === "active"
                              ? "success"
                              : prod.status === "draft"
                                ? "info"
                                : "neutral"
                          }
                        >
                          {prod.status}
                        </Badge>
                      </Table.Cell>
                    )}
                    {columns.find((c) => c.key === "inventory")?.visible !== false && (
                      <Table.Cell>
                        <Text tone={prod.inventory === 0 ? "critical" : "neutral"}>
                          {prod.inventory === 0
                            ? "0 in stock"
                            : `${prod.inventory} in stock`}
                        </Text>
                      </Table.Cell>
                    )}
                    {columns.find((c) => c.key === "category")?.visible !== false && (
                      <Table.Cell>{prod.category}</Table.Cell>
                    )}
                    {columns.find((c) => c.key === "channels")?.visible !== false && (
                      <Table.Cell>{prod.channels}</Table.Cell>
                    )}
                    {columns.find((c) => c.key === "productType")?.visible !== false && (
                      <Table.Cell>{prod.productType}</Table.Cell>
                    )}
                    {columns.find((c) => c.key === "vendor")?.visible !== false && (
                      <Table.Cell>{prod.vendor}</Table.Cell>
                    )}
                    {columns.find((c) => c.key === "created")?.visible !== false && (
                      <Table.Cell>{prod.created}</Table.Cell>
                    )}
                    {columns.find((c) => c.key === "updated")?.visible !== false && (
                      <Table.Cell>{prod.updated}</Table.Cell>
                    )}
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          )}
        </Card>
      </BlockStack>
    </Page>
  );
}

// Backwards-compatible alias for example
export const FiltersExample = IndexFiltersExample;

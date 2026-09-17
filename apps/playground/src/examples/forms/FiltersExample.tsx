import { useState } from "react";
import {
  Badge,
  BlockStack,
  Box,
  Button,
  Clickable,
  EmptyState,
  Filters,
  Icon,
  InlineStack,
  Link,
  Table,
  Tabs,
  Text,
} from "@xco-agency/corex-ui";
import type {
  AppliedFilterType,
  FilterColumnItemType,
  FilterItemType,
  FilterSortOptionType,
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
    inventory: 50,
    category: "Subscription Services",
    channels: "2",
    productType: "Membership",
    tags: ["vip"],
    created: "2026-05-18",
    updated: "2026-08-20",
  },
  {
    id: "prod-4",
    title: "Travel Backpack",
    vendor: "wevente",
    status: "active",
    inventory: 24,
    category: "Backpacks",
    channels: "1",
    productType: "Bags",
    tags: ["backpack", "travel", "badge-25% OFF"],
    created: "2026-01-12",
    updated: "2026-06-01",
  },
  {
    id: "prod-5",
    title: "Sports Wristband",
    vendor: "wevente",
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

const sortOptionsList: FilterSortOptionType[] = [
  { label: "Created", value: "created" },
  { label: "Updated", value: "updated" },
  { label: "Title", value: "title" },
  { label: "Inventory", value: "inventory" },
];

const initialColumns: FilterColumnItemType[] = [
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

const filterDefinitions: FilterItemType[] = [
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

export function FiltersExample() {
  const [selectedView, setSelectedView] = useState("all");
  const [query, setQuery] = useState("");
  const [appliedFilters, setAppliedFilters] = useState<AppliedFilterType[]>([
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
  const [columns, setColumns] = useState<FilterColumnItemType[]>(initialColumns);
  const [refreshing, setRefreshing] = useState(false);
  const [savedNotice, setSavedNotice] = useState("");

  const handleRemoveFilter = (filterKey: string) => {
    setAppliedFilters((prev) => prev.filter((f) => f.key !== filterKey));
  };

  const handleFilterSelect = (filterKey: string, value: string, operator = "is") => {
    const filterDef = filterDefinitions.find((f) => f.key === filterKey);
    const fieldLabel = filterDef?.label ?? filterKey;

    setAppliedFilters((prev) => {
      const existing = prev.find((f) => f.key === filterKey);
      if (existing && existing.value === value) {
        // Toggle off if clicking the same value
        return prev.filter((f) => f.key !== filterKey);
      }
      const updated = prev.filter((f) => f.key !== filterKey);
      return [
        ...updated,
        {
          key: filterKey,
          field: fieldLabel,
          operator: operator === "is_not" ? "is not" : "is",
          value,
          onRemove: () => handleRemoveFilter(filterKey),
        },
      ];
    });
  };

  const handleOperatorChange = (filterKey: string, operator: string) => {
    setAppliedFilters((prev) =>
      prev.map((f) => {
        if (f.key === filterKey) {
          return {
            ...f,
            operator: operator === "is_not" ? "is not" : "is",
          };
        }
        return f;
      }),
    );
  };

  const handleColumnToggle = (columnKey: string, visible: boolean) => {
    setColumns((prev) => prev.map((c) => (c.key === columnKey ? { ...c, visible } : c)));
  };

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 600);
  };

  const handleSave = () => {
    setSavedNotice("View settings saved successfully");
    setTimeout(() => setSavedNotice(""), 3000);
  };

  const handleClearAll = () => {
    setQuery("");
    setAppliedFilters([]);
  };

  // Filter products based on query and active filters
  const filteredProducts = initialProducts.filter((product) => {
    if (hideArchived && product.status === "archived") return false;
    if (selectedView !== "all" && product.status !== selectedView) return false;

    // Filter by applied filter pills
    for (const af of appliedFilters) {
      if (af.key === "tag") {
        const hasTag = product.tags.includes(String(af.value));
        if (af.operator === "is not" && hasTag) return false;
        if (af.operator === "is" && !hasTag) return false;
      }
      if (af.key === "vendor") {
        const match = product.vendor.toLowerCase() === String(af.value).toLowerCase();
        if (af.operator === "is not" && match) return false;
        if (af.operator === "is" && !match) return false;
      }
      if (af.key === "status") {
        if (product.status !== af.value) return false;
      }
      if (af.key === "category") {
        if (product.category !== af.value) return false;
      }
    }

    // Keyword search (independent of filters menu)
    if (query.trim()) {
      const q = query.toLowerCase();
      const match =
        product.title.toLowerCase().includes(q) ||
        product.vendor.toLowerCase().includes(q) ||
        product.category.toLowerCase().includes(q) ||
        product.productType.toLowerCase().includes(q) ||
        product.tags.some((t) => t.toLowerCase().includes(q));
      if (!match) return false;
    }

    return true;
  });

  const isColVisible = (key: string) =>
    columns.find((c) => c.key === key)?.visible !== false;

  return (
    <BlockStack gap="large-100">
      {savedNotice ? (
        <Box background="strong" borderRadius="base" padding="small-200">
          <Text variant="small" tone="neutral">
            {savedNotice}
          </Text>
        </Box>
      ) : null}

      {/* Primary Composable Filters Toolbar (Transparent & No Border) */}
      <Filters>
        <Filters.SearchField
          tabs={
            <Tabs
              tabs={viewTabs}
              selected={selectedView}
              onSelect={(tabId) => setSelectedView(String(tabId))}
              compact
            />
          }
          queryValue={query}
          queryPlaceholder="search by keywords"
          onQueryChange={setQuery}
          onQueryClear={() => setQuery("")}
          filters={filterDefinitions}
          appliedFilters={appliedFilters}
          onFilterSelect={handleFilterSelect}
          onOperatorChange={handleOperatorChange}
          onClearAll={handleClearAll}
        />

        <Filters.Actions>
          <Filters.Columns
            sortOptions={sortOptionsList}
            sortValue={sortValue}
            onSortChange={setSortValue}
            hideArchived={hideArchived}
            onHideArchivedChange={setHideArchived}
            columns={columns}
            onColumnToggle={handleColumnToggle}
          />

          <Clickable
            background="transparent"
            padding="small-200"
            blockSize="32px"
            borderRadius="base"
            accessibilityLabel="Refresh"
            onClick={handleRefresh}
            disabled={refreshing}
          >
            <InlineStack alignItems="center" justifyContent="center">
              <Icon type="refresh" tone="neutral" />
            </InlineStack>
          </Clickable>

          <Button variant="secondary" onClick={handleSave}>
            Save
          </Button>
        </Filters.Actions>
      </Filters>

      {/* Table is rendered outside Filters in its own Card/Box */}
      <Box background="base" border="base" borderRadius="large" inlineSize="100%">
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
              <Table.Header>Product</Table.Header>
              {isColVisible("status") ? <Table.Header>Status</Table.Header> : null}
              {isColVisible("inventory") ? <Table.Header>Inventory</Table.Header> : null}
              {isColVisible("category") ? <Table.Header>Category</Table.Header> : null}
              {isColVisible("channels") ? <Table.Header>Channels</Table.Header> : null}
              {isColVisible("productType") ? (
                <Table.Header>Product Type</Table.Header>
              ) : null}
              {isColVisible("vendor") ? <Table.Header>Vendor</Table.Header> : null}
            </Table.HeaderRow>
            <Table.Body>
              {filteredProducts.map((prod) => (
                <Table.Row key={prod.id}>
                  <Table.Cell>
                    <Text heading>{prod.title}</Text>
                  </Table.Cell>
                  {isColVisible("status") ? (
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
                  ) : null}
                  {isColVisible("inventory") ? (
                    <Table.Cell>
                      {prod.inventory > 0
                        ? `${prod.inventory} in stock`
                        : "Inventory not tracked"}
                    </Table.Cell>
                  ) : null}
                  {isColVisible("category") ? (
                    <Table.Cell>{prod.category}</Table.Cell>
                  ) : null}
                  {isColVisible("channels") ? (
                    <Table.Cell>{prod.channels}</Table.Cell>
                  ) : null}
                  {isColVisible("productType") ? (
                    <Table.Cell>{prod.productType}</Table.Cell>
                  ) : null}
                  {isColVisible("vendor") ? <Table.Cell>{prod.vendor}</Table.Cell> : null}
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        )}
      </Box>

      {/* Compound Subcomponents Manual Demo */}
      <Box background="base" border="base" borderRadius="large" padding="base">
        <BlockStack gap="small-300">
          <Text heading>Manual Composition (Compound Subcomponents)</Text>
          <Text variant="small" tone="neutral">
            Use <code>Filters.SearchField</code> directly to place the interactive input
            anywhere with custom controls:
          </Text>

          <InlineStack alignItems="center" justifyContent="space-between" gap="small-200">
            <Filters.SearchField
              queryValue={query}
              queryPlaceholder="search products or keywords..."
              onQueryChange={setQuery}
              onQueryClear={() => setQuery("")}
              onSelectView={setSelectedView}
              filters={filterDefinitions}
              appliedFilters={appliedFilters}
              onFilterSelect={handleFilterSelect}
              onOperatorChange={handleOperatorChange}
              onClearAll={handleClearAll}
            />
            <Filters.Actions>
              <Filters.Columns
                sortOptions={sortOptionsList}
                sortValue={sortValue}
                onSortChange={setSortValue}
                hideArchived={hideArchived}
                onHideArchivedChange={setHideArchived}
                columns={columns}
                onColumnToggle={handleColumnToggle}
              />
              <Button variant="secondary" onClick={handleSave}>
                Save
              </Button>
            </Filters.Actions>
          </InlineStack>
        </BlockStack>
      </Box>
    </BlockStack>
  );
}

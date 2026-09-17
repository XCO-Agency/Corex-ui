# Filters

A minimalist, highly composable search and filter toolbar component inspired by Shopify Admin's IndexFilters unified input bar with classic Polaris `Filters` flexibility.

`Filters` features a custom interactive input bar with:
- **Filter dropdown on focus**: Clicking or focusing the input immediately displays the available filter categories (Vendor, Tag, Status, Category, etc.) or drills down into their values with checkmarks and operators (`Is`, `Is not`).
- **Independent keyword search**: You can type ANY search keywords freely inside the input without being forced to choose an item from the menu.
- **Inline filter pills**: Applied filters are rendered directly inside the input container (e.g. `Tag is not exclude_search ✕`) with light-blue highlight and one-click removal.
- **Add filter button (`⊕`)**: A circular plus button with tooltip `"Add new filter"` to toggle the filter options.
- **Clear button (`(X)`)**: A circular clear button on the far right inside the input to clear search keywords or all filters.
- **Columns & Sort Popover (`[|]`)**: Dedicated popover with sort selector, `Hide archived` switch, and column visibility toggles.

```tsx
import { useState } from "react";
import { Filters, ChoiceList } from "@xco-agency/corex-ui";

const [query, setQuery] = useState("");
const [selectedView, setSelectedView] = useState("all");
const [appliedFilters, setAppliedFilters] = useState([
  {
    key: "tag",
    field: "Tag",
    operator: "is not",
    value: "exclude_search",
    onRemove: () => setAppliedFilters([]),
  },
]);

<Filters
  queryValue={query}
  queryPlaceholder="search by keywords"
  onQueryChange={setQuery}
  onQueryClear={() => setQuery("")}
  views={[
    { id: "all", label: "All" },
    { id: "active", label: "Active" },
    { id: "draft", label: "Draft" },
  ]}
  selectedView={selectedView}
  onSelectView={setSelectedView}
  filters={[
    {
      key: "tag",
      label: "Tag",
      options: [
        { label: "badge-25% OFF", value: "badge-25% OFF" },
        { label: "Promo", value: "Promo" },
        { label: "exclude_search", value: "exclude_search" },
      ],
      operators: [
        { label: "Is", value: "is" },
        { label: "Is not", value: "is_not" },
      ],
      defaultOperator: "is_not",
    },
    {
      key: "vendor",
      label: "Vendor",
      options: [
        { label: "wevente", value: "wevente" },
        { label: "Apple", value: "apple" },
      ],
    },
  ]}
  appliedFilters={appliedFilters}
  onFilterSelect={(key, val, op) => {
    setAppliedFilters([
      { key, field: key, operator: op, value: val, onRemove: () => setAppliedFilters([]) },
    ]);
  }}
  onClearAll={() => {
    setQuery("");
    setAppliedFilters([]);
  }}
  sortOptions={[
    { label: "Created", value: "created" },
    { label: "Updated", value: "updated" },
  ]}
  columns={[
    { key: "status", label: "Status", visible: true },
    { key: "inventory", label: "Inventory", visible: true },
  ]}
  onColumnToggle={(col, visible) => console.log(col, visible)}
  onRefresh={() => console.log("refresh")}
  onSave={() => console.log("save")}
/>
```

## Composable Toolbar Pattern (Recommended)

`Filters` can be composed cleanly with subcomponents, leaving content like tables outside:

```tsx
import { useState } from "react";
import { Filters, Button, Tabs, InlineStack, Table, Card } from "@xco-agency/corex-ui";

<Filters>
  <Filters.SearchField
    tabs={
      <Tabs
        tabs={[
          { id: "all", label: "All" },
          { id: "active", label: "Active" },
          { id: "draft", label: "Draft" },
        ]}
        selected={selectedView}
        onSelect={(tabId) => setSelectedView(String(tabId))}
        compact
      />
    }
    queryValue={query}
    queryPlaceholder="search by keywords"
    onQueryChange={setQuery}
    onQueryClear={() => setQuery("")}
    filters={filters}
    appliedFilters={appliedFilters}
    onFilterSelect={handleFilterSelect}
    onOperatorChange={handleOperatorChange}
    onClearAll={handleClearAll}
  />
  <Filters.Actions>
    <Filters.Columns
      sortOptions={sortOptions}
      sortValue={sortValue}
      onSortChange={setSortValue}
      columns={columns}
      onColumnToggle={handleColumnToggle}
    />
    <Button variant="secondary" onClick={handleSave}>
      Save
    </Button>
  </Filters.Actions>
</Filters>

{/* Render table or content outside Filters */}
<Card>
  <Table>
    ...
  </Table>
</Card>
```

## Subcomponents

- **`Filters.SearchField`**: Unified search and filter input container. Supports `tabs`, `views`, or `leftSlot` (e.g. `<Tabs compact ... />`), inline applied filter pills, keyword typing, `⊕` add filter button, `(X)` clear button, and focus dropdown popup with filter categories and operators.
- **`Filters.Columns`** / **`Filters.ColumnsPopover`**: Dedicated popover for table sort options, `Hide archived` switch, and column visibility toggles.
- **`Filters.Actions`**: Horizontal container for action buttons and popovers on the right side of the toolbar.
- **`Filters.Shortcut`**: Individual filter trigger button opening a popover.
- **`Filters.Applied`** & **`Filters.AppliedPill`**: Individual or grouped applied filter badges.

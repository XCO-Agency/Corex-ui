# IndexFilters

A minimalist, highly composable search and filter toolbar component inspired by Shopify Admin's IndexFilters unified input bar with classic Polaris flexibility.

`IndexFilters` features a custom interactive input bar with:

- **Filter dropdown on focus**: Clicking or focusing the input immediately displays the available filter categories (Vendor, Tag, Status, Category, etc.) or drills down into their values with checkmarks and operators (`Is`, `Is not`).
- **Independent keyword search**: You can type ANY search keywords freely inside the input without being forced to choose an item from the menu.
- **Inline filter pills**: Applied filters are rendered directly inside the input container (e.g. `Tag is not exclude_search ✕`) with light-blue highlight and one-click removal.
- **Add filter button (`⊕`)**: A circular plus button with tooltip `"Add filter"` to toggle the filter options.
- **Clear button (`(X)`)**: A circular clear button on the far right inside the input to clear search keywords or all filters.
- **View options popover (`[|]`)**: Composable popover with a sort selector, switch rows (e.g. `Hide archived`), and a column list you can show/hide and reorder by drag and drop.

## Usage

```tsx
import { useState, type ReactNode } from "react";
import { IndexFilters, Tabs, Card, Table } from "@xco-agency/corex-ui";
import type { IndexFilterColumnItemType } from "@xco-agency/corex-ui";

const [columns, setColumns] = useState<IndexFilterColumnItemType[]>([
  { key: "title", label: "Product", reorderable: false, hideable: false },
  { key: "status", label: "Status" },
  { key: "vendor", label: "Vendor" },
  { key: "created", label: "Created", visible: false },
]);

// Cell content lives outside the columns list, keyed by column key.
const renderCell: Record<string, (product: ProductType) => ReactNode> = {
  title: (p) => p.title,
  status: (p) => p.status,
  vendor: (p) => p.vendor,
  created: (p) => p.created,
};
const visibleColumns = columns.filter((column) => column.visible !== false);

<IndexFilters>
  <IndexFilters.SearchField
    tabs={
      <Tabs
        tabs={views}
        selected={selectedView}
        onSelect={(id) => setSelectedView(String(id))}
        compact
      />
    }
    queryValue={query}
    onQueryChange={setQuery}
    filters={filters}
    appliedFilters={appliedFilters}
    onAddFilter={handleAddFilter}
    onFilterSelect={handleFilterSelect}
    onOperatorChange={handleOperatorChange}
    onClearAll={handleClearAll}
  />
  <IndexFilters.Actions>
    <IndexFilters.ViewOptions>
      <IndexFilters.ViewOptionsSort
        label="Sort by"
        options={[
          { label: "Created", value: "created" },
          { label: "Title", value: "title" },
        ]}
        value={sort}
        onChange={setSort}
      />
      <IndexFilters.ViewOptionsToggles
        items={[
          {
            key: "hideArchived",
            label: "Hide archived",
            icon: "archive",
            checked: hideArchived,
            onChange: setHideArchived,
          },
        ]}
      />
      <IndexFilters.ViewOptionsColumns columns={columns} onChange={setColumns} />
    </IndexFilters.ViewOptions>
  </IndexFilters.Actions>
</IndexFilters>;

{
  /* The same columns array drives the table, outside IndexFilters. */
}
<Card>
  <Table>
    <Table.HeaderRow>
      {visibleColumns.map((column) => (
        <Table.HeaderCell key={column.key}>{column.label}</Table.HeaderCell>
      ))}
    </Table.HeaderRow>
    <Table.Body>
      {products.map((product) => (
        <Table.Row key={product.id}>
          {visibleColumns.map((column) => (
            <Table.Cell key={column.key}>{renderCell[column.key]?.(product)}</Table.Cell>
          ))}
        </Table.Row>
      ))}
    </Table.Body>
  </Table>
</Card>;
```

Without children, `IndexFilters` renders a `SearchField` from its own props and places `actions` on the right:

```tsx
<IndexFilters
  queryValue={query}
  onQueryChange={setQuery}
  filters={filters}
  appliedFilters={appliedFilters}
  actions={<IndexFilters.ViewOptions>...</IndexFilters.ViewOptions>}
/>
```

## Subcomponents

- **`IndexFilters.SearchField`**: Unified search and filter input. Supports `tabs` (e.g. `<Tabs compact ... />`), inline applied filter pills, keyword typing, `⊕` add filter button, `(X)` clear button, and the filter categories/operators popovers.
- **`IndexFilters.Actions`**: Horizontal container for action buttons and popovers on the right side of the toolbar.
- **`IndexFilters.ViewOptions`**: Popover holding the view sections, with a divider between each section. Any content can go inside.
- **`IndexFilters.ViewOptionsSort`**: Sort row with a select.
- **`IndexFilters.ViewOptionsToggles`**: One switch row per item.
- **`IndexFilters.ViewOptionsColumns`**: Column list with show/hide and drag-and-drop reordering.

## `IndexFilters.ViewOptions`

| Prop                              | Type           | Description                                                          |
| :-------------------------------- | :------------- | :------------------------------------------------------------------- |
| `children`                        | `ReactNode`    | Sections, separated by dividers.                                     |
| `activator`                       | `ReactElement` | Custom trigger; replaces the default icon button.                    |
| `icon`                            | `IconType`     | Default trigger icon. Defaults to `"layout-columns-3"`.              |
| `accessibilityLabel`              | `string`       | Default trigger label. Defaults to `"View options"`.                 |
| `disabled`                        | `boolean`      | Disables the default trigger.                                        |
| `minInlineSize` / `maxInlineSize` | `string`       | Popover content width bounds. `minInlineSize` defaults to `"260px"`. |
| `id`                              | `string`       | Popover ID. Auto-generated if omitted.                               |

## `IndexFilters.ViewOptionsSort`

| Prop       | Type                          | Description                                      |
| :--------- | :---------------------------- | :----------------------------------------------- |
| `options`  | `IndexFilterSortOptionType[]` | `{ label, value, disabled? }` items.             |
| `value`    | `string`                      | Selected value.                                  |
| `onChange` | `(value: string) => void`     | Fires with the new value.                        |
| `label`    | `string`                      | Row label. Defaults to `"Sort by"`.              |
| `icon`     | `IconType \| null`            | Row icon. Defaults to `"sort"`; `null` hides it. |
| `disabled` | `boolean`                     | Disables the select.                             |

## `IndexFilters.ViewOptionsToggles`

| Prop       | Type                                      | Description                                                            |
| :--------- | :---------------------------------------- | :--------------------------------------------------------------------- |
| `items`    | `IndexFilterViewToggleItemType[]`         | `{ key, label, icon?, checked, disabled?, onChange?(checked) }` items. |
| `onChange` | `(key: string, checked: boolean) => void` | Fires for any item, alongside the item's own `onChange`.               |

## `IndexFilters.ViewOptionsColumns`

| Prop        | Type                                             | Description                                              |
| :---------- | :----------------------------------------------- | :------------------------------------------------------- |
| `columns`   | `IndexFilterColumnItemType[]`                    | Columns in display order.                                |
| `onChange`  | `(columns: IndexFilterColumnItemType[]) => void` | Fires with the full list after a show/hide or a reorder. |
| `title`     | `ReactNode`                                      | Section title. Defaults to `"Columns"`; `null` hides it. |
| `direction` | `"vertical" \| "horizontal"`                     | List layout and drag axis. Defaults to `"vertical"`.     |

`IndexFilterColumnItemType`:

| Field         | Type      | Description                                                                                         |
| :------------ | :-------- | :-------------------------------------------------------------------------------------------------- |
| `key`         | `string`  | Unique column key.                                                                                  |
| `label`       | `string`  | Label shown in the list.                                                                            |
| `visible`     | `boolean` | Defaults to `true`.                                                                                 |
| `hideable`    | `boolean` | Set to `false` to lock the column visible. Defaults to `true`.                                      |
| `reorderable` | `boolean` | Set to `false` to pin the column in place; the other columns reorder around it. Defaults to `true`. |

Reordering works by dragging a row's handle, or by focusing the handle and pressing the arrow keys (`↑`/`↓` in vertical lists, `←`/`→` in horizontal ones). `Escape` cancels a drag.

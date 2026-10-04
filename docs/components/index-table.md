# IndexTable

v12's resource table, built from plain elements on one CSS grid with its own
scoped stylesheet. Rows and cells are your own children, so any content fits in
a cell.

```tsx
import {
  IndexTable,
  Page,
  reorderItems,
  useIndexResourceState,
} from "@xco-agency/corex-ui";

const [products, setProducts] = useState(initialProducts);
const { selectedResources, allResourcesSelected, handleSelectionChange } =
  useIndexResourceState(products);

<Page heading="Products">
  <IndexTable
    resourceName={{ singular: "product", plural: "products" }}
    pagination={{ hasNext, onNext, label: "1-50" }}
    headings={[
      { title: "Product", minWidth: 280, sortable: true },
      { title: "Status" },
      { title: "Total", format: "currency" },
      { title: "", hidden: true, width: "48px", sticky: "right" },
    ]}
    itemCount={products.length}
    selectedItemsCount={allResourcesSelected ? "All" : selectedResources.length}
    onSelectionChange={handleSelectionChange}
    promotedBulkActions={[{ content: "Bulk edit", onAction: bulkEdit }]}
    bulkActions={[{ content: "Archive", onAction: archive }]}
    sortColumnIndex={sortIndex}
    sortDirection={sortDirection}
    onSort={(index, direction) => sortBy(index, direction)}
    onReorder={(from, to) => setProducts((items) => reorderItems(items, from, to))}
  >
    {products.map((product) => (
      <IndexTable.Row
        key={product.id}
        id={product.id}
        selected={selectedResources.includes(product.id)}
        onClick={() => open(product)}
        subRows={product.variants.map((variant) => (
          <IndexTable.Row key={variant.id} id={variant.id}>
            <IndexTable.Cell>{variant.title}</IndexTable.Cell>
          </IndexTable.Row>
        ))}
      >
        <IndexTable.Cell sticky="left">{product.title}</IndexTable.Cell>
        <IndexTable.Cell>
          <Badge tone="success">{product.status}</Badge>
        </IndexTable.Cell>
        <IndexTable.Cell>{product.total}</IndexTable.Cell>
        <IndexTable.Cell>
          <Button icon="view" variant="tertiary" />
        </IndexTable.Cell>
      </IndexTable.Row>
    ))}
  </IndexTable>
</Page>;
```

## Layout

Every row is a real `role="row"` element on `subgrid`, so all rows share the
table's column tracks and always line up.

- **Column widths:** each column is `minmax(minWidth, fr)`. The first column takes
  `2fr` and defaults to a 200px minimum, numeric columns 80px, the rest 120px.
  Pass `width` to use your own track, or `gridTemplateColumns` to replace all tracks.
- **Responsive:** the grid never shrinks below the sum of the column minimums.
  On narrow screens the table scrolls sideways instead of squashing content.
  Below 768px the promoted bulk actions fold into the "…" menu and the
  "Show all selected" switch is hidden.
- **Rows:** body rows are separated by a 1px divider. A hovered or selected row
  gets rounded corners, and the dividers next to it turn transparent. That leaves
  a 1px white gap, so the row reads as its own rounded block.
- **Footer and pagination** have no borders.
- **Row clicks:** clicking a control inside a row (button, link, checkbox, field)
  does not trigger the row's `onClick`, so no `stopPropagation` wrapper is needed.
- **Checkbox cell:** a click anywhere in the checkbox cell toggles that row's
  selection and never opens the row.

## Sticky columns

Pin a column with `sticky="left"` or `sticky="right"`, either on a heading or on
any `IndexTable.Cell`. A pin set on a cell pins the whole column, header
included.

- When any column is pinned left, the drag-handle and checkbox columns are
  pinned with it.
- A pinned column gets a fixed width (`width` in px, else `minWidth`), so each
  pinned column's offset is the sum of the pinned columns between it and its edge.
- Pinned cells take the row's background and corners, so scrolled content passes
  underneath.

## Sorting

Mark a heading `sortable` to turn its title into a sort toggle. The table is
controlled: pass `sortColumnIndex` and `sortDirection`, and handle `onSort(index,
direction)`.

- The first click on a column uses its `defaultSortDirection` (`"descending"`
  unless set). Each later click flips the direction.
- The sorted column shows an arrow and sets `aria-sort`.

## Reordering rows

Pass `onReorder(fromIndex, toIndex)` to add a drag handle to every top-level row.

- **Dragging** (mouse, touch or pen): a copy of the row floats under the pointer,
  and the row's own slot becomes a dashed placeholder that slides to where it
  will land while the other rows move aside. An expanded row collapses to a single row
  while it's dragged, and its sub-rows reappear when you drop. Escape cancels.
- **Keyboard:** focus the handle and press ↑ / ↓.
- `reorderItems(items, from, to)` returns the reordered copy of your array.

## Nested rows

Give a row `subRows` (more `IndexTable.Row` elements) to show children such as a
product's variants.

- The first cell gets an expand toggle, and nested rows are indented and set
  `aria-level`.
- The expanded state is uncontrolled by default (`defaultExpanded`). Control it
  with `expanded` and `onExpandedChange`.
- Expanding and collapsing are animated: the sub-rows fade and slide in, via
  `Transition`, while their height opens, so the rows below glide instead of
  jumping. Rows that start expanded don't animate on first render, and the
  animation is skipped when the user prefers reduced motion.
- Nested rows select like any row: give them `id` and `selected`. Set
  `selectable={false}` on a row that can't be selected, and its checkbox is
  hidden while the columns stay aligned.

### Parent and child selection

When a row has selectable sub-rows, selection works as a tree:

- **Parent checkbox:** checked when every selectable child is selected,
  indeterminate when only some are. The parent's own `selected` prop is not used
  for display.
- **Checking or unchecking a parent** applies to all of its children too.
- **Toggling a child** updates the parent's id in your selection: it's added
  when the last child is selected and removed when any child is deselected.
- The changes arrive as ordinary `onSelectionChange("single", …)` calls, one per
  id, so `useIndexResourceState` and existing handlers need no changes.
- To have "select all" include child rows, pass their ids to the hook:
  `useIndexResourceState(products, { subResourceIDs: (p) => p.variants.map((v) => v.id) })`.
- "Show all selected" keeps a parent visible while any of its children is
  selected.

## Bulk actions

Once anything is selected, a bulk bar replaces the header row. It shows:

- a checkbox that clears the selection;
- a "N selected" menu (select all, select page, deselect all);
- the `promotedBulkActions` as buttons;
- the `bulkActions` in a "…" menu;
- a "Show all selected" switch that filters the rows to the selected ones.

The bar sits outside the horizontal scroller, so it stays in view while the
columns scroll.

## Pagination

For a list page, put the pager on the `Page`: `<Page pagination={…}>` floats a
`Pagination` pill at the bottom-left that stays in view while the list scrolls.

The table's own `pagination` prop renders the same control, right-aligned under
the table. Pass `floating: true` inside `pagination` to display the pagination control
as a floating pill anchored at the bottom-left of the viewport, keeping page navigation
accessible at all times during scrolling:

```tsx
<IndexTable
  itemCount={totalProducts}
  pagination={{
    floating: true,
    hasPrevious: page > 1,
    hasNext: page < totalPages,
    label: `${start} – ${end} of ${totalProducts}`,
    onPrevious: () => setPage((p) => p - 1),
    onNext: () => setPage((p) => p + 1),
  }}
>
  {/* rows */}
</IndexTable>
```

## Theming

The table's colours are CSS custom properties with Shopify admin defaults. To
retheme, set any of these on an ancestor:

- `--cx-it-border-color`
- `--cx-it-surface-color`
- `--cx-it-header-color`
- `--cx-it-hover-color`
- `--cx-it-selected-color`
- `--cx-it-selected-hover-color`
- `--cx-it-zebra-color`
- `--cx-it-text-color`
- `--cx-it-text-subdued-color`
- `--cx-it-focus-color`
- `--cx-it-backdrop-color`: what sits behind the table (default: the surface
  colour). It shows in the rounded corners of pinned cells, so set it when the
  table sits on a non-white background.

## Props

| Prop                                           | Behavior                                                                                                                                        |
| ---------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| `headings`                                     | `{ title, hidden, format, alignment, width, minWidth, sticky, sortable, defaultSortDirection }`. `numeric` and `currency` right-align a column. |
| `itemCount`                                    | Drives the header checkbox and the `emptyState` switch.                                                                                         |
| `selectedItemsCount`                           | A count, or `"All"` when every row across every page is selected.                                                                               |
| `onSelectionChange`                            | v12's `(selectionType, toggleType, selection)`. The header checkbox reports `page`; a row reports `single` with its id.                         |
| `selectable`                                   | `false` drops the selection column entirely.                                                                                                    |
| `bulkActions` / `promotedBulkActions`          | Shown in the bulk bar once something is selected.                                                                                               |
| `showAllSelectedToggle`                        | Shows the "Show all selected" switch in the bulk bar (default `true`).                                                                          |
| `sortColumnIndex` / `sortDirection` / `onSort` | Controlled column sorting.                                                                                                                      |
| `onReorder`                                    | Enables drag-to-reorder of top-level rows.                                                                                                      |
| `pagination`                                   | `{ floating, hasPrevious, hasNext, onPrevious, onNext, label }`. When `floating: true`, floats the pagination pill at the bottom-left.          |
| `footerContent`                                | Rendered under the table, e.g. a "Learn more" link.                                                                                             |
| `emptyState`                                   | Replaces the whole table when `itemCount` is 0.                                                                                                 |
| `loading`                                      | Dims the rows and blocks interaction.                                                                                                           |
| `rows` / `columnContentTypes`                  | DataTable-style data: a 2D array of cells, used instead of children.                                                                            |
| `hasZebraStriping`                             | Shades odd rows.                                                                                                                                |
| `increasedTableDensity`                        | Tighter vertical cell padding.                                                                                                                  |
| `verticalAlign` / `truncate`                   | Cell content alignment, and single-line cells.                                                                                                  |

`IndexTable.Row` takes `id`, `selected`, `selectable`, `disabled`, `onClick`, `position`, and
`subRows` / `expanded` / `defaultExpanded` / `onExpandedChange`.

`IndexTable.Cell` takes `sticky`, `alignment`, `format` and `flush` (no padding).

Not reproduced: v12's shift-click range selection and its sticky header.

## useIndexResourceState

Owns the selection, so a list page does not have to hold its own `Set`.

```tsx
const {
  selectedResources,
  allResourcesSelected,
  handleSelectionChange,
  clearSelection,
  removeSelectedResources,
} = useIndexResourceState(orders, {
  resourceIDResolver: (order) => order.gid,
  selectedResources: ["gid://2"],
});
```

`page` and `all` are treated alike: selecting the page selects every resource passed
in, which is the set the table is rendering. `clearSelection` and
`removeSelectedResources` are what a page calls after a bulk action succeeds.

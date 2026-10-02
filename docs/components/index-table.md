# IndexTable

v12's resource table, on [`Table`](./table.md): the backbone of a list page.

```tsx
import { IndexTable, useIndexResourceState } from "@xco-agency/corex-ui";

const { selectedResources, allResourcesSelected, handleSelectionChange } =
  useIndexResourceState(orders);

<IndexTable
  resourceName={{ singular: "order", plural: "orders" }}
  headings={[{ title: "Order" }, { title: "Total", format: "currency" }]}
  itemCount={orders.length}
  selectedItemsCount={allResourcesSelected ? "All" : selectedResources.length}
  onSelectionChange={handleSelectionChange}
  bulkActions={[{ content: "Archive", onAction: archive }]}
  pagination={{ hasNext, onNext }}
>
  {orders.map((order) => (
    <IndexTable.Row
      key={order.id}
      id={order.id}
      selected={selectedResources.includes(order.id)}
      onClick={() => open(order)}
    >
      <IndexTable.Cell>{order.name}</IndexTable.Cell>
      <IndexTable.Cell>{order.total}</IndexTable.Cell>
    </IndexTable.Row>
  ))}
</IndexTable>;
```

| Prop                                  | Behavior                                                                                                                                                                                                 |
| ------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `headings`                            | `{ title, hidden, format }`. `format` is `s-table-header`'s own, so `numeric` and `currency` align the whole column.                                                                                     |
| `itemCount`                           | Drives the header checkbox and the `emptyState` switch.                                                                                                                                                  |
| `selectedItemsCount`                  | A count, or `"All"` when every row across every page is selected.                                                                                                                                        |
| `onSelectionChange`                   | v12's `(selectionType, toggleType, selection)`. The header checkbox reports `page`; a row reports `single` with its id.                                                                                  |
| `selectable`                          | `false` drops the selection column entirely.                                                                                                                                                             |
| `bulkActions` / `promotedBulkActions` | Shown once something is selected. Both render in one row; v12 drew the promoted ones ahead of the rest.                                                                                                  |
| `pagination`                          | v12's `{ hasPrevious, hasNext, onPrevious, onNext }` object, mapped onto `Table`'s flat props. Left in a rest spread it would land on `s-table` as an attribute and the list would have no pager at all. |
| `emptyState`                          | Replaces the whole table when `itemCount` is 0.                                                                                                                                                          |
| `hasZebraStriping`                    | Ignored: `s-table` draws its own rows.                                                                                                                                                                   |

Not reproduced: v12's shift-click range selection and its sticky header.

Clicking a row's checkbox does not open the row. The row's click is a native
listener on `s-table-row`, so the checkbox is wrapped in an element that stops the
event natively — a React `onClick` would run after the row had already opened.

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

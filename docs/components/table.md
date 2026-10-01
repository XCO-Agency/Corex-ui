# Table

Thin wrapper over `s-table` and its parts. Unlike an HTML `<table>`, there is **no
`thead` equivalent**: the header is a `Table.HeaderRow` holding one
`Table.HeaderCell` per column, placed directly inside `Table`.

```tsx
import { Table } from "@xco-agency/corex-ui";

<Table variant="auto">
  <Table.HeaderRow>
    <Table.HeaderCell>Order</Table.HeaderCell>
    <Table.HeaderCell>Customer</Table.HeaderCell>
    <Table.HeaderCell tooltip="Total including tax">Total</Table.HeaderCell>
  </Table.HeaderRow>

  <Table.Body>
    {orders.map((order) => (
      <Table.Row key={order.id}>
        <Table.Cell>{order.name}</Table.Cell>
        <Table.Cell>{order.customer}</Table.Cell>
        <Table.Cell>{order.total}</Table.Cell>
      </Table.Row>
    ))}
  </Table.Body>
</Table>;
```

## Parts

| Part                    | Element              | Notes                                                                      |
| ----------------------- | -------------------- | -------------------------------------------------------------------------- |
| `Table`                 | `s-table`            | Takes `variant`, `loading`, `paginate`, `hasPreviousPage`, `hasNextPage`.  |
| `Table.HeaderRow`       | `s-table-header-row` | The header **row**. Goes directly inside `Table`, with no section wrapper. |
| `Table.HeaderCell`      | `s-table-header`     | One header **cell**. Wraps its children in a `Text`; accepts `tooltip`.    |
| `Table.Header`          | `s-table-header`     | Deprecated alias of `Table.HeaderCell`, kept for existing call sites.      |
| `Table.Body`            | `s-table-body`       | Wraps the data rows.                                                       |
| `Table.Row`             | `s-table-row`        | Accepts `onClick` and `clickDelegate`.                                     |
| `Table.Cell`            | `s-table-cell`       | One data cell.                                                             |
| `Table.SubRowConnector` | — (inline SVG)       | Branch glyph for nested rows; `isLast` renders the terminal corner.        |
| `Table.ExpandButton`    | `s-button`           | Chevron toggle for expandable rows (`expanded`, `onToggle`).               |

## Common mistake

`Table.HeaderCell` is a cell, not a section. Using it as a wrapper around the header
row nests a row inside a cell and produces a run of nested `s-text`, which renders
without error and so survives review:

```tsx
// Wrong — a row nested inside a header cell.
<Table.HeaderCell>
  <Table.HeaderRow>
    <Table.HeaderCell>Order</Table.HeaderCell>
  </Table.HeaderRow>
</Table.HeaderCell>

// Right — the row is the outer element.
<Table.HeaderRow>
  <Table.HeaderCell>Order</Table.HeaderCell>
</Table.HeaderRow>
```

Because `Table.HeaderCell` already wraps its children in a `Text`, passing a `Text`
of your own nests one inside the other. Pass plain strings, or style the cell through
`Text`'s props on the surrounding `Table.HeaderCell` instead.

## Pagination

`paginate` turns on the element's own pagination controls; `hasPreviousPage` /
`hasNextPage` gate the buttons and `onPreviousPage` / `onNextPage` are bound to the
native `previouspage` / `nextpage` events.

```tsx
<Table
  paginate
  hasPreviousPage={page > 1}
  hasNextPage={page < pageCount}
  onPreviousPage={() => setPage((current) => current - 1)}
  onNextPage={() => setPage((current) => current + 1)}
>
  {/* ... */}
</Table>
```

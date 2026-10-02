# DataTable

v12's static data grid, on [`Table`](./table.md): headings and rows in, a table out.

```tsx
import { DataTable } from "@xco-agency/corex-ui";

<DataTable
  columnContentTypes={["text", "numeric", "numeric"]}
  headings={["Product", "Units", "Net sales"]}
  rows={[
    ["Shirt", "12", "$240.00"],
    ["Cap", "4", "$48.00"],
  ]}
/>;
```

| Prop                                                 | Behavior                                                                                                   |
| ---------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| `columnContentTypes`                                 | `numeric` sets the header's `format`, and the element aligns the column.                                   |
| `headings` / `rows`                                  | Nodes, not only strings.                                                                                   |
| `loading`                                            | Passed to `Table`.                                                                                         |
| `footerContent`                                      | Not rendered, and warns in development: `s-table` has no footer row. Pass totals as the last `rows` entry. |
| `increasedTableDensity`, `truncate`, `verticalAlign` | No `s-table` equivalent; ignored.                                                                          |

Sorting is not reproduced. When the list is interactive — selection, bulk actions,
paging — use [`IndexTable`](./index-table.md) instead.

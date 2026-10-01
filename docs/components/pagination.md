# Pagination

Previous/next paging.

```tsx
import { Pagination } from "@xco-agency/corex-ui";

<Pagination
  hasPrevious={page > 1}
  hasNext={page < pageCount}
  onPrevious={() => setPage(page - 1)}
  onNext={() => setPage(page + 1)}
  label={`${start} – ${end} of ${total}`}
/>;
```

| Prop                              | Behavior                                            |
| --------------------------------- | --------------------------------------------------- |
| `hasPrevious` / `hasNext`         | Disable the button at an edge with no page.         |
| `previousTooltip` / `nextTooltip` | Accessible names. Default to "Previous" and "Next". |
| `label`                           | Rendered between the buttons, in a subdued tone.    |

v12's `J`/`K` keyboard shortcuts are not reproduced. Inside a table,
[`Table`](./table.md)'s own `paginate` is the better control: the element draws the
pager where the admin expects it, and [`IndexTable`](./index-table.md) wires it from a
v12 `pagination` object.

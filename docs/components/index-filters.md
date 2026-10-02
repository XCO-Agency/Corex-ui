# IndexFilters

v12's search-and-filter bar, as an adapter over [`Filters`](./filters.md).

`Filters` already is the admin's filter toolbar — the token pills, a popover per
filter, the sort and columns popover. `IndexFilters` maps v12's prop names onto it
rather than building a second toolbar that would drift from the first.

```tsx
import {
  IndexFilters,
  IndexFiltersMode,
  useSetIndexFiltersMode,
} from "@xco-agency/corex-ui";

const { mode, setMode } = useSetIndexFiltersMode();

<IndexFilters
  mode={mode}
  setMode={setMode}
  tabs={[
    { id: "all", content: "All" },
    { id: "open", content: "Open", onAction: () => setStatus("open") },
  ]}
  selected={tab}
  onSelect={setTab}
  queryValue={query}
  queryPlaceholder="Search orders"
  onQueryChange={setQuery}
  onQueryClear={() => setQuery("")}
  filters={[{ key: "vendor", label: "Vendor", filter: <ChoiceList … /> }]}
  appliedFilters={applied}
  onClearAll={clearAll}
  sortOptions={[
    { value: "created_at desc", directionLabel: "Newest first" },
    { value: "created_at asc", directionLabel: "Oldest first" },
  ]}
  sortSelected={[sort]}
  onSort={([value]) => setSort(value)}
/>;
```

| Prop                                                                 | Behavior                                                                                                                                                                  |
| -------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `tabs` / `selected` / `onSelect`                                     | Rendered as the compact [`Tabs`](./tabs.md) view switcher. A tab's own `onAction` fires alongside `onSelect`, as in v12.                                                  |
| `queryValue` / `queryPlaceholder` / `onQueryChange` / `onQueryClear` | Passed to the toolbar's search field.                                                                                                                                     |
| `filters`                                                            | `{ key, label, filter }`. `filter` is the control shown in the filter's popover.                                                                                          |
| `appliedFilters`                                                     | Rendered as removable pills. `onRemove` is called with the filter key.                                                                                                    |
| `sortOptions` / `sortSelected` / `onSort`                            | v12 passed the sort as an array; the toolbar holds a single value, so `onSort` is called with a one-entry array. `directionLabel` is preferred over `label`.              |
| `trailing`                                                           | Controls that belong on the filter row but are not filters, e.g. a view toggle. v12 had no slot for this, so call sites positioned such controls absolutely over the bar. |
| `hideFilters`                                                        | Drops the filter control.                                                                                                                                                 |
| `disabled` / `loading`                                               | Both disable the toolbar.                                                                                                                                                 |

Node labels (`tabs[].content`, `filters[].label`, `appliedFilters[].label`) are
flattened to text, which is what the toolbar takes.

## Saved views

v12's saved views and the mode state machine behind them are not reproduced:
`canCreateNewView`, the default/filtering/editing-columns modes and their cancel and
save actions. Those props are accepted so call sites compile — `canCreateNewView`
warns in development — and `useSetIndexFiltersMode` still holds the mode:

```tsx
const { mode, setMode } = useSetIndexFiltersMode(IndexFiltersMode.Default);
```

Nothing in 2.x reads the mode. The hook exists because call sites destructure it at
the top of a component and pass it down, so without it they cannot compile at all.

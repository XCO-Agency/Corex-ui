# Autocomplete

Options in, selection out: the whole control in one component, as v12's was.

```tsx
import { Autocomplete } from "@xco-agency/corex-ui";

<Autocomplete
  textField={
    <Autocomplete.TextField
      label="Vendor"
      value={query}
      autoComplete="off"
      onChange={setQuery}
    />
  }
  options={matches.map((vendor) => ({ value: vendor.id, label: vendor.name }))}
  selected={selected}
  onSelect={setSelected}
  loading={isFetching}
  emptyState={<Text color="subdued">No vendors match</Text>}
  allowMultiple
/>;
```

| Prop            | Behavior                                                                             |
| --------------- | ------------------------------------------------------------------------------------ |
| `allowMultiple` | Toggles a value in and out of `selected`. Without it, a pick replaces the selection. |
| `loading`       | Shows `Listbox.Loading` in place of the options.                                     |
| `emptyState`    | Shown when there are no options.                                                     |
| `textField`     | The field. `Autocomplete.TextField` is [`TextField`](./text-field.md).               |

The list is a [`Listbox`](./listbox.md) displayed in a floating Popover overlay
anchored to the text field, so selection happens on pointer-down and the field keeps
focus without shifting the page layout.

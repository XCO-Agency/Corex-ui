# Autocomplete

Options in, selection out: the whole control in one component, built directly on top of Combobox.

```tsx
import { Autocomplete } from "@xco-agency/corex-ui";

<Autocomplete
  label="Vendor"
  placeholder="Search vendors"
  value={query}
  onChange={setQuery}
  options={matches.map((vendor) => ({ value: vendor.id, label: vendor.name }))}
  selected={selected}
  onSelect={setSelected}
  loading={isFetching}
  emptyState={<Text color="subdued">No vendors match</Text>}
/>;
```

| Prop           | Behavior                                                               |
| -------------- | ---------------------------------------------------------------------- |
| `options`      | Array of suggestion options (`{ value, label, disabled }`).            |
| `value`        | Current search query text.                                             |
| `onChange`     | Callback fired when search query changes.                              |
| `selected`     | Currently selected value (`string`).                                   |
| `onSelect`     | Callback fired when an option is selected (`(value: string) => void`). |
| `label`        | Label displayed above the field.                                       |
| `placeholder`  | Placeholder text inside the input.                                     |
| `autoComplete` | Browser autocomplete attribute (`default: "off"`).                     |
| `disabled`     | Disables the input field.                                              |
| `loading`      | Shows a spinner in place of options while fetching.                    |
| `emptyState`   | Content shown when no options match the query.                         |
| `open`         | Controlled open state of the suggestions popover.                      |
| `onClose`      | Callback when the suggestions popover closes.                          |

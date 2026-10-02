# Listbox

Options with selection, for use under a field — see
[`Combobox`](./combobox.md) and [`Autocomplete`](./autocomplete.md).

```tsx
import { Listbox } from "@xco-agency/corex-ui";

<Listbox accessibilityLabel="Tags" onSelect={pick}>
  <Listbox.Section title="Recent">
    <Listbox.Option value="sale" selected={selected.includes("sale")}>
      Sale
    </Listbox.Option>
  </Listbox.Section>
  <Listbox.Action onAction={createTag}>Add as a new tag</Listbox.Action>
</Listbox>;
```

| Part              | Behavior                                                                                           |
| ----------------- | -------------------------------------------------------------------------------------------------- |
| `Listbox`         | `role="listbox"`, with `onSelect` for every option under it.                                       |
| `Listbox.Option`  | `role="option"` with `aria-selected`. Takes `value`, `selected`, `disabled`, `accessibilityLabel`. |
| `Listbox.Section` | A titled `role="group"`. `divider` draws a rule above the heading.                                 |
| `Listbox.Header`  | A heading inside the list — not an option, and not announced as one.                               |
| `Listbox.Action`  | A trailing action, such as "Add as a new tag". Runs `onAction`, or selects `value`.                |
| `Listbox.Loading` | A spinner in a polite live region, for suggestions still being fetched.                            |

## Selection fires on pointer-down

An option selects on `mousedown`, not on click, so the field above keeps focus and
typing can continue straight after a pick — a click handler fires after the blur that
closes the list. Keyboard selection is handled from `keydown` (Enter or Space). There
is deliberately no click handler, which is also why a pointer pick cannot fire twice.

Arrow-key navigation between options is not reproduced: the options are real controls,
so tab and enter work. `autoSelection` is accepted, but only `AutoSelection.None` is
honoured — the other modes moved focus into the list as the user typed. Anything else
warns in development.

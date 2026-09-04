# ChoiceList

Controlled-form-input pattern over `s-choice-list`, like [`Select`](./select.md). See
[architecture.md](../architecture.md#2-controlled-form-input).

```tsx
import { ChoiceList } from "@xco/corex-ui";

<ChoiceList
  title="Notify me by"
  choices={[
    { label: "Email", value: "email" },
    { label: "SMS", value: "sms" },
  ]}
  selected={selected}
  onChange={(selected) => setSelected(selected)}
  allowMultiple
/>;
```

## Prop mapping

| Legacy prop     | Behavior                                                                                                 |
| --------------- | -------------------------------------------------------------------------------------------------------- |
| `title`         | Maps to `heading`.                                                                                       |
| `choices`       | Set as a live DOM property (`domProps`) since it's a non-primitive array.                                |
| `selected`      | Set as a live DOM property, so this stays genuinely controlled.                                          |
| `onChange`      | Bound to the native `change` event; called as `onChange(selected, name)`, matching the legacy signature. |
| `allowMultiple` | Maps to `multiple`.                                                                                      |
| `name`, `error` | Passed straight through.                                                                                 |

The exact `choices`/`selected` property shape is best-effort (no full API reference was
available for this element) — verify against your installed polaris-1.js.

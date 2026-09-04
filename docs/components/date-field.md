# DateField

Controlled-form-input pattern over `s-date-field`, identical shape to
[`TextField`](./text-field.md).

```tsx
import { DateField } from "@xco/corex-ui";

<DateField label="Start date" value={date} onChange={(value) => setDate(value)} />;
```

## Prop mapping

| Legacy prop                                | Behavior                                                                                         |
| ------------------------------------------ | ------------------------------------------------------------------------------------------------ |
| `value`                                    | Set as a live DOM property on every render.                                                      |
| `onChange`                                 | Fires on every keystroke, bound to the new element's `onInput`; called as `onChange(value, id)`. |
| `helpText`                                 | Maps to `details`.                                                                               |
| `label`, `disabled`, `error`, `id`, `name` | Passed straight through.                                                                         |

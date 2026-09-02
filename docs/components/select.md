# Select

Controlled-form-input pattern over `s-select`. See
[architecture.md](../architecture.md#2-controlled-form-input).

```tsx
import { Select } from "@xco/corex-ui";

<Select
  label="Country"
  value={country}
  onChange={(value) => setCountry(value)}
  options={[
    { label: "Canada", value: "ca" },
    "United States", // shorthand for { label: "United States", value: "United States" }
  ]}
/>;
```

## Prop mapping

| Legacy prop | Behavior |
| --- | --- |
| `options` | Each entry (a string, or `{ label, value, disabled }`) is rendered as a native `<option>` child, since `s-select` reads its options from light-DOM `<option>` elements like a native `<select>`. |
| `value` | Set as a live DOM property on every render, same as `TextField`. |
| `onChange` | Bound to the native `change` event; called as `onChange(value, id)`, matching the legacy signature. |
| `helpText` | Maps to `details`. |
| `label`, `disabled`, `error`, `placeholder`, `id`, `name` | Passed straight through. |

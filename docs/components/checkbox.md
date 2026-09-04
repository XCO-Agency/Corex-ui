# Checkbox

Controlled-form-input pattern over `s-checkbox`. See
[architecture.md](../architecture.md#2-controlled-form-input).

```tsx
import { Checkbox } from "@xco/corex-ui";

<Checkbox
  label="I accept the terms"
  checked={accepted}
  onChange={(checked) => setAccepted(checked)}
/>;
```

## Prop mapping

| Legacy prop                                | Behavior                                                                                                           |
| ------------------------------------------ | ------------------------------------------------------------------------------------------------------------------ |
| `checked`                                  | Set as a live DOM property on every render (never as an attribute), so this stays a genuinely controlled checkbox. |
| `onChange`                                 | Bound to the native `change` event; called as `onChange(checked, id)`, matching the legacy signature.              |
| `helpText`                                 | Maps to `details`.                                                                                                 |
| `label`, `disabled`, `error`, `id`, `name` | Passed straight through.                                                                                           |

# TextField

Controlled-form-input pattern over `s-text-field` (or `s-text-area` when `multiline` is set).
See [architecture.md](../architecture.md#2-controlled-form-input).

```tsx
import { TextField } from "@xco/corex-ui";

<TextField label="Name" value={name} onChange={(value) => setName(value)} />;
```

## Prop mapping

| Legacy prop | Behavior |
| --- | --- |
| `value` | Set as a live DOM property on every render (see [`assignDomProp`](../architecture.md#the-integration-layer-corecreatewebcomponent)), so this stays a genuinely controlled input. |
| `onChange` | Fires on every keystroke, exactly like legacy `TextField` — bound to the new element's `onInput`, **not** its own `onChange` (which only fires on blur/commit). |
| `onBlur`, `onFocus` | Passed straight through to the native `blur`/`focus` events. |
| `multiline` | `true` or a row-count number renders `s-text-area` instead of `s-text-field`; the row count is passed as `rows`. |
| `helpText` | Maps to `details`. |
| `requiredIndicator` | Maps to `required`. |
| `prefix`, `suffix` | Rendered as `<span slot="prefix">`/`<span slot="suffix">` children — best-effort slot names. |
| `label`, `placeholder`, `disabled`, `error`, `type`, `autoComplete`, `id`, `name`, `maxLength`, `minLength` | Passed straight through. |

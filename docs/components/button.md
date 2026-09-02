# Button

Thin wrapper over `s-button`. See [architecture.md](../architecture.md#1-thin-wrapper).

```tsx
import { Button } from "@xco/corex-ui";

<Button primary onClick={() => save()}>
  Save
</Button>;
```

## Prop mapping

| Legacy `@shopify/polaris` prop | `@xco/corex-ui` behavior |
| --- | --- |
| `children` / `content` | Either works; `content` is treated as an alias for `children`. |
| `primary` (deprecated in legacy) | Maps to `variant="primary"`. |
| `destructive` | Maps to `tone="critical"`. |
| `plain` | Maps to `variant="plain"`. |
| `variant`, `tone` | Passed straight through; take precedence over the legacy booleans above if both are given. |
| `url` | Maps to `href`. |
| `external` | Adds `target="_blank"` and `rel="noopener noreferrer"`. |
| `disabled`, `loading`, `submit`, `size`, `id`, `accessibilityLabel` | Passed straight through. |
| `fullWidth` | Forwarded best-effort — not confirmed against the current `s-button` API. |
| `pressed` | Forwarded best-effort; logs a dev-mode warning since there's no confirmed equivalent. |
| `slot` | Standard HTML attribute, useful for placing a `Button` into a parent's named slot (e.g. inside `Modal`'s action area). |

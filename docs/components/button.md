# Button

Thin wrapper over `s-button`. See [architecture.md](../architecture.md#1-thin-wrapper).

```tsx
import { Button } from "@xco-agency/corex-ui";

<Button primary onClick={() => save()}>
  Save
</Button>;
```

## Prop mapping

| Legacy `@shopify/polaris` prop                              | `@xco-agency/corex-ui` behavior                                                                                        |
| ----------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| `children` / `content`                                      | Either works; `content` is treated as an alias for `children`.                                                         |
| `primary` (deprecated in legacy)                            | Maps to `variant="primary"`.                                                                                           |
| `destructive`                                               | Maps to `tone="critical"`.                                                                                             |
| `plain`                                                     | Maps to `variant="plain"`.                                                                                             |
| `variant`, `tone`                                           | Passed straight through; take precedence over the legacy booleans above if both are given.                             |
| `url`                                                       | Maps to `href`.                                                                                                        |
| `external`                                                  | Adds `target="_blank"` and `rel="noopener noreferrer"`.                                                                |
| `disabled`, `loading`, `submit`, `id`, `accessibilityLabel` | Passed straight through.                                                                                               |
| `fullWidth`                                                 | Forwarded best-effort — not confirmed against the current `s-button` API.                                              |
| `pressed`                                                   | Forwarded best-effort; logs a dev-mode warning since there's no confirmed equivalent.                                  |
| `slot`                                                      | Standard HTML attribute, useful for placing a `Button` into a parent's named slot (e.g. inside `Modal`'s action area). |

## Accessible name

The name comes from `accessibilityLabel` when given, otherwise from the text found
anywhere in the children — so a button holding a glyph _and_ a label announces the
label, not a generated placeholder. An icon-only button with no `accessibilityLabel`
falls back to a generated name and warns in development; give those a label.

## v12 props with no `s-button` equivalent

| Gap                               | Behavior                                                                                                                                                                                                          |
| --------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `size`                            | Accepted and ignored, with a development warning. `s-button` has one height and the library ships no stylesheet to override it. For dense rows and inline row actions, `variant="tertiary"` is the quiet control. |
| `tone="success"` / `tone="magic"` | Fall back to the default tone, with a development warning. `s-button` tone is `auto`/`critical`/`neutral`, and the admin does not draw a filled green or violet button.                                           |

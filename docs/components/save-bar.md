# SaveBar

App Bridge component — see [app-bridge.md](../app-bridge.md#savebar) for full examples,
including the simpler `data-save-bar` form-attribute pattern for same-page forms. Wraps
`<ui-save-bar>` — note this is a _different_ custom element namespace from every other
component in this library (`ui-*`, not `s-*`).

```tsx
import { SaveBar, useSaveBar } from "@xco/corex-ui";

const saveBar = useSaveBar();

<SaveBar id="modal-save-bar">
  <button onClick={handleSave}>Save</button>
  <button onClick={() => saveBar.hide("modal-save-bar")}>Discard</button>
</SaveBar>;
```

## Prop mapping

| Legacy prop | Behavior                                                                                                                                         |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `id`        | Required — referenced by `useSaveBar().show(id)`/`.hide(id)`.                                                                                    |
| `children`  | Rendered as-is. Shopify's own examples nest plain `<button>` elements, not Polaris `Button` — this wrapper doesn't constrain what you nest here. |

Visibility is controlled externally via `useSaveBar()`, not a prop on this component — see
[`useSaveBar`](../app-bridge.md#savebar).

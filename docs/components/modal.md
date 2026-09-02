# Modal

Composed / imperative-bridge pattern over `s-modal`. See
[architecture.md](../architecture.md#3-composed--imperative-bridge) for how the legacy
`open`/`onClose` API is bridged onto the element's imperative `show()`/`hideOverlay()` methods.

```tsx
import { Modal, Text } from "@xco/corex-ui";

<Modal
  open={open}
  onClose={() => setOpen(false)}
  title="Delete product"
  primaryAction={{ content: "Delete", destructive: true, onAction: handleDelete }}
  secondaryActions={[{ content: "Cancel", onAction: () => setOpen(false) }]}
>
  <Text>This can't be undone.</Text>
</Modal>;
```

## Prop mapping

| Legacy prop | Behavior |
| --- | --- |
| `open` | Watched in an effect; calls the element's `show()`/`hideOverlay()` accordingly. `Modal` still owns no internal open state, exactly like legacy `Modal`. |
| `onClose` | Called both when you set `open={false}` yourself and when the element dispatches its native `close` event (e.g. the user presses Escape or clicks the backdrop). |
| `title` | Maps to `heading`. |
| `primaryAction` | Rendered as a `Button` with `slot="primary-action"` and `primary` set, since the underlying element only accepts a primary-variant Button in that slot. |
| `secondaryActions` | Rendered as `Button`s with `slot="secondary-actions"`. |

The exact slot names (`primary-action`/`secondary-actions`) and the `close` event name are
best-effort based on Shopify's public usage examples, not a fully confirmed reference — verify
against your installed `polaris-1.x` version if actions don't render where expected.

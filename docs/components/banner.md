# Banner

Thin wrapper over `s-banner`.

```tsx
import { Banner } from "@xco/corex-ui";

<Banner title="Heads up" tone="warning" onDismiss={() => setVisible(false)}>
  Some line items are out of stock.
</Banner>;
```

## Prop mapping

| Legacy prop | Behavior |
| --- | --- |
| `title` | Maps to `heading`. |
| `status` (deprecated in legacy) | Maps to `tone`; `tone` takes precedence if both are given. |
| `onDismiss` | Bound to the element's native `dismiss` event; also sets `dismissible` automatically when provided. |

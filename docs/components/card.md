# Card

Composed pattern: there is no `s-card` element, so `Card` renders an `s-section` with an
optional heading composed from [`Text`](./text.md). See
[architecture.md](../architecture.md#3-composed--imperative-bridge).

```tsx
import { Card } from "@xco/corex-ui";

<Card title="Shipping address">
  <p>123 Main St.</p>
</Card>;
```

## Prop mapping

| Legacy prop | Behavior |
| --- | --- |
| `title` | Rendered as a `Text` heading above `children`. |
| `padding`, `background` | Passed through to the underlying `s-section`. |
| `sectioned` | **No effect** — every `Card` already renders as a single section. Logs a dev-mode warning if passed. |

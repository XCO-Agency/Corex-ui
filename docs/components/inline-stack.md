# InlineStack

Composed pattern: `s-stack` pinned to `direction="inline"`. See
[`BlockStack`](./block-stack.md) for the vertical equivalent and
[architecture.md](../architecture.md#3-composed--imperative-bridge).

```tsx
import { Button, InlineStack } from "@xco/corex-ui";

<InlineStack gap="200">
  <Button>Save</Button>
  <Button plain>Cancel</Button>
</InlineStack>;
```

## Prop mapping

| Legacy prop | Behavior |
| --- | --- |
| `gap`, `align`, `blockAlign`, `wrap` | Passed straight through to `s-stack`. |

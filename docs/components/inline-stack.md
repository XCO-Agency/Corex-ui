# InlineStack

Composed pattern: `s-stack` pinned to `direction="inline"`. See
[`BlockStack`](./block-stack.md) for the vertical equivalent and
[architecture.md](../architecture.md#3-composed--imperative-bridge).

```tsx
import { Button, InlineStack } from "@xco/corex-ui";

<InlineStack gap="small-200">
  <Button>Save</Button>
  <Button plain>Cancel</Button>
</InlineStack>;
```

## Prop mapping

| Prop | Behavior |
| --- | --- |
| `gap` | Accepts Polaris web-component spacing tokens (`small-200`, `base`, etc.). Legacy numeric values (e.g. `"200"`) are automatically translated for backward compatibility. |
| `align`, `blockAlign`, `wrap` | Passed straight through to `s-stack`. |

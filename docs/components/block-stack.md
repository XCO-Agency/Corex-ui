# BlockStack

Composed pattern: `s-stack` pinned to `direction="block"`. See
[architecture.md](../architecture.md#3-composed--imperative-bridge). Its sibling,
[`InlineStack`](./inline-stack.md), pins the same element to `direction="inline"`.

```tsx
import { BlockStack, Text } from "@xco/corex-ui";

<BlockStack gap="400">
  <Text>First</Text>
  <Text>Second</Text>
</BlockStack>;
```

## Prop mapping

| Legacy prop | Behavior |
| --- | --- |
| `gap`, `align`, `inlineAlign` | Passed straight through to `s-stack`. |

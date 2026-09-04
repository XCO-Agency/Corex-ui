# BlockStack

Composed pattern: `s-stack` pinned to `direction="block"`. See
[architecture.md](../architecture.md#3-composed--imperative-bridge). Its sibling,
[`InlineStack`](./inline-stack.md), pins the same element to `direction="inline"`.

```tsx
import { BlockStack, Text } from "@xco/corex-ui";

<BlockStack gap="base">
  <Text>First</Text>
  <Text>Second</Text>
</BlockStack>;
```

## Prop mapping

| Prop                   | Behavior                                                                                                                                                                |
| ---------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `gap`                  | Accepts Polaris web-component spacing tokens (`small-200`, `base`, etc.). Legacy numeric values (e.g. `"400"`) are automatically translated for backward compatibility. |
| `align`, `inlineAlign` | Passed straight through to `s-stack`.                                                                                                                                   |

# TextContainer

A column of prose at v12's rhythm, on [`BlockStack`](./block-stack.md). The spacing
is the whole component.

```tsx
import { Text, TextContainer } from "@xco-agency/corex-ui";

<TextContainer spacing="tight">
  <Text heading>Shipping</Text>
  <Text>Rates are calculated at checkout.</Text>
</TextContainer>;
```

`spacing` is `loose` (`base`, the default) or `tight` (`small-200`).

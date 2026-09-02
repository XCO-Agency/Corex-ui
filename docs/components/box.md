# Box

Thin wrapper over `s-box`, Polaris's generic layout primitive.

```tsx
import { Box } from "@xco/corex-ui";

<Box padding="400" background="bg-surface-secondary">
  Content
</Box>;
```

## Prop mapping

All props (`padding`, `background`, `borderRadius`, `borderWidth`, `borderColor`, `minWidth`,
`maxWidth`, `width`) are passed straight through — legacy `Box` prop names already match
`s-box` attribute names.

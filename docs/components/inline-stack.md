# InlineStack

Horizontal layout primitive that arranges child elements in a flex row. Renders as a native `<div>` with flexbox styles, providing full Polaris spacing token compatibility and standard flex controls.

See [`BlockStack`](./block-stack.md) for the vertical equivalent.

```tsx
import { Button, InlineStack } from "@xco-agency/corex-ui";

<InlineStack gap="small-200" alignItems="center" wrap>
  <Button>Save</Button>
  <Button plain>Cancel</Button>
</InlineStack>;
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `gap` | `StackGapType` | `undefined` | Spacing between children. Accepts modern Polaris spacing tokens (`"small-200"`, `"base"`, etc.), legacy numeric tokens (`"200"`, `"400"`), numbers, or CSS lengths. |
| `rowGap` | `StackGapType` | `undefined` | Spacing between rows. |
| `columnGap` | `StackGapType` | `undefined` | Spacing between columns. |
| `justifyContent` | `CSSProperties["justifyContent"]` | `undefined` | Horizontal alignment along the main axis. |
| `alignItems` | `CSSProperties["alignItems"]` | `undefined` | Vertical alignment along the cross axis. |
| `align` | `InlineAlignmentType` | `undefined` | Deprecated legacy alias for `justifyContent`. |
| `blockAlign` | `BlockAlignmentType` | `undefined` | Deprecated legacy alias for `alignItems`. |
| `alignContent` | `CSSProperties["alignContent"]` | `undefined` | Cross-axis alignment when multiple lines wrap. |
| `direction` | `StackDirectionType` | `"row"` | Flex direction (`"row"`, `"row-reverse"`, `"column"`, `"column-reverse"`, `"inline"`, `"block"`). |
| `wrap` | `boolean \| CSSProperties["flexWrap"]` | `undefined` | Enables flex wrapping (`true` -> `"wrap"`, `false` -> `"nowrap"`). |
| `grow` | `boolean \| number \| CSSProperties["flexGrow"]` | `undefined` | Flex grow factor (`true` -> `1`, `false` -> `0`). |
| `shrink` | `boolean \| number \| CSSProperties["flexShrink"]` | `undefined` | Flex shrink factor (`false` -> `0`, `true` -> `1`). |
| `flex` | `CSSProperties["flex"] \| number` | `undefined` | Shorthand flex property. |
| `order` | `CSSProperties["order"]` | `undefined` | Flex order. |
| `inline` | `boolean` | `false` | Renders as inline flex container (`display: inline-flex`). |
| `padding` | `BoxPaddingType` | `undefined` | Padding using Polaris spacing tokens or CSS lengths. |
| `style` | `CSSProperties` | `undefined` | Custom inline CSS styles. |
| `className` | `string` | `undefined` | Custom CSS class name. |
| `as` | `ElementType` | `"div"` | HTML tag or React component to render as. |

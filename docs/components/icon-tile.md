# IconTile

A stylized background tile for icons, frequently used in feature lists, onboarding steps, and status cards.

```tsx
import { IconTile, Icon } from "@xco-agency/corex-ui";

<IconTile tone="success">
  <Icon type="check" tone="auto" />
</IconTile>
```

## Props

| Prop           | Type                                                                       | Default     | Description                                                                                     |
| -------------- | -------------------------------------------------------------------------- | ----------- | ----------------------------------------------------------------------------------------------- |
| `tone`         | `"success" \| "neutral" \| "subdued" \| "caution" \| "info" \| "critical"` | `"success"` | Visual color tone for the tile background and foreground icon.                                  |
| `color`        | `"base" \| "strong"`                                                       | `"base"`    | Color intensity: `"base"` for subtle pastel tint, `"strong"` for solid saturated background.    |
| `size`         | `"sm" \| "md" \| "lg"`                                                     | `"md"`      | Tile dimensions: `"sm"` (21px), `"md"` (40px), `"lg"` (44px).                                   |
| `borderRadius` | `"none" \| "small" \| "base" \| "large" \| "full"`                         | `"base"`    | Border radius of the tile container.                                                           |
| `style`        | `CSSProperties`                                                            | `undefined` | Custom inline CSS styles forwarded to the tile wrapper.                                         |
| `className`    | `string`                                                                   | `undefined` | Custom CSS class name.                                                                          |
| `children`     | `ReactNode`                                                                | `undefined` | The icon or child elements to render inside the tile.                                           |

## Color Intensity (`base` vs `strong`)

Use `color="base"` (default) for subtle tinted backgrounds, and `color="strong"` for saturated solid backgrounds. Strong tiles pair naturally with `<Icon tone="white" />`:

```tsx
// Subtle base tint (default)
<IconTile tone="success" color="base">
  <Icon type="check" tone="auto" />
</IconTile>

// Strong solid fill with white icon
<IconTile tone="success" color="strong">
  <Icon type="check" tone="white" />
</IconTile>

<IconTile tone="critical" color="strong">
  <Icon type="delete" tone="white" />
</IconTile>
```

## Sizes

```tsx
<IconTile size="sm" tone="success">
  <Icon type="check" tone="auto" />
</IconTile>

<IconTile size="md" tone="success">
  <Icon type="check" tone="auto" />
</IconTile>

<IconTile size="lg" tone="success">
  <Icon type="check" tone="auto" />
</IconTile>
```

## Border Radius

```tsx
<IconTile borderRadius="none" tone="neutral">
  <Icon type="apps" tone="auto" />
</IconTile>

<IconTile borderRadius="small" tone="neutral">
  <Icon type="apps" tone="auto" />
</IconTile>

<IconTile borderRadius="base" tone="neutral">
  <Icon type="apps" tone="auto" />
</IconTile>

<IconTile borderRadius="large" tone="neutral">
  <Icon type="apps" tone="auto" />
</IconTile>

<IconTile borderRadius="full" tone="neutral">
  <Icon type="apps" tone="auto" />
</IconTile>
```

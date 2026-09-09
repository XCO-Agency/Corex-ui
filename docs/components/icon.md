# Icon

Thin wrapper over `s-icon`.

```tsx
import { Icon } from "@xco-agency/corex-ui";

<Icon type="save" accessibilityLabel="Save" />;
```

## Prop mapping

| Prop                 | Behavior                                                                                       |
| -------------------- | ---------------------------------------------------------------------------------------------- |
| `source`             | Maps to `s-icon`'s `type` attribute or renders custom React SVG component.                    |
| `type`               | Maps to `s-icon`'s `type` attribute directly (e.g. `"save"`, `"star"`).                         |
| `tone`               | Polaris tone (`"auto"`, `"info"`, `"success"`, `"caution"`, `"warning"`, `"critical"`, `"neutral"`). Supports `"white"` for white icons. |
| `accessibilityLabel` | Passed through to `aria-label` attribute.                                                      |
| `style`              | Custom inline CSS styles forwarded to the icon element.                                       |

## White Icon Usage

Use `tone="white"` when rendering icons on dark backgrounds or inside strong `IconTile` containers:

```tsx
import { Icon, IconTile } from "@xco-agency/corex-ui";

// Standalone on dark surface
<Icon type="star" tone="white" accessibilityLabel="Star" />

// Inside strong-colored IconTile
<IconTile tone="critical" color="strong" size="sm">
  <Icon type="delete" tone="white" />
</IconTile>
```


# RangeSlider

Self-contained custom control — see
[architecture.md](../architecture.md#5-self-contained-custom-control). Shopify's Polaris web
component catalog has no `s-range-slider` (or any slider) element, so this is ported directly
from legacy `@shopify/polaris`'s `RangeSlider` implementation rather than wrapping an `s-*` tag:
same drag/keyboard/touch behavior, same track-gradient-fill and floating-value-bubble styling,
restyled with inline `style` + Polaris CSS tokens (`var(--p-color-*)`) instead of the original's
SCSS modules.

```tsx
import { RangeSlider } from "@xco-agency/corex-ui";

// Single handle
<RangeSlider
  label="Opacity"
  value={opacity}
  onChange={(value) => setOpacity(value as number)}
/>;

// Dual handle — pass a [lower, upper] tuple
<RangeSlider
  label="Price range"
  min={0}
  max={1000}
  value={priceRange}
  onChange={(value) => setPriceRange(value as [number, number])}
  output
/>;
```

Renders two handles whenever `value` is an array (`[number, number]`), one otherwise — matching
legacy Polaris's own `RangeSlider` dispatch rule.

## Prop mapping

| Legacy prop                                                | Behavior                                                                                                                           |
| ---------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| `value`                                                    | `number` renders a native `<input type="range">`; a `[lower, upper]` tuple renders two draggable/keyboard-operable custom handles. |
| `onChange`                                                 | Called as `onChange(value, id)` on every drag/keystroke, matching the legacy signature.                                            |
| `min`, `max`, `step`                                       | Passed straight through. Default to `0`, `100`, `1`.                                                                               |
| `output`                                                   | Shows a floating value bubble above the handle while hovering, dragging, or focused.                                               |
| `label`, `labelAction`, `labelHidden`, `helpText`, `error` | Rendered by an internal label/help-text/error block (no native element provides this, unlike other form fields in this library).   |
| `prefix`, `suffix`, `disabled`, `id`, `onFocus`, `onBlur`  | Passed straight through.                                                                                                           |

## Caveat

Dual-handle boundary clamping (a handle can't cross its sibling minus one `step`) is a no-op
guard: if a keyboard/drag move would land on the value already held, `onChange` is not called
again, matching legacy Polaris's behavior of only firing on an actual value change.

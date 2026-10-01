# Scrollable

A pane that scrolls inside a fixed size, on `s-scroll-box` — the native equivalent,
so the admin's own scrollbars and scroll snapping come with it.

```tsx
import { Scrollable } from "@xco-agency/corex-ui";

<Scrollable maxBlockSize="20rem" focusable>
  {rows}
</Scrollable>;
```

| Prop                      | Behavior                                                                                                                                                |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `horizontal` / `vertical` | v12 scrolled one axis at a time. These map onto the element's two-value `overflow` shorthand; passing neither leaves the element's own `auto` in place. |
| `overflow`                | Passed straight through, as one keyword or a block/inline pair.                                                                                         |
| `focusable`               | Gives the pane `tabindex="0"` so a keyboard user can scroll it.                                                                                         |
| `shadow` / `hint`         | No `s-scroll-box` equivalent. Ignored, and warn in development.                                                                                         |

Sizing comes from the Box props the element shares, such as `maxBlockSize` — a pane
with no size constraint has nothing to scroll.

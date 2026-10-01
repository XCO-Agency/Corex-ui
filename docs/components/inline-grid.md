# InlineGrid

Equal (or explicitly tracked) columns on one row, on [`Grid`](./grid.md).

```tsx
import { InlineGrid } from "@xco-agency/corex-ui";

<InlineGrid columns={{ xs: 1, md: 3 }} gap="base">
  <Card>One</Card>
  <Card>Two</Card>
  <Card>Three</Card>
</InlineGrid>;
```

`columns` takes all three shapes v12 accepted:

| Value                       | Result                                                                              |
| --------------------------- | ----------------------------------------------------------------------------------- |
| `3`                         | Three equal tracks (`1fr 1fr 1fr`).                                                 |
| `"1fr auto"`                | Used as the track list verbatim.                                                    |
| `["oneThird", "twoThirds"]` | v12's fraction names, resolved to `1fr 2fr`.                                        |
| `{ xs: 1, md: 3 }`          | Resolved against the current breakpoint, cascading down to the nearest smaller one. |

Fraction names map as `oneFourth`/`oneThird`/`oneHalf` → `1fr`, `twoThirds` → `2fr`,
`threeFourths` → `3fr`: the names only ever described a ratio between siblings.

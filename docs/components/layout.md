# Layout

v12's page grid, on [`Grid`](./grid.md). Twelve columns, so halves, thirds and
quarters all land on a track boundary, and everything stacks below Polaris's `md`
breakpoint rather than squeezing several columns onto a phone.

```tsx
import { Layout } from "@xco-agency/corex-ui";

<Layout>
  <Layout.Section variant="oneThird">
    <Card>Filters</Card>
  </Layout.Section>
  <Layout.Section>
    <Card>Results</Card>
  </Layout.Section>
</Layout>;
```

| Prop                                 | Behavior                                                                                                           |
| ------------------------------------ | ------------------------------------------------------------------------------------------------------------------ |
| `Layout.gap`                         | Space between sections. Defaults to `base`.                                                                        |
| `Layout.Section.variant`             | `oneHalf` (6 columns), `oneThird` (4), `oneFourth` (3), `fullWidth` (12). A section with no variant is full width. |
| `fullWidth` / `oneThird` / `oneHalf` | v12's booleans, kept as aliases of `variant`.                                                                      |

v12's `Layout.AnnotatedSection` is not included: it was a titled section, which is a
`Layout.Section` holding a `BlockStack` with a `Text` above the card.

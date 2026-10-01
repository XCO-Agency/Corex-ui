# SkeletonPage

A page-shaped loading state: a title row, optionally with an action, above whatever
placeholders the page passes as children.

```tsx
import { Card, Skeleton, SkeletonPage } from "@xco-agency/corex-ui";

<SkeletonPage title={<Text heading>Orders</Text>} primaryAction>
  <Card>
    <Skeleton height="1rem" />
    <Skeleton height="1rem" width="60%" />
  </Card>
</SkeletonPage>;
```

| Prop                        | Behavior                                                                                                                                        |
| --------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| `title`                     | `true` (the default) draws a grey bar; a node renders as-is, which reads better when the page already knows its heading; `false` draws nothing. |
| `primaryAction`             | Adds a placeholder button to the title row.                                                                                                     |
| `narrowWidth` / `fullWidth` | Ignored. Wrap in a [`Page`](./page.md) for page width.                                                                                          |

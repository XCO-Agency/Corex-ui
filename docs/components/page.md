# Page

Composed pattern: top-level layout wrapper over `s-page`. `primaryAction`/`secondaryActions`
follow the same `Button`-composition convention as [`Modal`](./modal.md). See
[architecture.md](../architecture.md#3-composed--imperative-bridge).

```tsx
import { Page } from "@xco/corex-ui";

<Page
  title="Products"
  subtitle="Manage your catalog"
  primaryAction={{ content: "Add product", onAction: openCreateModal }}
>
  {/* page content */}
</Page>;
```

## Prop mapping

| Legacy prop | Behavior |
| --- | --- |
| `title` | Maps to `heading`. |
| `subtitle` | Maps to `subheading`. |
| `primaryAction` | Rendered as a `Button` with `slot="primary-action"` and `primary` set. |
| `secondaryActions` | Rendered as `Button`s with `slot="secondary-actions"`. |
| `backAction` | **No confirmed equivalent** on `s-page` yet — accepted for API compatibility only and logs a dev-mode warning; currently has no visual effect. |
| `fullWidth` | Passed straight through. |

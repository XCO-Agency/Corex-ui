# Menu

Thin wrapper over `s-menu`, holding `Button` children. Part of the [App Bridge](../app-bridge.md)
subsystem — pair it with a trigger `Button` using `commandFor`.

```tsx
import { Button, Menu } from "@xco/corex-ui";

<Button commandFor="actions-menu" icon="menu">More actions</Button>
<Menu id="actions-menu">
  <Button icon="duplicate">Duplicate</Button>
  <Button icon="archive">Archive</Button>
  <Button icon="delete" destructive>Delete</Button>
</Menu>;
```

## Prop mapping

| Legacy prop | Behavior |
| --- | --- |
| `id` | Required — referenced by a trigger `Button`'s `commandFor`. |
| `children` | `Button` elements, one per menu item. |

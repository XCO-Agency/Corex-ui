# ButtonGroup

Thin wrapper over `s-button-group`. Each child `Button` is assigned to a slot: `variant="primary"` (or the legacy `primary` flag) becomes `slot="primary-action"`, and every other button becomes `slot="secondary-actions"`. A button the secondary slot would reject (`primary` when `gap="none"`, `tertiary`, and so on) is rendered as `variant="secondary"` so it stays visible. An explicit `slot` is left as-is. `primary-action` is not used when `gap="none"` (including `variant="segmented"`).

```tsx
import { Button, ButtonGroup } from "@xco-agency/corex-ui";

<ButtonGroup variant="segmented">
  <Button>One</Button>
  <Button>Two</Button>
</ButtonGroup>;
```

## Prop mapping

| Legacy prop                              | Behavior                               |
| ---------------------------------------- | -------------------------------------- |
| `children`                               | `Button` children, placed in `primary-action` or `secondary-actions`. |
| `variant` (`"segmented"` \| `"default"`) | Passed straight through.               |
| `fullWidth`                              | Passed straight through.               |

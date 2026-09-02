# ButtonGroup

Thin wrapper over `s-button-group`, which accepts `<Button>` children directly.

```tsx
import { Button, ButtonGroup } from "@xco/corex-ui";

<ButtonGroup variant="segmented">
  <Button>One</Button>
  <Button>Two</Button>
</ButtonGroup>;
```

## Prop mapping

| Legacy prop | Behavior |
| --- | --- |
| `children` | Rendered as-is; use `Button` children. |
| `variant` (`"segmented"` \| `"default"`) | Passed straight through. |
| `fullWidth` | Passed straight through. |

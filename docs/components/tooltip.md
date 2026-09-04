# Tooltip

Composed pattern over `s-tooltip`: the default-slotted child is the trigger, and `content` is
rendered into a `slot="content"` child. Unlike `Modal`, there's no imperative bridge — tooltips
are natively hover/focus-driven by the element itself.

```tsx
import { Tooltip } from "@xco/corex-ui";

<Tooltip content="Deletes the item permanently">
  <Button destructive>Delete</Button>
</Tooltip>;
```

## Prop mapping

| Legacy prop | Behavior                                                                                                  |
| ----------- | --------------------------------------------------------------------------------------------------------- |
| `children`  | The trigger element.                                                                                      |
| `content`   | Rendered in a `slot="content"` child — best-effort slot name, verify against your installed polaris-1.js. |

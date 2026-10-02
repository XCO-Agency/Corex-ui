# Avatar

Thin wrapper over `s-avatar`.

```tsx
import { Avatar } from "@xco-agency/corex-ui";

<Avatar name="Ada Lovelace" initials="AL" />;
```

## Prop mapping

| Legacy prop                          | Behavior                                                                                                                                      |
| ------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------- |
| `name`, `initials`, `source`, `size` | Passed straight through. `source` and `image` map to `src`.                                                                                   |
| `customer`                           | Accepted and ignored, with a development warning: `s-avatar` renders initials or a generic person, and v12's variant only changed that glyph. |

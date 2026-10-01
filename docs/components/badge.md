# Badge

Thin wrapper over `s-badge`.

```tsx
import { Badge } from "@xco-agency/corex-ui";

<Badge tone="success">Active</Badge>;
```

## Prop mapping

| Legacy prop                | Behavior                                                                |
| -------------------------- | ----------------------------------------------------------------------- |
| `tone`, `size`, `progress` | Passed straight through.                                                |
| `status`                   | v12's name for `tone`. `caution` maps to `warning`, `new` to `info`.    |
| `tone="attention"`         | Maps to `caution` — it is a caution by another name.                    |
| `tone="magic"`             | Maps to `info`. `magic` marked AI features and reads closest to `info`. |

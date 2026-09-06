# Icon

Thin wrapper over `s-icon`.

```tsx
import { Icon } from "@xco-agency/corex-ui";

<Icon type="save" accessibilityLabel="Save" />;
```

## Prop mapping

| Legacy prop                  | Behavior                                                                                       |
| ---------------------------- | ---------------------------------------------------------------------------------------------- |
| `source`                     | Maps to `s-icon`'s `type` attribute — best-effort, verify against your installed polaris-1.js. |
| `tone`, `accessibilityLabel` | Passed straight through.                                                                       |

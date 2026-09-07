# Text

Thin wrapper over `s-text`.

```tsx
import { Text } from "@xco-agency/corex-ui";

<Text heading tone="success">
  Order confirmed
</Text>;
```

## Prop mapping

| Legacy prop                   | Behavior                                                                                                        |
| ----------------------------- | --------------------------------------------------------------------------------------------------------------- |
| `variant`, `tone`, `truncate` | Passed straight through.                                                                                        |
| `as`                          | Accepted for API compatibility only — `s-text` always renders as its own element, so this has no visual effect. |

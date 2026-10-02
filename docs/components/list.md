# List

`s-unordered-list` / `s-ordered-list` with `s-list-item`, under v12's names.

```tsx
import { List } from "@xco-agency/corex-ui";

<List type="number">
  <List.Item>Connect your store</List.Item>
  <List.Item>Import products</List.Item>
</List>;
```

| Prop   | Behavior                                                                          |
| ------ | --------------------------------------------------------------------------------- |
| `type` | `bullet` (default) renders `s-unordered-list`, `number` renders `s-ordered-list`. |
| `gap`  | Ignored, and warns in development: the native lists own their spacing.            |

`List.Item` is also exported as `ListItem`.

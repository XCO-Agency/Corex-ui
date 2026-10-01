# DescriptionList

Term/description pairs in two columns, as a real `dl` so the pairing lives in the
markup rather than only in the layout.

```tsx
import { DescriptionList } from "@xco-agency/corex-ui";

<DescriptionList
  items={[
    { term: "Status", description: "Fulfilled" },
    { term: "Carrier", description: "DHL" },
  ]}
/>;
```

| Prop    | Behavior                                                |
| ------- | ------------------------------------------------------- |
| `items` | `{ term, description }` pairs. Both take any node.      |
| `gap`   | `loose` (`base`, the default) or `tight` (`small-200`). |

The terms column sizes to its content and the descriptions take the rest. Terms are
rendered at medium weight and descriptions in a subdued tone, matching v12.

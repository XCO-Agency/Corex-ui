# Tag

A pill, on `s-chip`.

```tsx
import { Tag } from "@xco-agency/corex-ui";

<Tag onRemove={() => removeFilter("vendor")}>Vendor: Acme</Tag>;
```

| Prop        | Behavior                                                                                                                           |
| ----------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| `onRemove`  | Passing a handler makes the tag removable, as in v12: the element draws its own remove control and fires `remove` when it is used. |
| `disabled`  | Keeps the tag fixed — removable is switched off rather than drawn and ignored.                                                     |
| `removable` | The native prop, if you want it set independently of `onRemove`.                                                                   |
| `url`       | Ignored, and warns in development. Wrap the tag in a `Link` instead.                                                               |

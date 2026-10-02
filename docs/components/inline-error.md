# InlineError

The message under a field that failed validation.

```tsx
import { InlineError, TextField } from "@xco-agency/corex-ui";

<>
  <TextField id="email" label="Email" value={email} onChange={setEmail} />
  <InlineError message={errors.email} fieldID="email" />
</>;
```

| Prop      | Behavior                                                                                                                                         |
| --------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `message` | Nothing renders without one, so call sites can render it unconditionally as they did in v12.                                                     |
| `fieldID` | Gives the error the id `${fieldID}-error`, which the field can point at with `aria-describedby`. That link is the whole reason v12 asked for it. |

Most fields already render their own `error` text; reach for `InlineError` when the
message belongs to a group of controls rather than to one field.

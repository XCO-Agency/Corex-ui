# FormLayout

Fields in a column. A `Group` puts them on one row that wraps rather than
overflowing, which is what v12 did at narrow widths.

```tsx
import { FormLayout, TextField } from "@xco-agency/corex-ui";

<FormLayout>
  <TextField label="Store name" value={name} onChange={setName} />
  <FormLayout.Group>
    <TextField label="City" value={city} onChange={setCity} />
    <TextField label="Postcode" value={postcode} onChange={setPostcode} />
  </FormLayout.Group>
</FormLayout>;
```

| Prop                                  | Behavior                                                                                       |
| ------------------------------------- | ---------------------------------------------------------------------------------------------- |
| `gap`                                 | Space between fields. Defaults to `base`.                                                      |
| `FormLayout.Group.condensed`          | Tightens the row to `small-200`.                                                               |
| `FormLayout.Group.title` / `helpText` | Not rendered, and warn in development. Wrap the group in a `BlockStack` with a `Text` instead. |

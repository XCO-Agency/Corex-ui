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
| `inlineSize`                          | Width of the form layout. Defaults to `100%`.                                                  |
| `FormLayout.Group.condensed`          | Tightens the row gap to `small-200` instead of `base`.                                         |
| `FormLayout.Group.title`              | Group title/heading rendered above the fields.                                                 |
| `FormLayout.Group.helpText`           | Help text rendered beneath the fields in a subdued tone.                                       |
| `FormLayout.Group.columns`            | Custom columns count or responsive spec (defaults to equal `1fr` columns across children).    |


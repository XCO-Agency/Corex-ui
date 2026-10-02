# RadioButton

One radio, as a single-choice `s-choice-list`.

```tsx
import { RadioButton } from "@xco-agency/corex-ui";

<>
  <RadioButton
    id="fixed"
    name="plan"
    value="FIXED"
    label="Fixed amount"
    helpText="Charged once"
    checked={plan === "FIXED"}
    onChange={() => setPlan("FIXED")}
  />
  <RadioButton
    id="lifetime"
    name="plan"
    value="LIFETIME"
    label="Lifetime"
    checked={plan === "LIFETIME"}
    onChange={() => setPlan("LIFETIME")}
  />
</>;
```

| Prop       | Behavior                                                      |
| ---------- | ------------------------------------------------------------- |
| `value`    | What this radio contributes to its group. Falls back to `id`. |
| `name`     | Radios sharing a name form one group.                         |
| `onChange` | v12's `(checked, id)`.                                        |
| `label`    | Takes a node, flattened to text — `s-choice` labels are text. |
| `helpText` | Rendered as the choice's details.                             |

Built on [`ChoiceList`](./choice-list.md) rather than a bare `input type="radio"`, so
the control is the admin's own. When all the options are known up front, a single
`ChoiceList` is the better component; `RadioButton` is for a set assembled across a
page.

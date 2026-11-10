# ConditionsRepeater

Repeated condition rows, as in a smart collection's rules. Extracted from Rankify's collection editor with the same look.

Each row is a rounded card (`borderRadius="large-200"`, base border) with:

- its controls on top, usually `ConditionsRepeater.Pill`s, wrapping when they run out of room;
- an optional value area under a divider, edge to edge (a text field, a tag input);
- a trash button that shows while the row is hovered or holds keyboard focus, and removes the row at once: no confirmation and no exit animation.

Under the rows: an add button (optionally opening a menu), an end slot, and a note when a `maxItems` limit is reached.

```tsx
import { Box, ConditionsRepeater, TextField } from "@xco-agency/corex-ui";

<ConditionsRepeater
  items={rules}
  renderControls={(rule) => (
    <>
      <ConditionsRepeater.Pill
        label={rule.fieldLabel}
        open={openMenu === `field-${rule.id}`}
        onOpenChange={(open) => setOpenMenu(open ? `field-${rule.id}` : null)}
        menu={
          <ConditionsRepeater.Options
            options={fields}
            selected={rule.field}
            onSelect={(field) => changeField(rule.id, field)}
          />
        }
      />
      <ConditionsRepeater.Pill label={rule.operatorLabel} /* … */ />
    </>
  )}
  renderValue={(rule) =>
    rule.operatorIsValue ? null : (
      <Box padding="small-200">
        <TextField
          label="Value"
          labelAccessibilityVisibility="exclusive"
          value={rule.value}
          onChange={(value) => setValue(rule.id, value)}
        />
      </Box>
    )
  }
  onRemove={(rule) => remove(rule.id)}
  addMenu={<ConditionsRepeater.Options options={fields} onSelect={addRule} />}
  addMenuOpen={addOpen}
  onAddMenuOpenChange={setAddOpen}
  maxItems={plan.ruleLimit}
  limitNote={
    <Text variant="bodySm" color="subdued">
      Your plan allows 1 condition.
    </Text>
  }
  emptyState="Add a condition to save this collection."
/>;
```

## ConditionsRepeater

| Prop                       | Behavior                                                                                                                                   |
| -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| `items`                    | The rows, in order.                                                                                                                        |
| `getItemId`                | A stable id per row. Defaults to `item.id`, then the index. Rows present on the first render show at once; later ones grow in (220ms).     |
| `renderControls`           | The row's top line.                                                                                                                        |
| `renderValue`              | The area under the divider. Return `null` for a row that needs none (the operator is the whole choice).                                    |
| `onRemove`                 | Shows the trash button and removes the row on click. Without it there is no trash button.                                                  |
| `removeAccessibilityLabel` | A string or `(item, index) => string`. Default `"Remove condition"`.                                                                       |
| `addLabel`, `onAdd`        | The add button's label (default `"Add condition"`) and handler.                                                                            |
| `addMenu`                  | A menu under the add button; the button toggles it, Escape and a click outside close it. `addMenuOpen` / `onAddMenuOpenChange` control it. |
| `hideAdd`                  | Hides the add button.                                                                                                                      |
| `maxItems`, `limitNote`    | At `maxItems` the add button is disabled and `limitNote` shows under the footer (a plan limit and its upgrade action).                     |
| `footerEnd`                | End of the footer row, opposite the add button.                                                                                            |
| `emptyState`               | Shown instead of the rows when there are none. A string renders as critical text.                                                          |
| `disabled`                 | Disables adding and removing.                                                                                                              |
| `animateNewItems`          | Grow new rows in. Default `true`.                                                                                                          |
| `accessibilityLabel`       | Names the list. Default `"Conditions"`.                                                                                                    |

## ConditionsRepeater.Pill

The light gray capsule the rows use for their choices: `s-clickable` with `background="subdued"`, `borderRadius="large-200"`, `small-300` / `small-100` padding (32px tall), small body text and a small `select` icon.

| Prop                   | Behavior                                                              |
| ---------------------- | --------------------------------------------------------------------- |
| `label`                | The current choice, or a prompt.                                      |
| `open`, `onOpenChange` | The menu's state; sets `aria-expanded`.                               |
| `menu`                 | A menu anchored under the pill.                                       |
| `onClick`              | Fires on the pill, for a pill without a menu.                         |
| `disabled`             | Ignores clicks (a locked comparator). Wrap in a `Tooltip` to say why. |
| `accessibilityLabel`   | Defaults to `label` when that is a string.                            |

## ConditionsRepeater.Options

The menu rows: a check and a subdued background on the selected option, an optional second line (`detail`). `selected` takes one value or a list; `onSelect` gets the picked value.

## Keyboard and assistive technology

- The rows are a `list` of `listitem`s, named by `accessibilityLabel`.
- Tabbing into a row shows its trash button; a mouse click on a pill does not (focus left behind after a menu closes is not a hover).
- Pills and the add button report `aria-expanded`; their menus close on Escape.
- `Options` is a `listbox` of `option`s with `aria-selected`.

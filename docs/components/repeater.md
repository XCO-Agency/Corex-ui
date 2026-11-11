# Repeater

Repeated condition rows, as in a smart collection's rules. Extracted from Rankify's collection editor with the same look.

Each row is a rounded card (`borderRadius="large-200"`, base border) with:

- its controls on top, usually `Repeater.Pill`s, wrapping when they run out of room;
- an optional value area under a divider, edge to edge (a text field, a tag input);
- a trash button that fades in while the row is hovered or holds keyboard focus (its space is kept, so nothing shifts), and removes the row at once: no confirmation and no exit animation.

Under the rows: an add button (optionally opening a menu), an end slot, and a note when a `maxItems` limit is reached.

```tsx
import { Box, Repeater, TextField } from "@xco-agency/corex-ui";

<Repeater
  items={rules}
  renderControls={(rule) => (
    <>
      <Repeater.Pill
        label={rule.fieldLabel}
        open={openMenu === `field-${rule.id}`}
        onOpenChange={(open) => setOpenMenu(open ? `field-${rule.id}` : null)}
        menu={
          <Repeater.Options
            options={fields}
            selected={rule.field}
            onSelect={(field) => changeField(rule.id, field)}
          />
        }
      />
      <Repeater.Pill label={rule.operatorLabel} /* … */ />
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
  addMenu={<Repeater.Options options={fields} onSelect={addRule} />}
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

## Repeater

| Prop                       | Behavior                                                                                                                                                                                          |
| -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `items`                    | The rows, in order.                                                                                                                                                                               |
| `getItemId`                | A stable id per row. Defaults to `item.id`, then the index. Rows present on the first render show at once; later ones grow in (220ms).                                                            |
| `renderControls`           | The row's top line.                                                                                                                                                                               |
| `renderValue`              | The area under the divider. Return `null` for a row that needs none (the operator is the whole choice).                                                                                           |
| `onRemove`                 | Shows the trash button and removes the row on click. Without it there is no trash button.                                                                                                         |
| `removeAccessibilityLabel` | A string or `(item, index) => string`. Default `"Remove condition"`.                                                                                                                              |
| `removeTooltip`            | Tooltip on the trash button: a node or `(item, index) => node`. Defaults to the remove label; `false` for none. It sits inside the button's fade, so it hides with it and leaves the hover alone. |
| `addLabel`, `onAdd`        | The add button's label (default `"Add condition"`) and handler.                                                                                                                                   |
| `addMenu`                  | A menu under the add button; the button toggles it, Escape and a click outside close it. `addMenuOpen` / `onAddMenuOpenChange` control it.                                                        |
| `hideAdd`                  | Hides the add button.                                                                                                                                                                             |
| `maxItems`, `limitNote`    | At `maxItems` the add button is disabled and `limitNote` shows under the footer (a plan limit and its upgrade action).                                                                            |
| `footerEnd`                | End of the footer row, opposite the add button.                                                                                                                                                   |
| `emptyState`               | Shown instead of the rows when there are none. A string renders as critical text.                                                                                                                 |
| `disabled`                 | Disables adding and removing.                                                                                                                                                                     |
| `animateNewItems`          | Grow new rows in. Default `true`.                                                                                                                                                                 |
| `accessibilityLabel`       | Names the list. Default `"Conditions"`.                                                                                                                                                           |

## Repeater.Pill

The light gray capsule the rows use for their choices: `s-clickable` with `background="subdued"`, `borderRadius="large-200"`, `small-300` / `small-100` padding (32px tall), small body text and a small `select` icon.

| Prop                   | Behavior                                                              |
| ---------------------- | --------------------------------------------------------------------- |
| `label`                | The current choice, or a prompt.                                      |
| `open`, `onOpenChange` | The menu's state; sets `aria-expanded`.                               |
| `menu`                 | A menu anchored under the pill.                                       |
| `onClick`              | Fires on the pill, for a pill without a menu.                         |
| `disabled`             | Ignores clicks (a locked comparator). Wrap in a `Tooltip` to say why. |
| `accessibilityLabel`   | Defaults to `label` when that is a string.                            |

## Repeater.Options

The menu rows: a check and a subdued background on the selected option, an optional second line (`detail`). `selected` takes one value or a list; `onSelect` gets the picked value.

With more than `searchThreshold` options (10) a search field sits on top. It takes focus as the menu opens and filters on label and detail, ignoring case. It stays put while the options scroll under it, and the list keeps its height while filtering. Enter picks the first match, the arrow keys (and Home / End) move between the search and the options, and Escape closes the menu. The query starts empty each time the menu opens.

```tsx
<Repeater
  addMenu={
    <Repeater.Options
      options={conditionTypes} // 13 types: the search shows
      searchPlaceholder="Search conditions"
      noResultsText="No condition matches your search."
      onSelect={addRule}
    />
  }
  /* … */
/>
```

| Prop                | Behavior                                                                          |
| ------------------- | --------------------------------------------------------------------------------- |
| `searchable`        | `true` or `false` forces the search on or off. Default: shown past the threshold. |
| `searchThreshold`   | Default `10`: the search shows from 11 options.                                   |
| `searchPlaceholder` | Placeholder and accessible name. Default `"Search"`.                              |
| `noResultsText`     | Shown when nothing matches. Default `"No results"`.                               |
| `listMaxBlockSize`  | Height the options scroll within. Default `"232px"`.                              |

`filterRepeaterOptions(options, query)` and `optionsSearchShown(count, searchable, threshold)` are exported.

## Multi-value rows: tags with All / Any

A row that takes several values (tags, vendors, product types) pairs a `Repeater.MatchMode` pill in its controls with a `Repeater.TagsInput` as its value. Both are controlled: you own `values` and `mode`.

```tsx
renderControls={(rule) => (
  <>
    <Repeater.Pill label="Tag" /* field menu */ />
    <Repeater.MatchMode
      value={rule.mode}
      onChange={(mode) => update(rule.id, { mode })}
      help={(mode) =>
        mode === "all"
          ? "Only products containing all specified tags will be counted."
          : "Products with any of the specified tags will be included."
      }
    />
  </>
)}
renderValue={(rule) => (
  <Repeater.TagsInput
    values={rule.values}
    mode={rule.mode}
    onChange={(values) => update(rule.id, { values })}
    loadSuggestions={() => fetchStoreTags()}
    suggestionsKey={rule.field}
  />
)}
```

### Repeater.TagsInput

The chosen values are base `Tag`s, removable, with the mode as a neutral `Badge` between them (`AND` for all, `OR` for any), and a borderless input on the same line, wrapping in a 16px-padded strip. A press on the strip focuses the input; focusing opens the suggestions, which stay open so several can be picked.

| Prop                       | Behavior                                                                                                   |
| -------------------------- | ---------------------------------------------------------------------------------------------------------- |
| `values`, `onChange`       | The values, and the next list after an add or a remove.                                                    |
| `mode`                     | `"all"` or `"any"` (default). Only sets the badge between chips; the pill changes it.                      |
| `joinLabels`               | The badge text. Default `{ all: "AND", any: "OR" }`.                                                       |
| `placeholder`              | Shown while there are no values, and the input's name. Default `"Add a value"`.                            |
| `suggestions`              | Values to offer. Ones already chosen are left out; typing filters the rest.                                |
| `loadSuggestions`          | Loads more the first time the list opens, with a spinner meanwhile. A failure leaves typing working.       |
| `suggestionsKey`           | Change it to load again (the row switched from tags to vendors).                                           |
| `commitKeys`               | Keys that turn the typed text into a chip. Default `["Enter", ","]`. With a comma, a pasted list is split. |
| `removeAccessibilityLabel` | `(value) => string`. Default `` `Remove ${value}` ``.                                                      |
| `disabled`                 | Fixes the values: no input, no remove controls.                                                            |

Values are trimmed; blanks and duplicates are ignored. Backspace in an empty input removes the last chip. Arrow keys move through the suggestions, Enter picks the highlighted one (or adds the typed text), Escape closes the list.

### Repeater.MatchMode

The `All` / `Any` pill. Its menu is 180px wide: the `help` sentence for the current mode in subdued text, then the two options.

| Prop                   | Behavior                                                                                                                                  |
| ---------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| `value`, `onChange`    | `"all"` or `"any"`.                                                                                                                       |
| `labels`               | Default `{ all: "All", any: "Any" }`.                                                                                                     |
| `help`                 | A string or `(mode) => string`: the menu's first line and the pill's accessible label.                                                    |
| `locked`               | Disables the pill and shows `help` in a tooltip. For a mode the data forces (a product has one type, so several types only match as Any). |
| `open`, `onOpenChange` | Controls the menu; uncontrolled otherwise.                                                                                                |

`tagsKeyAction(key, draft, hasValues, commitKeys?)` and `valuesToAdd(draft, values, splitOnComma)` are exported for custom inputs that want the same rules.

## Keyboard and assistive technology

- The rows are a `list` of `listitem`s, named by `accessibilityLabel`.
- The trash button has a tooltip (the remove label by default).
- Tabbing into a row shows its trash button; a mouse click on a pill does not (focus left behind after a menu closes is not a hover).
- Pills and the add button report `aria-expanded`; their menus close on Escape.
- `Options` is a `listbox` of `option`s with `aria-selected`; its search field is named by `searchPlaceholder`.
- `TagsInput`'s input is a `combobox` (`aria-autocomplete="list"`, `aria-expanded`, `aria-controls` on its listbox); each chip's remove control is named by `removeAccessibilityLabel`.

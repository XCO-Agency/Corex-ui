# Selectable

Wraps a card or any element and draws a toned outline around it while it is selected.
Built on plain elements (not a Polaris web component), so the outline works on any content.

```tsx
import { Selectable, Card, Text } from "@xco-agency/corex-ui";

<Selectable tone="success" indicator onSelectedChange={(selected) => {}}>
  <Card>
    <Text>Online Store</Text>
  </Card>
</Selectable>;
```

## Props

| Prop                 | Type                                                          | Default  | Description                                              |
| -------------------- | ------------------------------------------------------------- | -------- | -------------------------------------------------------- |
| `selected`           | `boolean`                                                     | —        | Controlled state.                                        |
| `defaultSelected`    | `boolean`                                                     | `false`  | Initial state when uncontrolled.                         |
| `onSelectedChange`   | `(selected: boolean) => void`                                 | —        | Click, Space or Enter toggles it.                        |
| `value`              | `string`                                                      | —        | Identifies the item inside a `Selectable.Group`.         |
| `tone`               | `"info" \| "success" \| "warning" \| "critical" \| "neutral"` | `"info"` | Outline colour (`auto` = info, `caution` = warning).     |
| `interactive`        | `boolean`                                                     | `true`   | `false` makes it a highlight only, driven by `selected`. |
| `disabled`           | `boolean`                                                     | —        | Dims the item and blocks interaction.                    |
| `indicator`          | `boolean`                                                     | `false`  | Check badge in the corner while selected.                |
| `outlineWidth`       | `1 \| 2 \| 3`                                                 | `2`      | Outline thickness in px.                                 |
| `outlineOffset`      | `number`                                                      | `0`      | Gap between content and outline in px.                   |
| `borderRadius`       | `"none" \| "small" \| "base" \| "large" \| "large-100"`       | `"base"` | Match the wrapped element's corners.                     |
| `inlineSize`         | `"fill" \| "auto"`                                            | `"fill"` | Width of the wrapper.                                    |
| `accessibilityLabel` | `string`                                                      | —        | Accessible name.                                         |

## `Selectable.Group`

Owns the selection of several items: radio-like by default, or `multiple`.

```tsx
<Selectable.Group value={plan} onChange={setPlan} accessibilityLabel="Plan">
  <Selectable value="starter">…</Selectable>
  <Selectable value="growth">…</Selectable>
</Selectable.Group>
```

`value` / `defaultValue` are arrays of selected values, `onChange` receives the full array,
and `tone` / `disabled` apply to every item that doesn't set its own.

## Accessibility

Interactive items expose `role="checkbox"` (or `"radio"` in a single-select group) with
`aria-checked`, are focusable, and show a focus ring. Highlight-only items (`interactive={false}`)
have no role and set `aria-current` while selected.

## Theming

Override the outline colours with `--cx-selectable-info`, `-success`, `-warning`, `-critical`
and `-neutral` on any ancestor.

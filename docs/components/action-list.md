# ActionList

v12's list of actions, for use inside a [`Popover`](./popover.md). It is a menu in
all but name.

```tsx
import { ActionList, Button, Popover } from "@xco-agency/corex-ui";

<Popover>
  <Popover.Trigger>
    <Button>More actions</Button>
  </Popover.Trigger>
  <Popover.Content>
    <ActionList
      items={[
        { content: "Edit", icon: "edit", onAction: edit },
        { content: "Duplicate", onAction: duplicate, helpText: "Keeps the original" },
        { content: "Delete", icon: "delete", destructive: true, onAction: remove },
      ]}
    />
  </Popover.Content>
</Popover>;
```

| Item field          | Behavior                                                   |
| ------------------- | ---------------------------------------------------------- |
| `content`           | The label.                                                 |
| `onAction` / `url`  | An item with a `url` is a real link; the rest are buttons. |
| `icon`              | An icon name, or a Polaris SVG component.                  |
| `destructive`       | Critical tone on both the label and the icon.              |
| `helpText`          | A subdued second line under the label.                     |
| `active`            | Marks the current choice, e.g. the selected sort.          |
| `prefix` / `suffix` | Nodes at either end of the row.                            |
| `disabled`          | Passed to the underlying `Clickable`.                      |

`sections` keeps v12's grouping, each with an optional `title`. `actionRole` is
accepted and ignored: v12 used it to switch the items between `button` and
`menuitem`, and `s-clickable` already renders the right control.

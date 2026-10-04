# ActionList

Action menu list of actions and choices with an integrated [`Popover`](./popover.md).

`ActionList` encapsulates its own `Popover`, `Popover.Trigger`, and `Popover.Content` overlay. Pass a trigger element (such as a [`Button`](./button.md)) as `children`, or omit `children` to automatically render a default 3-dots menu button (`<Button variant="tertiary" icon="menu-horizontal" />`). When an action item is clicked, it automatically closes the popover.

## Usage

### With Custom Trigger

```tsx
import { ActionList, Button } from "@xco-agency/corex-ui";

<ActionList
  items={[
    { content: "Edit", icon: "edit", onAction: () => edit() },
    { content: "Duplicate", onAction: () => duplicate(), helpText: "Keeps the original" },
    { content: "Delete", icon: "delete", destructive: true, onAction: () => remove() },
  ]}
>
  <Button>More actions</Button>
</ActionList>;
```

### With Default Trigger

When no children or activator is passed, `ActionList` automatically renders a tertiary 3-dots icon button as the trigger:

```tsx
import { ActionList } from "@xco-agency/corex-ui";

<ActionList
  items={[
    { content: "Edit", icon: "edit", onAction: () => edit() },
    { content: "Delete", icon: "delete", destructive: true, onAction: () => remove() },
  ]}
/>;
```

### With Sections

Group related actions into sections with an optional section `title`:

```tsx
import { ActionList, Button } from "@xco-agency/corex-ui";

<ActionList
  sections={[
    {
      title: "File",
      items: [
        { content: "Share", icon: "share", onAction: () => share() },
        { content: "Download", icon: "download", onAction: () => download() },
      ],
    },
    {
      title: "Danger zone",
      items: [
        { content: "Delete file", icon: "delete", destructive: true, onAction: () => remove() },
      ],
    },
  ]}
>
  <Button variant="tertiary">Actions</Button>
</ActionList>;
```

## Props

| Prop | Type | Description |
| --- | --- | --- |
| `children` | `ReactNode` | The trigger element for the Popover. Defaults to `<Button variant="tertiary" icon="menu-horizontal" />`. |
| `items` | `ActionListItemType[]` | List of action items to render. |
| `sections` | `ActionListSectionType[]` | List of action sections, each with an optional `title` and array of `items`. |
| `id` | `string` | The ID of the list. |
| `activator` | `ReactNode` | *(Deprecated)* Prefer using `children`. |

## Item Fields (`ActionListItemType`)

| Field | Type | Description |
| --- | --- | --- |
| `content` | `ReactNode` | The label text or React node. |
| `onAction` | `() => void` | Callback fired when the item is clicked. Automatically dismisses the popover. |
| `href` | `string` | Renders the item as a real link (`Clickable` with `href`). |
| `icon` | `IconType \| IconSourceType` | Icon name string (e.g., `"edit"`, `"delete"`) or Polaris SVG icon component. |
| `destructive` | `boolean` | Critical tone applied to both the label and the icon. |
| `helpText` | `ReactNode` | A subdued second line of text under the label. |
| `active` | `boolean` | Marks the item with a subdued background (e.g., current sort selection). |
| `disabled` | `boolean` | Disables the item. |
| `prefix` | `ReactNode` | Element placed before the icon/content. |
| `suffix` | `ReactNode` | Element placed at the end of the row. |
| `url` | `string` | *(Deprecated)* Prefer using `href`. |

`sections` keeps v12's grouping, each with an optional `title`. `actionRole` is
accepted and ignored: v12 used it to switch the items between `button` and
`menuitem`, and `s-clickable` already renders the right control.


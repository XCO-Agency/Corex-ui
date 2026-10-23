# Command

Self-contained custom control (pattern 4) matching the [shadcn Command](https://ui.shadcn.com/docs/components/base/command) API, with no third-party runtime: filtering, groups, empty state and keyboard selection are built in. The dialog palette is a built-in, dependency-free dialog (focus containment, scroll lock, Escape / outside press).

```tsx
import { Command, Icon } from "@xco-agency/corex-ui";

<Command>
  <Command.Input placeholder="Type a command or search..." />
  <Command.List>
    <Command.Empty>No results found.</Command.Empty>
    <Command.Group heading="Suggestions">
      <Command.Item value="calendar" onSelect={() => {}}>
        <Icon source="calendar" size="small" />
        Calendar
      </Command.Item>
    </Command.Group>
    <Command.Separator />
    <Command.Group heading="Settings">
      <Command.Item value="profile" onSelect={() => {}}>
        Profile
        <Command.Shortcut>⌘P</Command.Shortcut>
      </Command.Item>
    </Command.Group>
  </Command.List>
</Command>;
```

## Composition

```
Command
├── Command.Input
└── Command.List
    ├── Command.Empty
    ├── Command.Group
    │   └── Command.Item
    │       └── Command.Shortcut
    └── Command.Separator

Command.Dialog
└── Command
    └── …
```

## Dialog palette

```tsx
const [open, setOpen] = useState(false);

<Command.Dialog open={open} onOpenChange={setOpen} title="Command Palette">
  <Command>
    <Command.Input placeholder="Search for a command to run..." />
    <Command.List>…</Command.List>
  </Command>
</Command.Dialog>
```

## Sidebar groups

Set `sidebar` for a two-column layout: group nav on the left, items of the selected/hovered group on the right. Click pins a group; hover previews another. Typing in the search field shows matches across all groups.

```tsx
<Command sidebar defaultSidebarGroup="suggestions" sidebarWidth="12rem">
  <Command.Input placeholder="Filter commands..." />
  <Command.List>
    <Command.Group heading="Suggestions" value="suggestions" icon={<Icon source="search" />}>
      <Command.Item value="calendar">Calendar</Command.Item>
    </Command.Group>
    <Command.Group heading="Settings" value="settings">
      <Command.Item value="profile">Profile</Command.Item>
    </Command.Group>
  </Command.List>
</Command>
```

Optional controlled API: `sidebarGroup` + `onSidebarGroupChange`. Optional explicit nav: `sidebarGroups={[{ value, label, icon? }]}`.

## Runtime

No extra dependencies (no `cmdk`, no `@base-ui/*`). Items keep their source order while filtering hides non-matches; the default filter matches substrings and in-order letters (`"stg"` → Settings) plus `keywords`.

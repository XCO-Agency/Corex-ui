# Popover

Compound wrapper over `s-popover`: a trigger and its content, bound by id.

```tsx
import { Box, Button, Popover, Text } from "@xco-agency/corex-ui";

<Popover>
  <Popover.Trigger>
    <Button>Filter status</Button>
  </Popover.Trigger>
  <Popover.Content>
    <Box padding="base">
      <Text>Popover content goes here</Text>
    </Box>
  </Popover.Content>
</Popover>;
```

> [!TIP]
> For action dropdown menus, use [`ActionList`](./action-list.md). `ActionList` encapsulates its own `Popover`, trigger, and auto-dismiss behavior out of the box.


`Popover.Trigger` clones its child with the invoker attributes (`commandfor`,
`command`), so the element opens and closes the overlay itself — no open state to
hold. `Popover.Content` renders `s-popover`; `fitTrigger` matches its width to the
measured trigger.

## Controlled mode

Pass `active` when the page has to keep the popover open itself — during an in-flight
save, say, where a close would lose what the user typed.

```tsx
<Popover active={isEditing} onClose={() => setEditing(false)}>
  …
</Popover>
```

`s-popover` has no `open` attribute: it is shown and hidden imperatively, which is what
its own trigger does, so `active` drives `showOverlay()` / `hideOverlay()`. Leave
`active` undefined and the native invoker stays in sole charge — that is still the
right default for a plain menu.

`onClose` fires whenever the overlay hides, however it was closed. `usePopover()` gives
a child the same `close()`, for an action that should dismiss the popover.

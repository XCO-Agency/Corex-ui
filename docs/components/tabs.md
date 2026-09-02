# Tabs

Fully composed pattern — the only component in this library that renders no `s-*` element of
its own. There is no native Polaris web component for tabbed navigation yet, so `Tabs` is built
from [`ButtonGroup`](./button-group.md) + [`Button`](./button.md) for the tab strip and
[`Box`](./box.md) for the panel. See
[architecture.md](../architecture.md#3-composed--imperative-bridge).

```tsx
import { Tabs, Text } from "@xco/corex-ui";

<Tabs
  tabs={[
    { id: "all", content: "All" },
    { id: "drafts", content: "Drafts" },
  ]}
  selected={selectedIndex}
  onSelect={setSelectedIndex}
>
  <Text>Panel content for the selected tab.</Text>
</Tabs>;
```

## Prop mapping

| Legacy prop | Behavior |
| --- | --- |
| `tabs` | Each `{ id, content, accessibilityLabel, disabled }` renders one tab `Button`. |
| `selected` | Optional — omit for uncontrolled usage (defaults to the first tab and manages its own state). |
| `onSelect` | Called with the clicked tab's index. |
| `children` | Rendered as the panel content for whichever tab is currently selected — `Tabs` does not automatically show/hide per-tab content; render what you want for the current `selected` index yourself, exactly like legacy `Tabs`. |

Because very custom `Tabs` styling from Polaris React (via `overrideStyles` or CSS overrides)
targeted DOM structure that no longer exists, heavily customized legacy `Tabs` usage may need
visual double-checking after migration.

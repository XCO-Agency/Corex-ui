# Tabs

Fully composed pattern — the only component in this library that renders no `s-*` element of
its own. There is no native Polaris web component for tabbed navigation yet, so `Tabs` is built
from [`ButtonGroup`](./button-group.md) + [`Button`](./button.md) for the tab strip and
[`Box`](./box.md) for the panel. See
[architecture.md](../architecture.md#3-composed--imperative-bridge).

```tsx
import { useState } from "react";
import { Tabs, Text } from "@xco-agency/corex-ui";

// ID-based selection (recommended):
const [selectedId, setSelectedId] = useState("all");

<Tabs
  tabs={[
    { id: "all", label: "All" },
    { id: "drafts", label: "Drafts" },
  ]}
  value={selectedId}
  onChange={setSelectedId}
>
  <Text>Panel content for tab {selectedId}.</Text>
</Tabs>;

// Or index-based selection (legacy Polaris):
const [selectedIndex, setSelectedIndex] = useState(0);

<Tabs
  tabs={[
    { id: "all", label: "All" },
    { id: "drafts", label: "Drafts" },
  ]}
  selected={selectedIndex}
  onSelect={setSelectedIndex}
>
  <Text>Panel content for index {selectedIndex}.</Text>
</Tabs>;
```

## Prop mapping

| Prop | Behavior |
| ----------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `tabs`      | Array of `{ id, label, icon, badge, badgeTone, tooltip, accessibilityLabel, disabled }`. |
| `value`     | ID of the currently selected tab (`string \| number`). Takes precedence over `selected`. |
| `onChange`  | Callback fired when a tab is clicked, passed the selected tab's `id`. |
| `selected`  | _(Deprecated: use `value`)_ Index of the currently selected tab (Polaris legacy index-based selection). |
| `onSelect`  | _(Deprecated: use `onChange`)_ Callback fired when a tab is clicked, passed the selected tab's `index` (`number`). |
| `children`  | Rendered as the panel content for whichever tab is currently selected. |
| `rightSide` | Additional actions/content placed on the right side of the tab bar. |

Because very custom `Tabs` styling from Polaris React (via `overrideStyles` or CSS overrides)
targeted DOM structure that no longer exists, heavily customized legacy `Tabs` usage may need
visual double-checking after migration.

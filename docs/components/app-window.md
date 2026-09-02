# AppWindow

App Bridge component — see [app-bridge.md](../app-bridge.md#appwindow) for full examples. Wraps
`s-app-window`.

```tsx
import { AppWindow, Button } from "@xco/corex-ui";

<AppWindow id="app-window" src="/app-window-content.html" />
<Button command="--show" commandFor="app-window">Open App Window</Button>
<Button command="--hide" commandFor="app-window">Close App Window</Button>;
```

## Prop mapping

| Legacy prop | Behavior |
| --- | --- |
| `src` | Required — the URL of the page to load inside the window. |
| `id` | Referenced by trigger `Button`s' `commandFor`. |

## Notable difference from Modal

There's no controlled `open`/`onClose` prop, unlike `Modal` — no confirmed close event exists
for this element. Trigger it via the declarative `command`/`commandFor` pattern above, or
imperatively via a forwarded ref's `.show()`/`.hide()` methods.

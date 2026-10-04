# AppWindow

App Bridge component — see [app-bridge.md](../app-bridge.md#appwindow) for full examples. Wraps
`s-app-window`.

import { AppWindow, Button } from "@xco-agency/corex-ui";

<AppWindow id="app-window" src="/app-window-content.html" />
<Button command="--show" commandFor="app-window">Open App Window</Button>
<Button command="--hide" commandFor="app-window">Close App Window</Button>;

## Prop mapping

| Legacy prop | Behavior                                                                 |
| ----------- | ------------------------------------------------------------------------- |
| `src`       | Required — the URL of the page to load inside the window.                 |
| `id`        | Referenced by trigger `Button`s' `commandFor`.                            |
| `onClose`   | Callback fired when the window is closed or hidden.                      |
| `onHide`    | Callback fired when the window is closed or hidden (alias of `onClose`). |
| `saveBar`   | `boolean \| { onSave?, onDiscard?, saveText?, discardText?, discardConfirmation? }`. When set, automatically mounts a host `SaveBar` for this window and bridges Save/Discard actions to the iframe's content — see below. |

`onClose`/`onHide` are both wired to the underlying element's `hide`, `afterhide`, and `close`
events, and both fire together whenever any of those events dispatch — they're two names for the
same callback, kept for naming-convention flexibility (`onClose` to mirror `Modal`, `onHide` to
mirror the element's own `hide()` method).

<AppWindow
  id="app-window"
  src="/app-window-content.html"
  onClose={() => console.log("closed")}
/>

## Built-in SaveBar bridge

Pass `saveBar` to have `AppWindow` automatically render a host-page `SaveBar` wired to the
iframe's content, instead of wiring one up manually (see
[app-bridge.md](../app-bridge.md#savebarfor-an-appwindows-content) for the fully manual
version). Use the `useAppWindowSaveBar` hook inside the iframe's content to report its dirty
state and handle Save/Discard:

// Parent page
<AppWindow
  id="app-window"
  src="/app-window-content.html"
  saveBar={{
    onSave: () => console.log("host: save clicked"),
    onDiscard: () => console.log("host: discard clicked"),
    saveText: "Save changes",
    discardText: "Discard",
  }}
/>

// Content loaded by AppWindow's iframe
import { useAppWindowSaveBar } from "@xco-agency/corex-ui";

function AppWindowContentPage() {
  const saveBar = useAppWindowSaveBar({
    windowId: "app-window",
    open: isDirty,
    onSave: async () => { /* persist changes */ },
    onDiscard: () => { /* reset local state */ },
  });

  return /* ... */;
}

`useAppWindowSaveBar` syncs `open`/`loading`/`disabled`/`saveText`/`discardText` from the
iframe to the host `SaveBar` (via `BroadcastChannel` and `postMessage`, since the host and
iframe are separate documents), shows/hides the host save bar through
`window.shopify.saveBar`, and forwards host Save/Discard clicks back into the iframe's
`onSave`/`onDiscard`.

## Notable difference from Modal

Unlike `Modal`, there is no controlled `open` prop — `AppWindow` is always shown via the
declarative `command`/`commandFor` pattern above or imperatively via a forwarded ref's
`.show()`/`.hide()` methods. `onClose`/`onHide` let you *react* to the window closing, but you
cannot control its open state the way `Modal`'s `open` prop does.

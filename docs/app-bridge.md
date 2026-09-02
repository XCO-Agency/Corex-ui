# App Bridge: AppWindow, AppNav, Menu, SaveBar, Toast

This is a distinct subsystem from the rest of `@xco/corex-ui`. Everything else in this library
wraps **Polaris design components** (`s-button`, `s-card`, ...); this page covers Shopify **App
Bridge**'s embedded-app window, navigation, and notification layer — `s-app-window`, `s-app-nav`,
`ui-save-bar` (a different custom element namespace, not `s-*`), and the imperative
`window.shopify.toast`/`window.shopify.saveBar` global API. See
[component-coverage.md](./component-coverage.md#app-bridge-separate-subsystem--see-app-bridgemd)
for what's wrapped.

All of this only works inside a real embedded Shopify admin session — `window.shopify` and the
`s-app-window`/`ui-save-bar` elements' real behavior don't exist in a plain browser tab (this
repo's own `apps/playground` included), so its examples there show the code and static shape
only.

## AppWindow

`AppWindow` wraps `s-app-window`. There's no confirmed close event for it (unlike `Modal`), so
it deliberately has no controlled `open`/`onClose` prop — trigger it either via the declarative
`command`/`commandFor` pattern (no JS needed) or by calling `.show()`/`.hide()` on a forwarded
ref, exactly like the raw HTML:

```tsx
import { AppWindow, Button } from "@xco/corex-ui";

// Declarative — no event handlers needed:
<AppWindow id="app-window" src="/app-window-content.html" />
<Button command="--show" commandFor="app-window">Open App Window</Button>
<Button command="--hide" commandFor="app-window">Close App Window</Button>
<Button command="--toggle" commandFor="app-window">Toggle App Window</Button>
```

```tsx
// Imperative — via a ref:
const windowRef = useRef<HTMLElementTagNameMap["s-app-window"]>(null);

<AppWindow ref={windowRef} src="/app-window-content.html" />
<Button onClick={() => windowRef.current?.show()}>Show App Window</Button>
<Button onClick={() => windowRef.current?.hide()}>Hide App Window</Button>
```

The page `AppWindow` loads (`/app-window-content.html` above) is its own document — typically
rendering a `Page` with actions in its title bar via slots:

```tsx
// app-window-content page
<Page title="Product editor">
  <Button slot="primary-action" onClick={() => toast.show("Save")}>Save</Button>
  <Button slot="secondary-actions" onClick={() => toast.show("Preview")}>Preview</Button>
</Page>
```

### Title bar accessory (status badge)

```tsx
<Page title="Edit Product">
  <Badge slot="accessory" tone="warning">Draft</Badge>
  <Button slot="primary-action">Save</Button>
</Page>
```

### Title bar icons and a Menu

```tsx
<Page title="Product Details">
  <Button slot="primary-action" icon="save">Save</Button>
  <Button slot="secondary-actions" commandFor="actions-menu" icon="menu">More actions</Button>
  <Menu id="actions-menu">
    <Button icon="duplicate">Duplicate</Button>
    <Button icon="archive">Archive</Button>
    <Button icon="delete" destructive>Delete</Button>
  </Menu>
</Page>
```

## AppNav

Thin wrapper over `s-app-nav`, holding `Link` children:

```tsx
import { AppNav, Link } from "@xco/corex-ui";

<AppNav>
  <Link url="/app" removeUnderline>Home</Link>
  <Link url="/app/templates">Templates</Link>
  <Link url="/app/settings">Settings</Link>
</AppNav>;
```

## Menu

Thin wrapper over `s-menu`, holding `Button` children — pair it with a trigger `Button` using
`commandFor` (shown above). See [components/menu.md](./components/menu.md).

## Toast

`useToast()` wraps `window.shopify.toast.show(...)`:

```tsx
import { useToast } from "@xco/corex-ui";

function SaveButton() {
  const toast = useToast();
  return <Button onClick={() => toast.show("Saved")}>Save</Button>;
}
```

## SaveBar

Two ways to use App Bridge's save bar, depending on where the form lives.

### Forms with a save bar (same page)

Add `data-save-bar` (and optionally `data-discard-confirmation`) directly to a native `<form>`
— these are plain HTML attributes App Bridge's own script watches for, so there's no
`@xco/corex-ui` wrapper for them:

```tsx
<form data-save-bar data-discard-confirmation>
  <TextField label="Store Name" name="storeName" required />
  <TextField label="Description" name="description" multiline />
  <Checkbox label="Enable notifications" name="notifications" />
</form>
```

### Save bar for an `AppWindow`'s content

For `AppWindow` content (a separate document loaded in an iframe), define a `SaveBar` on the
**parent** page with a unique `id`, and call `useSaveBar().show(id)`/`.hide(id)` from **inside**
the iframe's content when changes are detected:

```tsx
// Parent page
function ParentPage() {
  const saveBarId = "modal-save-bar";
  const saveBar = useSaveBar();

  const handleSave = async () => {
    await fetch("/api/save", { method: "POST" });
    saveBar.hide(saveBarId);
  };

  return (
    <Page title="Settings">
      <SaveBar id={saveBarId}>
        <button onClick={handleSave}>Save</button>
        <button onClick={() => saveBar.hide(saveBarId)}>Discard</button>
      </SaveBar>
      <AppWindow src="/settings" />
    </Page>
  );
}

// Content loaded by AppWindow's iframe (a separate route/page)
function SettingsPage() {
  const saveBar = useSaveBar();
  return (
    <Card title="Configuration">
      <TextField label="Store name" onChange={() => saveBar.show("modal-save-bar")} />
    </Card>
  );
}
```

Note `SaveBar`'s children are plain `<button>` elements in Shopify's own examples, not
Polaris `Button` — `SaveBar` doesn't constrain what you nest inside it.

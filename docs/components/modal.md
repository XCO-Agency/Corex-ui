# Modal

Composed / imperative-bridge pattern over `s-modal` and `ui-modal`. See
[architecture.md](../architecture.md#3-composed--imperative-bridge) for how the legacy
`open`/`onClose` API is bridged onto custom element methods.

```tsx
import { Modal, Text } from "@xco-agency/corex-ui";

<Modal
  open={open}
  onClose={() => setOpen(false)}
  title="Delete product"
  primaryAction={{ content: "Delete", destructive: true, onAction: handleDelete }}
  secondaryActions={[{ content: "Cancel", onAction: () => setOpen(false) }]}
>
  <Text>This can't be undone.</Text>
</Modal>;
```

## App Bridge: Max Modal + Contextual Save Bar (`variant="max"`)

When given `variant="max"` or `src`, `Modal` automatically bridges to App Bridge's `<ui-modal>` web component.

### Why this is fiddly in App Bridge
App Bridge ships `ui-modal`, `ui-title-bar`, and `ui-save-bar` as web components. They are only registered in a document that booted App Bridge (the embedded app shell).
- A `<Modal variant="max" src="...">` renders its content in a nested iframe. That iframe is a separate document and does not have App Bridge web components. Rendering `<SaveBar>` inside the iframe throws `saveBar.hide is not a function`.
- `ui-save-bar` must be a direct child of the host `<Modal>`.
- `onHide` fires after the modal closes and cannot be cancelled. Programmatic closes should await `shopify.saveBar.leaveConfirmation()` or `useModalSaveBar().leaveConfirmation()`.

---

### Pattern A — Inline React Children (Same Context)

Use when modal content is rendered inline:

```tsx
import { Modal, TitleBar, SaveBar } from "@xco-agency/corex-ui";

<Modal open={isEditorOpen} onHide={cleanupOnly} onClose={closeEditor} variant="max">
  <TitleBar title="Edit Workflow" />
  <SaveBar id="flow-editor-save-bar" open={isDirty} discardConfirmation>
    {/* FIRST button = primary/Save, SECOND button = Discard. Empty labels allow App Bridge to provide localized text. */}
    <button
      type="button"
      variant="primary"
      loading={isSaving ? "" : undefined}
      disabled={!isDirty || isSaving}
      onClick={handleSave}
    />
    <button type="button" onClick={closeEditor} />
  </SaveBar>
  <WorkflowDesigner onSave={handleSave} />
</Modal>
```

For programmatic close buttons:
```tsx
const handleCloseRequest = async () => {
  if (isDirty) {
    try {
      await shopify.saveBar.leaveConfirmation();
    } catch {
      return; // Merchant stayed
    }
  }
  closeEditor();
};
```

---

### Pattern B — Nested Iframe (`src` Cross-Document)

Use when modal content is loaded via `src="/app/preferences/settings"`. The iframe reports its state over a `BroadcastChannel` (e.g. `claimify-preferences`), and the host modal drives the host `<SaveBar>`.

#### Host Modal
```tsx
<Modal
  id="preferences-modal"
  open={isOpen}
  variant="max"
  src="/app/preferences/settings"
  saveBar={{
    channel: "claimify-preferences",
    onSave: () => {},
    onDiscard: () => {},
  }}
  onHide={cleanup}
/>
```

#### Inside Iframe (`/app/preferences/settings`)
```tsx
import { useModalSaveBar } from "@xco-agency/corex-ui";

function PreferencesPage() {
  const isDirty = formState !== initialFormState;

  useModalSaveBar({
    channel: "claimify-preferences",
    open: isDirty,
    saving: isSaving,
    disabled: !isValid,
    onSave: handleUnifiedSave,
    onDiscard: handleDiscard,
  });

  return (
    <Card>
      <TextField label="Sender email" ... />
    </Card>
  );
}
```

### Multi-Section Iframe State Discard
When discarding multi-section iframe state, reset parent-held state directly and bump a `resetKey` to remount ref-backed child sections:
```tsx
const [resetKey, setResetKey] = useState(0);
const handleDiscard = () => {
  setEmailDirty(false);
  setBrandingDirty(false);
  setResetKey((k) => k + 1); // forces <EmailSettings key={`emails-${resetKey}`} /> to re-init
};
```

## Prop mapping

| Prop               | Behavior                                                                                                                                                         |
| ------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `open`             | Watched in an effect; calls the element's `show()`/`hideOverlay()` accordingly. `Modal` still owns no internal open state, exactly like legacy `Modal`.          |
| `onClose`          | Called both when you set `open={false}` yourself and when the element dispatches its native `close` / `hide` event.                                              |
| `onHide`           | App Bridge dismiss callback, fired on native `hide` and `afterhide` events.                                                                                      |
| `variant`          | Modal size variant (`"small"`, `"base"`, `"large"`, `"max"`). Passing `"max"` switches element to App Bridge `<ui-modal>`.                                       |
| `src`              | Cross-document iframe URL for App Bridge `<ui-modal>`.                                                                                                           |
| `saveBar`          | Automatically mounts a host `<SaveBar>` and bridges bidirectional state/actions across iframe or inline content.                                                |
| `channel`          | BroadcastChannel channel name for cross-document handshake with iframe.                                                                                          |
| `title`            | Maps to `heading` on `s-modal` or renders `<TitleBar title={title}>` on `ui-modal`.                                                                               |
| `primaryAction`    | Rendered as a `Button` with `slot="primary-action"`.                                                                                                             |
| `secondaryActions` | Rendered as `Button`s with `slot="secondary-actions"`.                                                                                                           |


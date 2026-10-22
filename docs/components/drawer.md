# Drawer

Self-contained custom control (pattern 4) built on [`@base-ui/react/drawer`](https://base-ui.com/react/components/drawer), matching the [shadcn Base UI drawer](https://ui.shadcn.com/docs/components/base/drawer) visuals and gestures.

**Defaults**

| Viewport | Presentation | Handle | Edge offset | Swipe |
| --- | --- | --- | --- | --- |
| Desktop (`md+`) | Right side drawer | Never (not mounted) | `8` (all sides) | Full panel surface |
| Mobile (`mdDown`) | Bottom sheet | Only if `showSwipeHandle` | `8` (all sides) | Full panel surface |

```tsx
import { Drawer, Button, Text } from "@xco-agency/corex-ui";

<Drawer>
  <Drawer.Trigger>
    <Button>Open</Button>
  </Drawer.Trigger>
  <Drawer.Content>
    <Drawer.Header>
      <Drawer.Title>Order details</Drawer.Title>
      <Drawer.Description>Swipe anywhere on the panel to dismiss.</Drawer.Description>
    </Drawer.Header>
    <Drawer.Body>
      <Text>Content</Text>
    </Drawer.Body>
    <Drawer.Footer>
      <Drawer.Close>
        <Button>Cancel</Button>
      </Drawer.Close>
    </Drawer.Footer>
  </Drawer.Content>
</Drawer>;
```

## Composition

```
Drawer
├── Drawer.Trigger
└── Drawer.Content
    ├── Drawer.Header
    │   ├── Drawer.Title
    │   └── Drawer.Description
    ├── Drawer.Body
    └── Drawer.Footer
        └── Drawer.Close
```

## Edge space (`offset`)

Adjust the float gap from the viewport with `offset` on `<Drawer>` or `<Drawer.Content>` (Content wins). Defaults to **8** on every side (shadcn demos). Non-zero offset gets **24px** corner radius.

```tsx
{/* Uniform */}
<Drawer offset={16}>…</Drawer>
<Drawer offset="1rem">…</Drawer>
<Drawer offset={0}>…</Drawer> {/* edge-flush */}

{/* Per-side (same shape as Floating `offset`) */}
<Drawer offset={{ top: 8, bottom: 8, left: 0, right: 24 }}>…</Drawer>
<Drawer.Content offset={{ x: 12, y: 8 }}>…</Drawer.Content>
```

## Responsive mapping

`responsive` defaults to `true`. Side directions (`left` / `right`) become a bottom sheet (`down`) below the `md` breakpoint. Desktop never uses the sheet presentation. There is **no Modal ↔ Drawer** branch — only Drawer remaps.

```tsx
{/* Lock a right drawer on every breakpoint */}
<Drawer swipeDirection="right" responsive={false}>…</Drawer>

{/* Always a bottom sheet */}
<Drawer swipeDirection="down" responsive={false} showSwipeHandle>…</Drawer>
```

## Swipe handle

`showSwipeHandle` is **mobile sheet only**. On desktop side drawers the handle is not mounted and takes **no layout space**. Swipe-to-dismiss always works from the full panel.

## Nested drawers

Open a second `Drawer` inside `Drawer.Content`. Parents stay mounted and stack with scale/peek (`data-nested-drawer-open`).

## Peer runtime

`@base-ui/react` is a dependency of `@xco-agency/corex-ui` and must resolve at runtime.

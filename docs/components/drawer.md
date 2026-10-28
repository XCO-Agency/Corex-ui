# Drawer

Self-contained custom control (pattern 4) with **no third-party runtime** — presence, focus containment, scroll lock, Escape / outside press and swipe gestures are built in. Matches the [shadcn drawer](https://ui.shadcn.com/docs/components/base/drawer) visuals and gestures.

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

## Width (`width` on `Drawer.Content`)

| Value | Width |
| :---- | :---- |
| `"small"` | 20rem |
| `"base"` (default) | 24rem (75% below 640px) |
| `"large"` | 32rem |
| `"large-100"` / `"large-200"` / `"large-300"` / `"large-400"` / `"large-500"` | 36 / 40 / 48 / 56 / 64rem |
| `"full"` | Viewport minus the edge offsets |
| CSS length or number | `"420px"`, `"30rem"`, `"60vw"`, `360` (px) |

Every width is capped to the viewport minus the edge offsets, so large presets stay on screen on small viewports.

```tsx
<Drawer.Content width="large-200">…</Drawer.Content>
```

## Footer

`Drawer.Footer` lays actions out in a row aligned to the end and wraps when space runs out. Put the dismiss action first and the primary action last:

```tsx
<Drawer.Footer>
  <Drawer.Close>
    <Button>Cancel</Button>
  </Drawer.Close>
  <Button variant="primary">Save</Button>
</Drawer.Footer>
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

`showSwipeHandle` is **mobile sheet only**. On desktop side drawers the handle is not mounted and takes **no layout space**. Swipe-to-dismiss works from the full panel.

## Turning off swiping

Pass `swipeable={false}` when a drawer must only close from a control — a form with unsaved changes, a confirmation step. Dragging the panel then does nothing in any direction (no swipe-to-dismiss, no dragging between `snapPoints`), the swipe handle is hidden, and touch scrolling goes back to the browser. `Drawer.Close`, the header close button, Escape and the backdrop still close it.

```tsx
<Drawer swipeable={false}>
  <Drawer.Trigger>
    <Button>Edit product</Button>
  </Drawer.Trigger>
  <Drawer.Content>…</Drawer.Content>
</Drawer>
```

## Nested drawers

Open a second `Drawer` inside `Drawer.Content`. Parents stay mounted and stack with scale/peek (`data-nested-drawer-open`) on desktop drawers and mobile sheets alike: a parent sheet takes the frontmost sheet's height, then scales back and peeks out above it. Each open level steps one further back. The whole stack shares a single overlay, owned by the outermost modal drawer.

## Open state

`open` / `defaultOpen` / `onOpenChange(open, { reason })`, where `reason` is `"trigger-press" | "close-press" | "outside-press" | "escape-key" | "swipe"`. `onOpenChangeComplete(open)` fires after the transition. Escape and outside presses close the topmost drawer first.

Sheets accept `snapPoints` (a number `<= 1` is a viewport fraction, larger numbers are px, strings are CSS lengths) with `snapPoint` / `defaultSnapPoint` / `onSnapPointChange`.

## Close or open from anywhere (`useDrawer`)

`useDrawer()` works everywhere — it does **not** need a `<Drawer>` ancestor. What it targets depends on where it is called:

| Call | Target | `isOpen` |
| :--- | :----- | :------- |
| `useDrawer()` inside a Drawer's content | that (nearest) drawer | that drawer |
| `useDrawer()` outside any Drawer | the topmost open drawer for `close()` | any drawer open |
| `useDrawer("cart")` anywhere | `<Drawer id="cart">` | that drawer |

Every result has `{ isOpen, open, close, toggle, closeAll }`. `useDrawer()` also returns `insideDrawer`, and inside a Drawer that drawer's context fields (for the context alone, `useDrawerContext()` — it throws outside a Drawer).

```tsx
// Inside the drawer: no Drawer.Close wrapper needed.
function SaveButton() {
  const drawer = useDrawer();
  return <Button variant="primary" onClick={async () => { await save(); drawer.close(); }}>Save</Button>;
}

// Anywhere else (header, layout, route change handler…).
function Header() {
  const drawers = useDrawer();
  const cart = useDrawer("cart");
  return (
    <>
      <Button onClick={cart.toggle}>{cart.isOpen ? "Hide cart" : "Cart"}</Button>
      {drawers.isOpen ? <Button onClick={drawers.closeAll}>Close panels</Button> : null}
    </>
  );
}
```

Without React (a store, a fetch callback):

```ts
openDrawer("cart");
closeDrawer("cart");
closeDrawer(); // topmost open drawer
toggleDrawer("cart");
closeAllDrawers();
isDrawerOpen("cart");
isDrawerOpen(); // any drawer open
```

Changes made this way report `reason: "imperative"` to `onOpenChange`; a controlled drawer (`open` prop) still decides through `onOpenChange`. `open()` needs a target: inside a Drawer, or an `id` (outside without an id it only logs a development warning). `openDrawer` / `closeDrawer` / `toggleDrawer` return `false` when there was no matching drawer.

### External buttons and outside presses

Pressing outside a drawer closes it, which would make an external "toggle" button close and then reopen it. Mark external controls with `data-drawer-outside-control` (on the button or a wrapper) and presses on them are ignored by every drawer:

```tsx
<InlineStack gap="small-200" data-drawer-outside-control>
  <Button onClick={cart.toggle}>{cart.isOpen ? "Hide cart" : "Show cart"}</Button>
  <Button onClick={drawers.closeAll}>Close all</Button>
</InlineStack>
```

Use `modal={false}` when the page must stay clickable while the drawer is open; a modal drawer's backdrop covers the page.

## Runtime

No extra dependencies. The library must never depend on `@base-ui/*` (it pulls `use-sync-external-store/shim`, which breaks host storefronts); `src/dependencies.test.ts` enforces this.

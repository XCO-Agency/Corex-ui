import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { Drawer, resolveDrawerWidth, useDrawer, useDrawerContext } from "./Drawer";
import type { DrawerHandleType } from "./Drawer.types";
import { closeAllDrawers, closeDrawer, isDrawerOpen, openDrawer } from "./drawerRegistry";
import { Button } from "../Button";
import { BREAKPOINT_WIDTHS } from "../../hooks/useDimension";

function mockViewport(mdDown: boolean) {
  const width = mdDown ? BREAKPOINT_WIDTHS.md - 1 : BREAKPOINT_WIDTHS.md + 100;
  Object.defineProperty(window, "innerWidth", {
    configurable: true,
    writable: true,
    value: width,
  });
  window.dispatchEvent(new Event("resize"));
}

// jsdom has no PointerEvent: fireEvent.pointer* would drop pointerId / coordinates.
beforeAll(() => {
  if (typeof window.PointerEvent === "function") return;
  class PointerEventPolyfill extends MouseEvent {
    pointerId: number;
    pointerType: string;
    constructor(type: string, init: PointerEventInit = {}) {
      super(type, init);
      this.pointerId = init.pointerId ?? 0;
      this.pointerType = init.pointerType ?? "mouse";
    }
  }
  vi.stubGlobal("PointerEvent", PointerEventPolyfill);
});

afterEach(() => {
  vi.restoreAllMocks();
  Object.defineProperty(window, "innerWidth", {
    configurable: true,
    writable: true,
    value: 1024,
  });
});

describe("Drawer", () => {
  it("exposes compound parts on Drawer", () => {
    expect(Drawer.Trigger).toBeTruthy();
    expect(Drawer.Content).toBeTruthy();
    expect(Drawer.Header).toBeTruthy();
    expect(Drawer.Footer).toBeTruthy();
    expect(Drawer.Title).toBeTruthy();
    expect(Drawer.Description).toBeTruthy();
    expect(Drawer.Close).toBeTruthy();
    expect(Drawer.Body).toBeTruthy();
    expect(Drawer.Overlay).toBeTruthy();
    expect(Drawer.SwipeHandle).toBeTruthy();
    expect(Drawer.Portal).toBeTruthy();
  });

  it("throws when useDrawerContext is called outside of Drawer", () => {
    const Probe = () => {
      useDrawerContext();
      return null;
    };
    expect(() => render(<Probe />)).toThrow(
      "Drawer compound components must be used within a <Drawer />",
    );
  });

  it("defaults to a right drawer on desktop with edge offset and no swipe handle", () => {
    mockViewport(false);

    render(
      <Drawer showSwipeHandle defaultOpen>
        <Drawer.Trigger>
          <Button>Open drawer</Button>
        </Drawer.Trigger>
        <Drawer.Content>
          <Drawer.Header>
            <Drawer.Title>Pick a time</Drawer.Title>
            <Drawer.Description>Choose a delivery slot.</Drawer.Description>
          </Drawer.Header>
          <Drawer.Body>Body copy</Drawer.Body>
          <Drawer.Footer>
            <Drawer.Close>
              <Button>Cancel</Button>
            </Drawer.Close>
          </Drawer.Footer>
        </Drawer.Content>
      </Drawer>,
    );

    expect(document.getElementById("cx-drawer-styles")).toBeTruthy();
    const popup = document.querySelector('[data-slot="drawer-popup"]') as HTMLElement;
    expect(popup).toHaveAttribute("data-swipe-direction", "right");
    expect(popup).toHaveAttribute("data-presentation", "drawer");
    // Floating edge gap like shadcn (8px offset) — fully rounded panel.
    expect(popup).toHaveAttribute("data-has-offset");
    expect(popup.style.getPropertyValue("--drawer-offset-top")).toBe("8px");
    expect(popup.style.getPropertyValue("--drawer-offset-right")).toBe("8px");
    // Desktop never mounts the handle — no reserved space.
    expect(document.querySelector('[data-slot="drawer-swipe-handle"]')).toBeNull();
    expect(screen.getByText("Body copy")).toBeInTheDocument();
  });

  it("applies uniform and per-side offset props", () => {
    mockViewport(false);

    const { unmount } = render(
      <Drawer offset={16} defaultOpen>
        <Drawer.Trigger>
          <button type="button">Open</button>
        </Drawer.Trigger>
        <Drawer.Content>
          <Drawer.Title>Uniform</Drawer.Title>
        </Drawer.Content>
      </Drawer>,
    );

    let popup = document.querySelector('[data-slot="drawer-popup"]') as HTMLElement;
    expect(popup.style.getPropertyValue("--drawer-offset-top")).toBe("16px");
    expect(popup.style.getPropertyValue("--drawer-offset-left")).toBe("16px");
    unmount();

    render(
      <Drawer offset={{ top: 4, right: "2rem", bottom: 0, left: 12 }} defaultOpen>
        <Drawer.Trigger>
          <button type="button">Open</button>
        </Drawer.Trigger>
        <Drawer.Content>
          <Drawer.Title>Per side</Drawer.Title>
        </Drawer.Content>
      </Drawer>,
    );

    popup = document.querySelector('[data-slot="drawer-popup"]') as HTMLElement;
    expect(popup.style.getPropertyValue("--drawer-offset-top")).toBe("4px");
    expect(popup.style.getPropertyValue("--drawer-offset-right")).toBe("2rem");
    expect(popup.style.getPropertyValue("--drawer-offset-bottom")).toBe("0px");
    expect(popup.style.getPropertyValue("--drawer-offset-left")).toBe("12px");
    expect(popup).toHaveAttribute("data-has-offset");
  });

  it("maps the default right drawer to a bottom sheet on mobile", () => {
    mockViewport(true);

    render(
      <Drawer showSwipeHandle defaultOpen>
        <Drawer.Trigger>
          <button type="button">Open</button>
        </Drawer.Trigger>
        <Drawer.Content>
          <Drawer.Title>Mobile sheet</Drawer.Title>
        </Drawer.Content>
      </Drawer>,
    );

    const popup = document.querySelector('[data-slot="drawer-popup"]');
    expect(popup).toHaveAttribute("data-swipe-direction", "down");
    expect(popup).toHaveAttribute("data-presentation", "sheet");
    expect(popup).toHaveAttribute("data-has-offset");
    expect(document.querySelector('[data-slot="drawer-swipe-handle"]')).toBeTruthy();
  });

  it("keeps a locked side drawer when responsive is false", () => {
    mockViewport(true);

    render(
      <Drawer swipeDirection="right" responsive={false} defaultOpen>
        <Drawer.Trigger>
          <button type="button">Open</button>
        </Drawer.Trigger>
        <Drawer.Content>
          <Drawer.Title>Locked right</Drawer.Title>
        </Drawer.Content>
      </Drawer>,
    );

    const popup = document.querySelector('[data-slot="drawer-popup"]');
    expect(popup).toHaveAttribute("data-swipe-direction", "right");
    expect(popup).toHaveAttribute("data-presentation", "drawer");
    expect(document.querySelector('[data-slot="drawer-swipe-handle"]')).toBeNull();
  });

  it("supports nested drawers staying mounted", () => {
    mockViewport(false);

    render(
      <Drawer defaultOpen>
        <Drawer.Trigger>
          <button type="button">Parent</button>
        </Drawer.Trigger>
        <Drawer.Content>
          <Drawer.Title>Parent drawer</Drawer.Title>
          <Drawer defaultOpen>
            <Drawer.Trigger>
              <button type="button">Child</button>
            </Drawer.Trigger>
            <Drawer.Content>
              <Drawer.Title>Nested drawer</Drawer.Title>
            </Drawer.Content>
          </Drawer>
        </Drawer.Content>
      </Drawer>,
    );

    expect(screen.getByText("Nested drawer")).toBeInTheDocument();
    expect(document.querySelectorAll('[data-slot="drawer-popup"]').length).toBeGreaterThanOrEqual(
      2,
    );
    expect(document.body.textContent).toContain("Parent drawer");
  });

  it("opens from the trigger, closes from Close, and reports reasons", () => {
    mockViewport(false);
    const onOpenChange = vi.fn();
    render(
      <Drawer onOpenChange={onOpenChange}>
        <Drawer.Trigger>
          <button type="button">Open</button>
        </Drawer.Trigger>
        <Drawer.Content>
          <Drawer.Title>Panel</Drawer.Title>
          <Drawer.Close>
            <button type="button">Done</button>
          </Drawer.Close>
        </Drawer.Content>
      </Drawer>,
    );

    const trigger = screen.getByRole("button", { name: "Open" });
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(document.querySelector('[data-slot="drawer-popup"]')).toBeNull();

    fireEvent.click(trigger);
    expect(onOpenChange).toHaveBeenLastCalledWith(true, { reason: "trigger-press" });
    const dialog = screen.getByRole("dialog", { name: "Panel" });
    expect(dialog).toHaveAttribute("aria-modal", "true");
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(trigger).toHaveAttribute("aria-controls", dialog.id);

    fireEvent.click(screen.getByRole("button", { name: "Done" }));
    expect(onOpenChange).toHaveBeenLastCalledWith(false, { reason: "close-press" });
    expect(dialog).toHaveAttribute("data-ending-style");
  });

  it("closes on Escape and on an outside press, topmost layer first", () => {
    mockViewport(false);
    const onParent = vi.fn();
    const onChild = vi.fn();
    render(
      <Drawer defaultOpen onOpenChange={onParent}>
        <Drawer.Content>
          <Drawer.Title>Parent</Drawer.Title>
          <Drawer defaultOpen onOpenChange={onChild}>
            <Drawer.Content>
              <Drawer.Title>Child</Drawer.Title>
            </Drawer.Content>
          </Drawer>
        </Drawer.Content>
      </Drawer>,
    );

    const parent = screen.getByRole("dialog", { name: "Parent" });
    expect(parent).toHaveAttribute("data-nested-drawer-open");

    fireEvent.keyDown(document, { key: "Escape" });
    expect(onChild).toHaveBeenLastCalledWith(false, { reason: "escape-key" });
    expect(onParent).not.toHaveBeenCalled();

    act(() => {
      document.querySelector('[data-slot="drawer-overlay"]')!.dispatchEvent(
        new Event("pointerdown", { bubbles: true }),
      );
    });
    expect(onParent).toHaveBeenLastCalledWith(false, { reason: "outside-press" });
  });

  it("resolves width presets, CSS lengths and pixel numbers", () => {
    expect(resolveDrawerWidth("small")).toBe("20rem");
    expect(resolveDrawerWidth("base")).toBe("24rem");
    expect(resolveDrawerWidth("large")).toBe("32rem");
    expect(resolveDrawerWidth("large-100")).toBe("36rem");
    expect(resolveDrawerWidth("large-500")).toBe("64rem");
    expect(resolveDrawerWidth("full")).toContain("100%");
    expect(resolveDrawerWidth("420px")).toBe("420px");
    expect(resolveDrawerWidth("30rem")).toBe("30rem");
    expect(resolveDrawerWidth(360)).toBe("360px");
    expect(resolveDrawerWidth("360")).toBe("360px");
  });

  it("applies the width variant to the panel", () => {
    mockViewport(false);
    render(
      <Drawer defaultOpen>
        <Drawer.Content width="large-200">
          <Drawer.Title>Wide</Drawer.Title>
        </Drawer.Content>
      </Drawer>,
    );
    const popup = document.querySelector('[data-slot="drawer-popup"]') as HTMLElement;
    expect(popup.style.getPropertyValue("--drawer-content-width")).toBe("40rem");
    expect(popup).toHaveAttribute("data-width", "large-200");
  });

  it("renders a single overlay for a stack of nested drawers", () => {
    mockViewport(true);
    render(
      <Drawer defaultOpen>
        <Drawer.Content>
          <Drawer.Title>Parent</Drawer.Title>
          <Drawer defaultOpen>
            <Drawer.Content>
              <Drawer.Title>Child</Drawer.Title>
              <Drawer defaultOpen>
                <Drawer.Content>
                  <Drawer.Title>Grandchild</Drawer.Title>
                </Drawer.Content>
              </Drawer>
            </Drawer.Content>
          </Drawer>
        </Drawer.Content>
      </Drawer>,
    );

    expect(document.querySelectorAll('[data-slot="drawer-overlay"]')).toHaveLength(1);
    const parent = screen.getByRole("dialog", { name: "Parent" });
    const child = screen.getByRole("dialog", { name: "Child" });
    // Every open descendant counts, so each level steps further back.
    expect(parent.style.getPropertyValue("--nested-drawers")).toBe("2");
    expect(child.style.getPropertyValue("--nested-drawers")).toBe("1");
    expect(child).toHaveAttribute("data-nested");
    expect(parent).toHaveAttribute("data-presentation", "sheet");
  });

  it("gives a nested modal drawer its own overlay when the parent is not modal", () => {
    mockViewport(false);
    render(
      <Drawer defaultOpen modal={false}>
        <Drawer.Content>
          <Drawer.Title>Parent</Drawer.Title>
          <Drawer defaultOpen>
            <Drawer.Content>
              <Drawer.Title>Child</Drawer.Title>
            </Drawer.Content>
          </Drawer>
        </Drawer.Content>
      </Drawer>,
    );
    expect(document.querySelectorAll('[data-slot="drawer-overlay"]')).toHaveLength(1);
  });

  it("closes the nearest drawer from a deep child with useDrawer().close()", () => {
    mockViewport(false);
    const onOpenChange = vi.fn();
    function SaveButton() {
      const drawer = useDrawer();
      return (
        <button type="button" onClick={() => drawer.close()}>
          Save {drawer.isOpen ? "(open)" : ""}
        </button>
      );
    }
    render(
      <Drawer defaultOpen onOpenChange={onOpenChange}>
        <Drawer.Content>
          <Drawer.Title>Form</Drawer.Title>
          <Drawer.Body>
            <div>
              <SaveButton />
            </div>
          </Drawer.Body>
        </Drawer.Content>
      </Drawer>,
    );
    fireEvent.click(screen.getByRole("button", { name: "Save (open)" }));
    expect(onOpenChange).toHaveBeenCalledWith(false, { reason: "imperative" });
  });

  it("controls a drawer by id from outside its tree", () => {
    mockViewport(false);
    function Header() {
      const cart = useDrawer("cart");
      return (
        <>
          <button type="button" onClick={cart.open}>
            Cart {cart.isOpen ? "open" : "closed"}
          </button>
          <button type="button" onClick={cart.close}>
            Hide cart
          </button>
        </>
      );
    }
    render(
      <>
        <Header />
        <Drawer id="cart">
          <Drawer.Content>
            <Drawer.Title>Cart</Drawer.Title>
          </Drawer.Content>
        </Drawer>
      </>,
    );

    expect(screen.queryByRole("dialog", { name: "Cart" })).toBeNull();
    fireEvent.click(screen.getByRole("button", { name: "Cart closed" }));
    expect(screen.getByRole("dialog", { name: "Cart" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Cart open" })).toBeInTheDocument();
    expect(isDrawerOpen("cart")).toBe(true);

    fireEvent.click(screen.getByRole("button", { name: "Hide cart" }));
    expect(screen.getByRole("button", { name: "Cart closed" })).toBeInTheDocument();

    act(() => {
      expect(openDrawer("cart")).toBe(true);
    });
    expect(isDrawerOpen("cart")).toBe(true);
    act(() => closeAllDrawers());
    expect(isDrawerOpen("cart")).toBe(false);
    expect(closeDrawer("missing")).toBe(false);
  });

  it("works outside any Drawer: close() closes the topmost open drawer", () => {
    mockViewport(false);
    const onCart = vi.fn();
    const onFilters = vi.fn();
    let controls: DrawerHandleType | null = null;
    function Outside() {
      const drawer = useDrawer();
      controls = drawer;
      return <span>{drawer.isOpen ? "something open" : "all closed"}</span>;
    }
    render(
      <>
        <Outside />
        <Drawer defaultOpen onOpenChange={onCart}>
          <Drawer.Content>
            <Drawer.Title>Cart</Drawer.Title>
          </Drawer.Content>
        </Drawer>
        <Drawer defaultOpen onOpenChange={onFilters}>
          <Drawer.Content>
            <Drawer.Title>Filters</Drawer.Title>
          </Drawer.Content>
        </Drawer>
      </>,
    );

    expect(controls!.insideDrawer).toBe(false);
    expect(screen.getByText("something open")).toBeInTheDocument();

    // Topmost (most recently opened) first.
    act(() => controls!.close());
    expect(onFilters).toHaveBeenLastCalledWith(false, { reason: "imperative" });
    expect(onCart).not.toHaveBeenCalled();

    act(() => controls!.close());
    expect(onCart).toHaveBeenLastCalledWith(false, { reason: "imperative" });
    expect(screen.getByText("all closed")).toBeInTheDocument();
    expect(closeDrawer()).toBe(false);
  });

  it("closeAll() closes every open drawer from anywhere", () => {
    mockViewport(false);
    let closeAll = () => {};
    function Outside() {
      closeAll = useDrawer().closeAll;
      return null;
    }
    render(
      <>
        <Outside />
        <Drawer defaultOpen>
          <Drawer.Content>
            <Drawer.Title>One</Drawer.Title>
          </Drawer.Content>
        </Drawer>
        <Drawer defaultOpen id="two">
          <Drawer.Content>
            <Drawer.Title>Two</Drawer.Title>
          </Drawer.Content>
        </Drawer>
      </>,
    );
    expect(isDrawerOpen()).toBe(true);
    act(() => closeAll());
    expect(isDrawerOpen()).toBe(false);
    expect(isDrawerOpen("two")).toBe(false);
  });

  it("ignores presses on data-drawer-outside-control elements", () => {
    mockViewport(false);
    const onOpenChange = vi.fn();
    render(
      <>
        <div data-drawer-outside-control>
          <button type="button">External toggle</button>
        </div>
        <button type="button">Elsewhere</button>
        <Drawer defaultOpen modal={false} onOpenChange={onOpenChange}>
          <Drawer.Content>
            <Drawer.Title>Panel</Drawer.Title>
          </Drawer.Content>
        </Drawer>
      </>,
    );
    fireEvent.pointerDown(screen.getByRole("button", { name: "External toggle" }));
    expect(onOpenChange).not.toHaveBeenCalled();
    fireEvent.pointerDown(screen.getByRole("button", { name: "Elsewhere" }));
    expect(onOpenChange).toHaveBeenCalledWith(false, { reason: "outside-press" });
  });

  it("swipes only the active drawer in a nested stack", () => {
    mockViewport(false);
    const onParent = vi.fn();
    const onChild = vi.fn();
    render(
      <Drawer defaultOpen onOpenChange={onParent}>
        <Drawer.Content>
          <Drawer.Title>Parent</Drawer.Title>
          <Drawer defaultOpen onOpenChange={onChild}>
            <Drawer.Content>
              <Drawer.Title>Child</Drawer.Title>
            </Drawer.Content>
          </Drawer>
        </Drawer.Content>
      </Drawer>,
    );
    const parent = screen.getByRole("dialog", { name: "Parent" });
    const child = screen.getByRole("dialog", { name: "Child" });
    for (const popup of [parent, child]) {
      Object.defineProperty(popup, "offsetWidth", { configurable: true, value: 400 });
    }

    const swipe = (element: HTMLElement) => {
      fireEvent.pointerDown(element, { pointerId: 1, clientX: 100, clientY: 100, button: 0, pointerType: "mouse" });
      fireEvent.pointerMove(window, { pointerId: 1, clientX: 180, clientY: 100 });
      return () => {
        // Past 30% of the panel width: a dismissing swipe.
        fireEvent.pointerMove(window, { pointerId: 1, clientX: 300, clientY: 100 });
        fireEvent.pointerUp(window, { pointerId: 1, clientX: 300, clientY: 100 });
      };
    };

    // Dragging the child moves only the child.
    const release = swipe(child);
    expect(child).toHaveAttribute("data-swiping");
    expect(parent).not.toHaveAttribute("data-swiping");
    release();
    expect(onChild).toHaveBeenCalledWith(false, { reason: "swipe" });
    expect(onParent).not.toHaveBeenCalled();
  });

  it("does not swipe a parent while a nested drawer is open on top", () => {
    mockViewport(false);
    render(
      <Drawer defaultOpen>
        <Drawer.Content>
          <Drawer.Title>Parent</Drawer.Title>
          <Drawer defaultOpen>
            <Drawer.Content>
              <Drawer.Title>Child</Drawer.Title>
            </Drawer.Content>
          </Drawer>
        </Drawer.Content>
      </Drawer>,
    );
    const parent = screen.getByRole("dialog", { name: "Parent" });
    fireEvent.pointerDown(parent, { pointerId: 2, clientX: 100, clientY: 100, button: 0, pointerType: "mouse" });
    fireEvent.pointerMove(window, { pointerId: 2, clientX: 200, clientY: 100 });
    expect(parent).not.toHaveAttribute("data-swiping");
    fireEvent.pointerUp(window, { pointerId: 2, clientX: 200, clientY: 100 });
  });
});

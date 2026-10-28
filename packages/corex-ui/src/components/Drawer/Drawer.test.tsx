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
  Object.defineProperty(window, "innerHeight", { configurable: true, writable: true, value: 768 });
});

function StackOfThree({ grandchildOpen }: { grandchildOpen: boolean }) {
  return (
    <Drawer defaultOpen>
      <Drawer.Content>
        <Drawer.Title>Parent</Drawer.Title>
        <Drawer defaultOpen>
          <Drawer.Content>
            <Drawer.Title>Child</Drawer.Title>
            <Drawer open={grandchildOpen}>
              <Drawer.Content>
                <Drawer.Title>Grandchild</Drawer.Title>
              </Drawer.Content>
            </Drawer>
          </Drawer.Content>
        </Drawer>
      </Drawer.Content>
    </Drawer>
  );
}

describe("Drawer", () => {
  it("exposes compound parts on Drawer", () => {
    expect(Drawer.Trigger).toBeTruthy();
    expect(Drawer.Content).toBeTruthy();
    expect(Drawer.Header).toBeTruthy();
    expect(Drawer.Footer).toBeTruthy();
    expect(Drawer.PreFooter).toBeTruthy();
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

  it("gives every level of a sheet stack the frontmost sheet's height", () => {
    mockViewport(true);
    const heights: Record<string, number> = { Parent: 600, Child: 420, Grandchild: 180 };
    vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockImplementation(function (
      this: HTMLElement,
    ) {
      const title = this.querySelector?.('[data-slot="drawer-title"]')?.textContent ?? "";
      return { height: heights[title] ?? 0, width: 0, top: 0, left: 0, right: 0, bottom: 0, x: 0, y: 0, toJSON: () => ({}) } as DOMRect;
    });
    const { rerender } = render(<StackOfThree grandchildOpen={false} />);
    // Opening the third level after the second must not reset the first.
    rerender(<StackOfThree grandchildOpen />);

    const parent = screen.getByRole("dialog", { name: "Parent" });
    const child = screen.getByRole("dialog", { name: "Child" });
    expect(child.style.getPropertyValue("--drawer-frontmost-height")).toBe("180px");
    expect(parent.style.getPropertyValue("--drawer-frontmost-height")).toBe("180px");
    expect(parent).toHaveAttribute("data-stack-measured");
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

  it("ignores drags when swipeable is false", () => {
    mockViewport(false);
    const onOpenChange = vi.fn();
    render(
      <Drawer defaultOpen swipeable={false} onOpenChange={onOpenChange}>
        <Drawer.Content>
          <Drawer.Title>Locked</Drawer.Title>
        </Drawer.Content>
      </Drawer>,
    );
    const popup = screen.getByRole("dialog", { name: "Locked" });
    Object.defineProperty(popup, "offsetWidth", { configurable: true, value: 400 });
    expect(popup).toHaveAttribute("data-swipeable", "false");

    // The same past-threshold drag that dismisses a swipeable drawer.
    fireEvent.pointerDown(popup, { pointerId: 1, clientX: 100, clientY: 100, button: 0, pointerType: "mouse" });
    fireEvent.pointerMove(window, { pointerId: 1, clientX: 180, clientY: 100 });
    expect(popup).not.toHaveAttribute("data-swiping");
    fireEvent.pointerMove(window, { pointerId: 1, clientX: 300, clientY: 100 });
    fireEvent.pointerUp(window, { pointerId: 1, clientX: 300, clientY: 100 });

    expect(onOpenChange).not.toHaveBeenCalled();
    expect(screen.getByRole("dialog", { name: "Locked" })).toBeInTheDocument();
  });

  it("hides the mobile swipe handle when swipeable is false", () => {
    mockViewport(true);
    render(
      <Drawer defaultOpen showSwipeHandle swipeable={false}>
        <Drawer.Content>
          <Drawer.Title>Sheet</Drawer.Title>
        </Drawer.Content>
      </Drawer>,
    );
    expect(document.querySelector('[data-slot="drawer-popup"]')).toHaveAttribute(
      "data-presentation",
      "sheet",
    );
    expect(document.querySelector('[data-slot="drawer-swipe-handle"]')).toBeNull();
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

  describe("nested variants", () => {
    it("places an aside drawer beside its parent, on the parent's side", () => {
      mockViewport(false);
      vi.spyOn(HTMLElement.prototype, "offsetWidth", "get").mockReturnValue(320);
      render(
        <Drawer defaultOpen swipeDirection="left" responsive={false}>
          <Drawer.Content>
            <Drawer.Title>Parent</Drawer.Title>
            <Drawer defaultOpen variant="aside">
              <Drawer.Content>
                <Drawer.Title>Aside</Drawer.Title>
              </Drawer.Content>
            </Drawer>
          </Drawer.Content>
        </Drawer>,
      );

      const parent = screen.getByRole("dialog", { name: "Parent" });
      const aside = screen.getByRole("dialog", { name: "Aside" });
      expect(aside).toHaveAttribute("data-variant", "aside");
      expect(aside).toHaveAttribute("data-swipe-direction", "left");
      expect(aside.parentElement).toHaveAttribute("data-variant", "aside");
      // Beside, not on top: no scale-back, the parent slides by the aside's width.
      expect(parent).not.toHaveAttribute("data-nested-drawer-open");
      expect(parent.style.getPropertyValue("--nested-drawers")).toBe("0");
      expect(parent).toHaveAttribute("data-nested-aside-open");
      expect(parent.style.getPropertyValue("--drawer-aside-shift")).toBe("320px");
    });

    it("chains aside shifts so every ancestor makes room", () => {
      mockViewport(false);
      vi.spyOn(HTMLElement.prototype, "offsetWidth", "get").mockReturnValue(300);
      render(
        <Drawer defaultOpen>
          <Drawer.Content>
            <Drawer.Title>One</Drawer.Title>
            <Drawer defaultOpen variant="aside">
              <Drawer.Content>
                <Drawer.Title>Two</Drawer.Title>
                <Drawer defaultOpen variant="aside">
                  <Drawer.Content>
                    <Drawer.Title>Three</Drawer.Title>
                  </Drawer.Content>
                </Drawer>
              </Drawer.Content>
            </Drawer>
          </Drawer.Content>
        </Drawer>,
      );

      expect(
        screen.getByRole("dialog", { name: "Two" }).style.getPropertyValue("--drawer-aside-shift"),
      ).toBe("300px");
      expect(
        screen.getByRole("dialog", { name: "One" }).style.getPropertyValue("--drawer-aside-shift"),
      ).toBe("600px");
    });

    it("keeps the float stack on mobile", () => {
      mockViewport(true);
      render(
        <Drawer defaultOpen>
          <Drawer.Content>
            <Drawer.Title>Parent</Drawer.Title>
            <Drawer defaultOpen variant="aside">
              <Drawer.Content>
                <Drawer.Title>Aside</Drawer.Title>
              </Drawer.Content>
            </Drawer>
          </Drawer.Content>
        </Drawer>,
      );

      expect(screen.getByRole("dialog", { name: "Aside" })).toHaveAttribute("data-variant", "float");
      expect(screen.getByRole("dialog", { name: "Parent" })).toHaveAttribute("data-nested-drawer-open");
    });

    it("splits the parent's column with a bottom drawer", () => {
      mockViewport(false);
      vi.spyOn(HTMLElement.prototype, "offsetHeight", "get").mockReturnValue(240);
      render(
        <Drawer defaultOpen offset={12}>
          <Drawer.Content width="large">
            <Drawer.Title>Parent</Drawer.Title>
            <Drawer defaultOpen variant="bottom" offset={0}>
              <Drawer.Content width="small">
                <Drawer.Title>Bottom</Drawer.Title>
              </Drawer.Content>
            </Drawer>
          </Drawer.Content>
        </Drawer>,
      );

      const parent = screen.getByRole("dialog", { name: "Parent" });
      const bottom = screen.getByRole("dialog", { name: "Bottom" });
      expect(bottom).toHaveAttribute("data-variant", "bottom");
      // Same column as the parent: its width and offsets win over the child's own.
      expect(bottom.style.getPropertyValue("--drawer-content-width")).toBe("32rem");
      expect(bottom.style.getPropertyValue("--drawer-offset-right")).toBe("12px");
      expect(parent).not.toHaveAttribute("data-nested-drawer-open");
      expect(parent).toHaveAttribute("data-nested-bottom-open");
      expect(parent.style.getPropertyValue("--drawer-push-bottom")).toBe("240px");
    });

    it("sizes a bottom drawer from its active snap point", () => {
      mockViewport(false);
      Object.defineProperty(window, "innerHeight", { configurable: true, writable: true, value: 1000 });
      render(
        <Drawer defaultOpen>
          <Drawer.Content>
            <Drawer.Title>Parent</Drawer.Title>
            <Drawer defaultOpen variant="bottom" snapPoints={[0.3, 0.6]} defaultSnapPoint={0.6}>
              <Drawer.Content>
                <Drawer.Title>Bottom</Drawer.Title>
              </Drawer.Content>
            </Drawer>
          </Drawer.Content>
        </Drawer>,
      );

      const bottom = screen.getByRole("dialog", { name: "Bottom" });
      expect(bottom).toHaveAttribute("data-snap-points");
      expect(bottom.style.getPropertyValue("--drawer-content-height")).toBe("600px");
    });

    it("lays out [parent · aside + bottom] with the bottom drawer in the aside's column", () => {
      mockViewport(false);
      vi.spyOn(HTMLElement.prototype, "offsetWidth", "get").mockReturnValue(300);
      vi.spyOn(HTMLElement.prototype, "offsetHeight", "get").mockReturnValue(200);
      render(
        <Drawer defaultOpen>
          <Drawer.Content>
            <Drawer.Title>One</Drawer.Title>
            <Drawer defaultOpen variant="aside">
              <Drawer.Content width="small">
                <Drawer.Title>Two</Drawer.Title>
                <Drawer defaultOpen variant="bottom">
                  <Drawer.Content>
                    <Drawer.Title>Three</Drawer.Title>
                  </Drawer.Content>
                </Drawer>
              </Drawer.Content>
            </Drawer>
          </Drawer.Content>
        </Drawer>,
      );

      const one = screen.getByRole("dialog", { name: "One" });
      const two = screen.getByRole("dialog", { name: "Two" });
      const three = screen.getByRole("dialog", { name: "Three" });
      expect(one.style.getPropertyValue("--drawer-aside-shift")).toBe("300px");
      expect(one.style.getPropertyValue("--drawer-push-bottom")).toBe("");
      expect(two.style.getPropertyValue("--drawer-push-bottom")).toBe("200px");
      expect(three.style.getPropertyValue("--drawer-content-width")).toBe("20rem");
    });

    it("keeps an aside drawer open when its parent panel is pressed", () => {
      mockViewport(false);
      const onAside = vi.fn();
      render(
        <Drawer defaultOpen>
          <Drawer.Content>
            <Drawer.Title>Parent</Drawer.Title>
            <Drawer defaultOpen variant="aside" onOpenChange={onAside}>
              <Drawer.Content>
                <Drawer.Title>Aside</Drawer.Title>
              </Drawer.Content>
            </Drawer>
          </Drawer.Content>
        </Drawer>,
      );

      act(() => {
        screen
          .getByRole("dialog", { name: "Parent" })
          .dispatchEvent(new Event("pointerdown", { bubbles: true }));
      });
      expect(onAside).not.toHaveBeenCalled();

      act(() => {
        document.querySelector('[data-slot="drawer-overlay"]')!.dispatchEvent(
          new Event("pointerdown", { bubbles: true }),
        );
      });
      expect(onAside).toHaveBeenLastCalledWith(false, { reason: "outside-press" });
    });
  });

  describe("overlay variant and aside position", () => {
    it("shows an overlay over the parent without stacking or pushing it", () => {
      mockViewport(false);
      vi.spyOn(HTMLElement.prototype, "offsetHeight", "get").mockReturnValue(120);
      render(
        <Drawer defaultOpen>
          <Drawer.Content width="large">
            <Drawer.Title>Parent</Drawer.Title>
            <Drawer defaultOpen variant="overlay">
              <Drawer.Content>
                <Drawer.Title>Confirm</Drawer.Title>
              </Drawer.Content>
            </Drawer>
          </Drawer.Content>
        </Drawer>,
      );

      const parent = screen.getByRole("dialog", { name: "Parent" });
      const overlay = screen.getByRole("dialog", { name: "Confirm" });
      expect(overlay).toHaveAttribute("data-variant", "overlay");
      expect(overlay).toHaveAttribute("data-position", "bottom");
      expect(overlay.style.getPropertyValue("--drawer-content-width")).toBe("32rem");
      expect(overlay.parentElement).toHaveAttribute("data-variant", "overlay");
      // The parent keeps its look: no scale-back, no slide, no push.
      expect(parent).not.toHaveAttribute("data-nested-drawer-open");
      expect(parent.style.getPropertyValue("--nested-drawers")).toBe("0");
      expect(parent.style.getPropertyValue("--drawer-push-bottom")).toBe("");
      expect(parent.style.getPropertyValue("--drawer-aside-shift")).toBe("");
    });

    it("places an overlay at the top and keeps it on mobile sheets", () => {
      mockViewport(true);
      render(
        <Drawer defaultOpen>
          <Drawer.Content>
            <Drawer.Title>Parent</Drawer.Title>
            <Drawer defaultOpen variant="overlay" position="top">
              <Drawer.Content>
                <Drawer.Title>Toast</Drawer.Title>
              </Drawer.Content>
            </Drawer>
          </Drawer.Content>
        </Drawer>,
      );

      const overlay = screen.getByRole("dialog", { name: "Toast" });
      expect(overlay).toHaveAttribute("data-variant", "overlay");
      expect(overlay).toHaveAttribute("data-position", "top");
      expect(screen.getByRole("dialog", { name: "Parent" })).not.toHaveAttribute(
        "data-nested-drawer-open",
      );
    });

    it("is a plain drawer at the top level", () => {
      mockViewport(false);
      render(
        <Drawer defaultOpen variant="overlay">
          <Drawer.Content>
            <Drawer.Title>Alone</Drawer.Title>
          </Drawer.Content>
        </Drawer>,
      );
      expect(screen.getByRole("dialog", { name: "Alone" })).toHaveAttribute("data-variant", "float");
    });

    it("opens an aside on the parent's inner side without moving the parent", () => {
      mockViewport(false);
      vi.spyOn(HTMLElement.prototype, "offsetWidth", "get").mockReturnValue(384);
      render(
        <Drawer defaultOpen>
          <Drawer.Content>
            <Drawer.Title>Parent</Drawer.Title>
            <Drawer defaultOpen variant="aside" position="left">
              <Drawer.Content>
                <Drawer.Title>Aside</Drawer.Title>
              </Drawer.Content>
            </Drawer>
          </Drawer.Content>
        </Drawer>,
      );

      const parent = screen.getByRole("dialog", { name: "Parent" });
      const aside = screen.getByRole("dialog", { name: "Aside" });
      expect(aside).toHaveAttribute("data-position", "inner");
      expect(aside).toHaveAttribute("data-swipe-direction", "right");
      expect(aside.style.getPropertyValue("--drawer-aside-shift")).toBe("384px");
      expect(parent.style.getPropertyValue("--drawer-aside-shift")).toBe("");
      expect(parent).not.toHaveAttribute("data-nested-aside-open");
    });

    it("keeps the edge layout when the aside position matches the parent's side", () => {
      mockViewport(false);
      vi.spyOn(HTMLElement.prototype, "offsetWidth", "get").mockReturnValue(300);
      render(
        <Drawer defaultOpen>
          <Drawer.Content>
            <Drawer.Title>Parent</Drawer.Title>
            <Drawer defaultOpen variant="aside" position="right">
              <Drawer.Content>
                <Drawer.Title>Aside</Drawer.Title>
              </Drawer.Content>
            </Drawer>
          </Drawer.Content>
        </Drawer>,
      );

      expect(screen.getByRole("dialog", { name: "Aside" })).toHaveAttribute("data-position", "edge");
      expect(
        screen.getByRole("dialog", { name: "Parent" }).style.getPropertyValue("--drawer-aside-shift"),
      ).toBe("300px");
    });
  });

  describe("chaining aside and overlay", () => {
    it("drawer → aside → overlay: the overlay covers the aside's column", () => {
      mockViewport(false);
      vi.spyOn(HTMLElement.prototype, "offsetWidth", "get").mockReturnValue(320);
      render(
        <Drawer defaultOpen>
          <Drawer.Content>
            <Drawer.Title>One</Drawer.Title>
            <Drawer defaultOpen variant="aside">
              <Drawer.Content width="small">
                <Drawer.Title>Aside</Drawer.Title>
                <Drawer defaultOpen variant="overlay">
                  <Drawer.Content>
                    <Drawer.Title>Confirm</Drawer.Title>
                  </Drawer.Content>
                </Drawer>
              </Drawer.Content>
            </Drawer>
          </Drawer.Content>
        </Drawer>,
      );

      const one = screen.getByRole("dialog", { name: "One" });
      const aside = screen.getByRole("dialog", { name: "Aside" });
      const overlay = screen.getByRole("dialog", { name: "Confirm" });
      expect(overlay.style.getPropertyValue("--drawer-content-width")).toBe("20rem");
      expect(overlay).toHaveAttribute("data-swipe-direction", "right");
      // The overlay changes nothing around it.
      expect(one.style.getPropertyValue("--drawer-aside-shift")).toBe("320px");
      expect(aside.style.getPropertyValue("--drawer-aside-shift")).toBe("");
      expect(aside).not.toHaveAttribute("data-nested-drawer-open");
    });

    it("drawer → overlay → aside: the whole column slides for the aside", () => {
      mockViewport(false);
      vi.spyOn(HTMLElement.prototype, "offsetWidth", "get").mockReturnValue(300);
      render(
        <Drawer defaultOpen>
          <Drawer.Content>
            <Drawer.Title>One</Drawer.Title>
            <Drawer defaultOpen variant="overlay">
              <Drawer.Content>
                <Drawer.Title>Overlay</Drawer.Title>
                <Drawer defaultOpen variant="aside">
                  <Drawer.Content>
                    <Drawer.Title>Aside</Drawer.Title>
                  </Drawer.Content>
                </Drawer>
              </Drawer.Content>
            </Drawer>
          </Drawer.Content>
        </Drawer>,
      );

      expect(
        screen.getByRole("dialog", { name: "One" }).style.getPropertyValue("--drawer-aside-shift"),
      ).toBe("300px");
      expect(
        screen.getByRole("dialog", { name: "Overlay" }).style.getPropertyValue("--drawer-aside-shift"),
      ).toBe("300px");
    });

    it("lines a top overlay up with its parent's top edge", () => {
      mockViewport(false);
      vi.spyOn(HTMLElement.prototype, "offsetTop", "get").mockReturnValue(400);
      render(
        <Drawer defaultOpen>
          <Drawer.Content>
            <Drawer.Title>One</Drawer.Title>
            <Drawer defaultOpen variant="bottom">
              <Drawer.Content>
                <Drawer.Title>Bottom</Drawer.Title>
                <Drawer defaultOpen variant="overlay" position="top">
                  <Drawer.Content>
                    <Drawer.Title>Toast</Drawer.Title>
                  </Drawer.Content>
                </Drawer>
              </Drawer.Content>
            </Drawer>
          </Drawer.Content>
        </Drawer>,
      );

      expect(
        screen.getByRole("dialog", { name: "Toast" }).style.getPropertyValue("--drawer-overlay-top"),
      ).toBe("400px");
    });
  });

  describe("header, pre-footer and footer", () => {
    it("renders a close button in the header's end slot by default", () => {
      mockViewport(false);
      const onOpenChange = vi.fn();
      render(
        <Drawer defaultOpen onOpenChange={onOpenChange}>
          <Drawer.Content>
            <Drawer.Header>
              <Drawer.Title>Order</Drawer.Title>
            </Drawer.Header>
          </Drawer.Content>
        </Drawer>,
      );

      const header = document.querySelector('[data-slot="drawer-header"]')!;
      expect(header).toHaveAttribute("data-mobile-align", "start");
      expect(header.querySelector('[data-slot="drawer-header-content"]')).toHaveTextContent("Order");
      const slot = header.querySelector('[data-slot="drawer-header-actions"]')!;
      const close = slot.querySelector('[data-slot="drawer-close"]')!;
      expect(close).toHaveAttribute("accessibilityLabel", "Close");
      fireEvent.click(close);
      expect(onOpenChange).toHaveBeenLastCalledWith(false, { reason: "close-press" });
    });

    it("puts header actions before the close button, or hides the close button", () => {
      mockViewport(true);
      const { rerender } = render(
        <Drawer defaultOpen>
          <Drawer.Content>
            <Drawer.Header mobileAlign="center" actions={<button type="button">Edit</button>}>
              <Drawer.Title>Order</Drawer.Title>
            </Drawer.Header>
          </Drawer.Content>
        </Drawer>,
      );

      const header = document.querySelector('[data-slot="drawer-header"]')!;
      expect(header).toHaveAttribute("data-mobile-align", "center");
      const slot = header.querySelector('[data-slot="drawer-header-actions"]')!;
      expect(slot.firstElementChild).toHaveTextContent("Edit");
      expect(slot.lastElementChild).toHaveAttribute("data-slot", "drawer-close");

      rerender(
        <Drawer defaultOpen>
          <Drawer.Content>
            <Drawer.Header close={false}>
              <Drawer.Title>Order</Drawer.Title>
            </Drawer.Header>
          </Drawer.Content>
        </Drawer>,
      );
      expect(document.querySelector('[data-slot="drawer-header-actions"]')).toBeNull();
    });

    it("renders a pre-footer above the footer, scrolling unless sticky", () => {
      mockViewport(false);
      render(
        <Drawer defaultOpen>
          <Drawer.Content>
            <Drawer.Header separator="divider">
              <Drawer.Title>Cart</Drawer.Title>
            </Drawer.Header>
            <Drawer.Body>Items</Drawer.Body>
            <Drawer.PreFooter>Subtotal</Drawer.PreFooter>
            <Drawer.PreFooter sticky separator="shadow">
              Total
            </Drawer.PreFooter>
            <Drawer.Footer separator="shadow">Checkout</Drawer.Footer>
          </Drawer.Content>
        </Drawer>,
      );

      const header = document.querySelector('[data-slot="drawer-header"]');
      const [plain, sticky] = document.querySelectorAll('[data-slot="drawer-pre-footer"]');
      const footer = document.querySelector('[data-slot="drawer-footer"]');
      expect(header).toHaveAttribute("data-separator", "divider");
      expect(plain).not.toHaveAttribute("data-sticky");
      expect(plain).not.toHaveAttribute("data-separator");
      expect(sticky).toHaveAttribute("data-sticky");
      expect(sticky).toHaveAttribute("data-separator", "shadow");
      expect(footer).toHaveAttribute("data-separator", "shadow");
      expect(sticky!.nextElementSibling).toBe(footer);
    });

    it("flags scroll overflow on the panel for the shadow separators", () => {
      mockViewport(false);
      vi.spyOn(HTMLElement.prototype, "scrollHeight", "get").mockReturnValue(1000);
      vi.spyOn(HTMLElement.prototype, "clientHeight", "get").mockReturnValue(400);
      render(
        <Drawer defaultOpen>
          <Drawer.Content>
            <Drawer.Header separator="shadow">
              <Drawer.Title>Long</Drawer.Title>
            </Drawer.Header>
            <Drawer.Body>Content</Drawer.Body>
          </Drawer.Content>
        </Drawer>,
      );

      const content = document.querySelector<HTMLElement>('[data-slot="drawer-content"]')!;
      expect(content).not.toHaveAttribute("data-overflow-top");
      expect(content).toHaveAttribute("data-overflow-bottom");

      content.scrollTop = 600;
      fireEvent.scroll(content);
      expect(content).toHaveAttribute("data-overflow-top");
      expect(content).not.toHaveAttribute("data-overflow-bottom");
    });
  });
});

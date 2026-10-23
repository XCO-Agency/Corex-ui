import { afterEach, describe, expect, it, vi } from "vitest";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { Drawer, resolveDrawerWidth, useDrawer } from "./Drawer";
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

  it("throws when useDrawer is called outside of Drawer", () => {
    const Probe = () => {
      useDrawer();
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
});

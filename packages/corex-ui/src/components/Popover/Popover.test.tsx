import { describe, expect, it, vi } from "vitest";
import { act, render } from "@testing-library/react";
import { Popover, usePopover } from "./Popover";
import { Button } from "../Button";
import { renderAndHydrate } from "../../test-utils/ssr";

describe("Popover", () => {
  it("renders compound Popover.Trigger and Popover.Content bound together", () => {
    render(
      <Popover>
        <Popover.Trigger>
          <Button icon="menu-horizontal">Options</Button>
        </Popover.Trigger>
        <Popover.Content>
          <div>Popover Body</div>
        </Popover.Content>
      </Popover>,
    );

    const triggerEl = document.querySelector("s-button");
    const popoverEl = document.querySelector("s-popover");

    expect(triggerEl).toBeInTheDocument();
    expect(popoverEl).toBeInTheDocument();

    const popoverId = popoverEl?.getAttribute("id");
    expect(popoverId).toBeTruthy();
    expect(triggerEl).toHaveAttribute("commandfor", popoverId);
  });

  it("uses provided id when specified", () => {
    render(
      <Popover id="custom-popover-id">
        <Popover.Trigger>
          <Button>Click</Button>
        </Popover.Trigger>
        <Popover.Content>
          <div>Custom content</div>
        </Popover.Content>
      </Popover>,
    );

    const triggerEl = document.querySelector("s-button");
    const popoverEl = document.querySelector("s-popover");

    expect(popoverEl).toHaveAttribute("id", "custom-popover-id");
    expect(triggerEl).toHaveAttribute("commandfor", "custom-popover-id");
  });

  it("throws when usePopover is called outside of Popover provider", () => {
    const TestComponent = () => {
      usePopover();
      return null;
    };

    expect(() => render(<TestComponent />)).toThrow(
      "Popover compound components must be used within a <Popover />",
    );
  });

  it("provides close action via usePopover that triggers hideOverlay on s-popover", () => {
    let capturedClose: (() => void) | null = null;

    const Child = () => {
      const { close } = usePopover();
      capturedClose = close;
      return <button onClick={close}>Close Popover</button>;
    };

    render(
      <Popover id="test-popover">
        <Popover.Trigger>
          <Button>Toggle</Button>
        </Popover.Trigger>
        <Popover.Content>
          <Child />
        </Popover.Content>
      </Popover>,
    );

    const popoverEl = document.querySelector("s-popover") as HTMLElement;
    expect(popoverEl).toBeInTheDocument();

    const hideOverlaySpy = vi.spyOn(popoverEl as any, "hideOverlay");

    expect(capturedClose).toBeTypeOf("function");
    capturedClose!();

    expect(hideOverlaySpy).toHaveBeenCalledTimes(1);
  });

  /*
   * `typeof el.hidePopover === "function"` is true on every HTMLElement in a
   * supporting browser, so it never meant "this element is a popover".
   * Calling it on one that is not throws NotSupportedError, which is what
   * SHOPIFY-APPS-3G was: 11 events over two users from Product Maestro's
   * `/app/schedules/products`.
   */
  it("does not call hidePopover on an element that is not a popover", () => {
    let capturedClose: (() => void) | null = null;

    const Child = () => {
      const { close } = usePopover();
      capturedClose = close;
      return <button onClick={close}>Close Popover</button>;
    };

    render(
      <Popover id="not-a-popover">
        <Popover.Trigger>
          <Button>Toggle</Button>
        </Popover.Trigger>
        <Popover.Content>
          <Child />
        </Popover.Content>
      </Popover>,
    );

    const popoverEl = document.querySelector("s-popover") as HTMLElement;
    // The stub defines hideOverlay on its PROTOTYPE, so `delete` on the
    // instance leaves it in place and close() never reaches hidePopover.
    // Shadowing it with undefined is what makes the fall-through happen.
    Object.defineProperty(popoverEl, "hideOverlay", {
      value: undefined,
      configurable: true,
    });
    popoverEl.removeAttribute("popover");
    const hidePopoverSpy = vi
      .spyOn(popoverEl as any, "hidePopover")
      .mockImplementation(() => {
        throw new DOMException(
          "Failed to execute 'hidePopover' on 'HTMLElement': Not supported on elements that are not popovers.",
          "NotSupportedError",
        );
      });

    expect(() => capturedClose!()).not.toThrow();
    expect(hidePopoverSpy).not.toHaveBeenCalled();
  });

  it("swallows a hidePopover that throws mid-call, as beforetoggle can cause", () => {
    let capturedClose: (() => void) | null = null;

    const Child = () => {
      const { close } = usePopover();
      capturedClose = close;
      return <button onClick={close}>Close Popover</button>;
    };

    render(
      <Popover id="racing-popover">
        <Popover.Trigger>
          <Button>Toggle</Button>
        </Popover.Trigger>
        <Popover.Content>
          <Child />
        </Popover.Content>
      </Popover>,
    );

    const popoverEl = document.querySelector("s-popover") as HTMLElement;
    Object.defineProperty(popoverEl, "hideOverlay", {
      value: undefined,
      configurable: true,
    });
    // The attribute is present, so the guard lets the call through; the
    // platform still throws because the state changed underneath it.
    popoverEl.setAttribute("popover", "auto");
    vi.spyOn(popoverEl as any, "hidePopover").mockImplementation(() => {
      throw new DOMException("state changed", "NotSupportedError");
    });

    expect(() => capturedClose!()).not.toThrow();
  });

  it("applies fitTrigger to set inlineSize matching trigger width", () => {
    // Mock getBoundingClientRect in JSDOM
    const originalGetBoundingClientRect = HTMLElement.prototype.getBoundingClientRect;
    HTMLElement.prototype.getBoundingClientRect = vi.fn(function (this: HTMLElement) {
      if (this.tagName.toLowerCase() === "s-button") {
        return {
          width: 320,
          height: 36,
          top: 0,
          left: 0,
          bottom: 36,
          right: 320,
          x: 0,
          y: 0,
          toJSON: () => {},
        };
      }
      return originalGetBoundingClientRect.call(this);
    });

    try {
      render(
        <Popover>
          <Popover.Trigger>
            <Button>Dynamic Trigger</Button>
          </Popover.Trigger>
          <Popover.Content fitTrigger>
            <div>Content</div>
          </Popover.Content>
        </Popover>,
      );

      const popoverEl = document.querySelector("s-popover");
      expect(popoverEl).toBeInTheDocument();
      expect(popoverEl).toHaveAttribute("inlinesize", "320px");
    } finally {
      HTMLElement.prototype.getBoundingClientRect = originalGetBoundingClientRect;
    }
  });

  it("exposes triggerWidth and triggerRef via usePopover", () => {
    let capturedWidth: number | undefined;
    let capturedRef: any = null;

    const originalGetBoundingClientRect = HTMLElement.prototype.getBoundingClientRect;
    HTMLElement.prototype.getBoundingClientRect = vi.fn(function (this: HTMLElement) {
      if (this.tagName.toLowerCase() === "s-button") {
        return {
          width: 240,
          height: 36,
          top: 0,
          left: 0,
          bottom: 36,
          right: 240,
          x: 0,
          y: 0,
          toJSON: () => {},
        };
      }
      return originalGetBoundingClientRect.call(this);
    });

    const Child = () => {
      const { triggerWidth, triggerRef } = usePopover();
      capturedWidth = triggerWidth;
      capturedRef = triggerRef;
      return <div>Popover with Trigger Context</div>;
    };

    try {
      render(
        <Popover>
          <Popover.Trigger>
            <Button>Trigger</Button>
          </Popover.Trigger>
          <Popover.Content>
            <Child />
          </Popover.Content>
        </Popover>,
      );

      expect(capturedWidth).toBe(240);
      expect(capturedRef?.current).toBeInstanceOf(HTMLElement);
    } finally {
      HTMLElement.prototype.getBoundingClientRect = originalGetBoundingClientRect;
    }
  });

  describe("controlled mode", () => {
    function ControlledPopover({
      active,
      onClose,
    }: {
      active?: boolean;
      onClose?: () => void;
    }) {
      return (
        <Popover active={active} onClose={onClose}>
          <Popover.Trigger>
            <Button>Options</Button>
          </Popover.Trigger>
          <Popover.Content>
            <div>Body</div>
          </Popover.Content>
        </Popover>
      );
    }

    it("opens and closes the overlay from `active`", () => {
      const { rerender } = render(<ControlledPopover active={false} />);
      const popoverEl = document.querySelector("s-popover")!;

      expect(popoverEl).not.toHaveAttribute("data-stub-open");

      rerender(<ControlledPopover active />);
      expect(popoverEl).toHaveAttribute("data-stub-open", "true");

      rerender(<ControlledPopover active={false} />);
      expect(popoverEl).not.toHaveAttribute("data-stub-open");
    });

    it("leaves the native invoker in charge when `active` is not passed", () => {
      render(
        <Popover>
          <Popover.Trigger>
            <Button>Options</Button>
          </Popover.Trigger>
          <Popover.Content>
            <div>Body</div>
          </Popover.Content>
        </Popover>,
      );

      expect(document.querySelector("s-popover")).not.toHaveAttribute("data-stub-open");
    });

    it("calls onClose when the overlay hides, however it was closed", () => {
      const onClose = vi.fn();
      render(<ControlledPopover active onClose={onClose} />);

      const popoverEl = document.querySelector("s-popover") as unknown as HTMLElement & {
        hideOverlay: () => void;
      };
      popoverEl.hideOverlay();

      expect(onClose).toHaveBeenCalledTimes(1);
    });
  });

  describe("server rendering", () => {
    function SsrPopover(props: {
      onShow?: (event?: Event) => void;
      onToggle?: (event?: Event) => void;
      onHide?: (event?: Event) => void;
      onAfterShow?: (event?: Event) => void;
    }) {
      return (
        <Popover id="ssr-popover">
          <Popover.Trigger>
            <Button>Options</Button>
          </Popover.Trigger>
          <Popover.Content fitTrigger {...props}>
            <div>Body</div>
          </Popover.Content>
        </Popover>
      );
    }

    it("hydrates PopoverContent event props without a mismatch or attribute", () => {
      const handlers = {
        onShow: vi.fn(),
        onToggle: vi.fn(),
        onHide: vi.fn(),
        onAfterShow: vi.fn(),
      };
      const { container, messages, unmount } = renderAndHydrate(
        <SsrPopover {...handlers} />,
      );

      expect(messages).toEqual([]);

      const popoverEl = container.querySelector("s-popover") as HTMLElement;
      for (const attr of ["onshow", "ontoggle", "onhide", "onaftershow"]) {
        expect(popoverEl).not.toHaveAttribute(attr);
      }

      act(() => {
        popoverEl.dispatchEvent(new Event("show"));
        popoverEl.dispatchEvent(new Event("toggle"));
        popoverEl.dispatchEvent(new Event("hide"));
        popoverEl.dispatchEvent(new Event("aftershow"));
      });
      expect(handlers.onShow).toHaveBeenCalledTimes(1);
      expect(handlers.onToggle).toHaveBeenCalledTimes(1);
      expect(handlers.onHide).toHaveBeenCalledTimes(1);
      expect(handlers.onAfterShow).toHaveBeenCalledTimes(1);

      unmount();
    });

    it("still runs internal show handling when no onShow is passed", () => {
      const { container, messages, unmount } = renderAndHydrate(<SsrPopover />);
      expect(messages).toEqual([]);

      const popoverEl = container.querySelector("s-popover") as HTMLElement;
      expect(() =>
        act(() => {
          popoverEl.dispatchEvent(new Event("show"));
        }),
      ).not.toThrow();

      unmount();
    });
  });
});

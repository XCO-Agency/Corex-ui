import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { FlexPopover } from "./FlexPopover";
import { Text } from "../Text";
import { Button } from "../Button";

/** jsdom's PointerEvent drops clientX; a MouseEvent of the same type keeps the coordinates. */
function dispatchPointer(
  target: EventTarget,
  type: "pointerenter" | "pointerleave" | "pointermove",
  x: number,
  y: number,
) {
  target.dispatchEvent(new MouseEvent(type, { bubbles: true, clientX: x, clientY: y }));
}

function box(top: number, left: number, width: number, height: number): DOMRect {
  return {
    x: left,
    y: top,
    top,
    left,
    width,
    height,
    right: left + width,
    bottom: top + height,
    toJSON() {
      return {};
    },
  } as DOMRect;
}

describe("FlexPopover", () => {
  it("renders default heading 'Filters' and default close button accessibility label", () => {
    const onClose = vi.fn();
    render(
      <FlexPopover isOpen onClose={onClose}>
        <Text>Content</Text>
      </FlexPopover>,
    );

    expect(screen.getByText("Filters")).toBeInTheDocument();
    expect(screen.getByText("Content")).toBeInTheDocument();

    const closeBtn = document.querySelector(
      '[accessibilitylabel="Close filters popup"]',
    );
    expect(closeBtn).toBeInTheDocument();

    fireEvent.click(closeBtn!);
    expect(onClose).toHaveBeenCalled();
  });

  it("renders custom string heading and derives close button accessibility label", () => {
    const onClose = vi.fn();
    render(
      <FlexPopover isOpen onClose={onClose} heading="Categories">
        <Text>Content</Text>
      </FlexPopover>,
    );

    expect(screen.getByText("Categories")).toBeInTheDocument();
    const closeBtn = document.querySelector('[accessibilitylabel="Close popup"]');
    expect(closeBtn).toBeInTheDocument();
  });

  it("renders custom ReactNode heading and supports custom closeAccessibilityLabel", () => {
    const onClose = vi.fn();
    render(
      <FlexPopover
        isOpen
        onClose={onClose}
        heading={<span>Custom Node Header</span>}
        closeAccessibilityLabel="Dismiss modal"
      >
        <Text>Content</Text>
      </FlexPopover>,
    );

    expect(screen.getByText("Custom Node Header")).toBeInTheDocument();
    const closeBtn = document.querySelector('[accessibilitylabel="Dismiss modal"]');
    expect(closeBtn).toBeInTheDocument();
  });

  it("omits the header when noHeader is true", () => {
    render(
      <FlexPopover isOpen onClose={vi.fn()} noHeader heading="Ignored Header">
        <Text>Content Only</Text>
      </FlexPopover>,
    );

    expect(screen.queryByText("Ignored Header")).toBeNull();
    expect(screen.getByText("Content Only")).toBeInTheDocument();
  });

  it("calls showPopover on initial mount when isOpen is true and showPopover is supported", () => {
    const showPopoverMock = vi.fn();
    const hidePopoverMock = vi.fn();
    // Simulate browser Popover API support
    (HTMLElement.prototype as any).showPopover = showPopoverMock;
    (HTMLElement.prototype as any).hidePopover = hidePopoverMock;

    try {
      render(
        <div>
          <button id="test-anchor">Anchor</button>
          <FlexPopover isOpen anchorId="test-anchor" onClose={vi.fn()}>
            <Text>Dynamic Popover Content</Text>
          </FlexPopover>
        </div>,
      );

      expect(showPopoverMock).toHaveBeenCalled();
    } finally {
      delete (HTMLElement.prototype as any).showPopover;
      delete (HTMLElement.prototype as any).hidePopover;
    }
  });

  it("places the popover on the requested side of the anchor", () => {
    const real = HTMLElement.prototype.getBoundingClientRect;
    HTMLElement.prototype.getBoundingClientRect = function () {
      if (this.id === "placed-anchor") return box(200, 100, 80, 40);
      if (this.classList?.contains("corex-native-popover")) return box(0, 0, 120, 80);
      return real.call(this);
    };

    try {
      render(
        <div>
          <button id="placed-anchor">Anchor</button>
          <FlexPopover isOpen anchorId="placed-anchor" onClose={vi.fn()} position="top-start">
            <Text>Placed</Text>
          </FlexPopover>
        </div>,
      );

      const dialog = screen.getByRole("dialog");
      expect(dialog.style.top).toBe("112px");
      expect(dialog.style.left).toBe("100px");
    } finally {
      HTMLElement.prototype.getBoundingClientRect = real;
    }
  });

  it("places against the shadow control when the host box is empty", () => {
    const real = HTMLElement.prototype.getBoundingClientRect;
    HTMLElement.prototype.getBoundingClientRect = function () {
      if (this.id === "shadow-host") return box(0, 0, 0, 0);
      if (this.id === "shadow-button") return box(200, 100, 80, 40);
      if (this.classList?.contains("corex-native-popover")) return box(0, 0, 120, 80);
      return real.call(this);
    };

    const host = document.createElement("div");
    host.id = "shadow-host";
    const button = document.createElement("button");
    button.id = "shadow-button";
    host.attachShadow({ mode: "open" }).appendChild(button);
    document.body.appendChild(host);

    try {
      render(
        <FlexPopover isOpen anchorId="shadow-host" onClose={vi.fn()} position="top-start">
          <Text>Placed</Text>
        </FlexPopover>,
      );

      const dialog = screen.getByRole("dialog");
      expect(dialog.style.top).toBe("112px");
      expect(dialog.style.left).toBe("100px");
    } finally {
      HTMLElement.prototype.getBoundingClientRect = real;
      host.remove();
    }
  });
});

describe("FlexPopover hover", () => {
  const realRect = HTMLElement.prototype.getBoundingClientRect;

  beforeEach(() => {
    vi.useFakeTimers({ toFake: ["setTimeout", "clearTimeout"] });
    window.matchMedia = vi.fn().mockImplementation((query: string) => ({
      matches: query === "(hover: hover)",
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })) as unknown as typeof window.matchMedia;

    HTMLElement.prototype.getBoundingClientRect = function () {
      if (this.id === "hover-anchor") return box(100, 100, 80, 32);
      if (this.classList?.contains("corex-native-popover")) return box(140, 100, 180, 160);
      return realRect.call(this);
    };
  });

  afterEach(() => {
    vi.useRealTimers();
    HTMLElement.prototype.getBoundingClientRect = realRect;
  });

  it("opens when the pointer enters the anchor", () => {
    const onOpen = vi.fn();
    render(
      <div>
        <button id="hover-anchor">Anchor</button>
        <FlexPopover
          isOpen={false}
          anchorId="hover-anchor"
          openOnHover
          onOpen={onOpen}
          onClose={vi.fn()}
        >
          <Text>Hover content</Text>
        </FlexPopover>
      </div>,
    );

    dispatchPointer(document.getElementById("hover-anchor")!, "pointerenter", 120, 110);
    expect(onOpen).toHaveBeenCalledTimes(1);
  });

  it("waits out closeDelay after the pointer leaves", () => {
    const onClose = vi.fn();
    render(
      <div>
        <button id="hover-anchor">Anchor</button>
        <FlexPopover
          isOpen
          anchorId="hover-anchor"
          openOnHover
          closeDelay={150}
          onOpen={vi.fn()}
          onClose={onClose}
        >
          <Text>Hover content</Text>
        </FlexPopover>
      </div>,
    );

    dispatchPointer(document.getElementById("hover-anchor")!, "pointerleave", 400, 400);
    expect(onClose).not.toHaveBeenCalled();

    act(() => {
      vi.advanceTimersByTime(149);
    });
    expect(onClose).not.toHaveBeenCalled();

    act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("keeps the popover open while the pointer crosses the offset gap", () => {
    const onClose = vi.fn();
    render(
      <div>
        <button id="hover-anchor">Anchor</button>
        <FlexPopover
          isOpen
          anchorId="hover-anchor"
          openOnHover
          closeDelay={150}
          onOpen={vi.fn()}
          onClose={onClose}
        >
          <Text>Hover content</Text>
        </FlexPopover>
      </div>,
    );

    dispatchPointer(document.getElementById("hover-anchor")!, "pointerleave", 140, 136);
    act(() => {
      vi.advanceTimersByTime(500);
    });
    expect(onClose).not.toHaveBeenCalled();

    dispatchPointer(window, "pointermove", 400, 400);
    act(() => {
      vi.advanceTimersByTime(149);
    });
    expect(onClose).not.toHaveBeenCalled();
    act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("cancels the scheduled close when the pointer enters the popover", () => {
    const onClose = vi.fn();
    render(
      <div>
        <button id="hover-anchor">Anchor</button>
        <FlexPopover
          isOpen
          anchorId="hover-anchor"
          openOnHover
          closeDelay={150}
          onOpen={vi.fn()}
          onClose={onClose}
        >
          <Text>Hover content</Text>
        </FlexPopover>
      </div>,
    );

    dispatchPointer(document.getElementById("hover-anchor")!, "pointerleave", 400, 400);
    dispatchPointer(screen.getByRole("dialog"), "pointerenter", 160, 180);
    act(() => {
      vi.advanceTimersByTime(500);
    });
    expect(onClose).not.toHaveBeenCalled();
  });
});

describe("FlexPopover compound API", () => {
  it("toggles on trigger click without any ref", () => {
    render(
      <FlexPopover>
        <FlexPopover.Trigger>
          <Button>Open</Button>
        </FlexPopover.Trigger>
        <FlexPopover.Content heading="Details">
          <Text>Body</Text>
        </FlexPopover.Content>
      </FlexPopover>,
    );
    expect(screen.queryByText("Body")).not.toBeInTheDocument();

    fireEvent.click(screen.getByText("Open"));
    expect(screen.getByText("Body")).toBeInTheDocument();
    expect(screen.getByText("Details")).toBeInTheDocument();

    fireEvent.click(screen.getByText("Open"));
    expect(screen.queryByText("Body")).not.toBeInTheDocument();
  });

  it("supports defaultOpen and the close button", () => {
    render(
      <FlexPopover defaultOpen>
        <FlexPopover.Trigger>
          <Button>Open</Button>
        </FlexPopover.Trigger>
        <FlexPopover.Content>
          <Text>Body</Text>
        </FlexPopover.Content>
      </FlexPopover>,
    );
    expect(screen.getByText("Body")).toBeInTheDocument();
    fireEvent.click(document.querySelector('[accessibilitylabel="Close filters popup"]')!);
    expect(screen.queryByText("Body")).not.toBeInTheDocument();
  });

  it("stays controlled when isOpen is passed", () => {
    const onClose = vi.fn();
    const onOpen = vi.fn();
    render(
      <FlexPopover isOpen={false} onOpen={onOpen} onClose={onClose}>
        <FlexPopover.Trigger>
          <Button>Open</Button>
        </FlexPopover.Trigger>
        <FlexPopover.Content>
          <Text>Body</Text>
        </FlexPopover.Content>
      </FlexPopover>,
    );
    fireEvent.click(screen.getByText("Open"));
    expect(onOpen).toHaveBeenCalledTimes(1);
    expect(screen.queryByText("Body")).not.toBeInTheDocument();
  });

  it("opens on hover with openOnHover, no ref needed", () => {
    vi.stubGlobal("matchMedia", () => ({ matches: true }));
    try {
      render(
        <FlexPopover openOnHover>
          <FlexPopover.Trigger>
            <Button>Hover me</Button>
          </FlexPopover.Trigger>
          <FlexPopover.Content>
            <Text>Body</Text>
          </FlexPopover.Content>
        </FlexPopover>,
      );
      const trigger = screen.getByText("Hover me").closest("span")!;
      act(() => {
        dispatchPointer(trigger, "pointerenter", 5, 5);
      });
      expect(screen.getByText("Body")).toBeInTheDocument();
    } finally {
      vi.unstubAllGlobals();
    }
  });

  it("calls Content onClose and closes the popover when close button is clicked", () => {
    const onContentClose = vi.fn();
    const onRootClose = vi.fn();
    render(
      <FlexPopover defaultOpen onClose={onRootClose}>
        <FlexPopover.Trigger>
          <Button>Toggle</Button>
        </FlexPopover.Trigger>
        <FlexPopover.Content heading="Panel" onClose={onContentClose}>
          <Text>Inner content</Text>
        </FlexPopover.Content>
      </FlexPopover>,
    );

    expect(screen.getByText("Inner content")).toBeInTheDocument();
    const closeBtn = document.querySelector('[accessibilitylabel="Close popup"]');
    expect(closeBtn).toBeInTheDocument();

    fireEvent.click(closeBtn!);
    expect(onContentClose).toHaveBeenCalledTimes(1);
    expect(onRootClose).toHaveBeenCalledTimes(1);
    expect(screen.queryByText("Inner content")).not.toBeInTheDocument();
  });

  it("throws a clear error when a part is used outside FlexPopover", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    expect(() => render(<FlexPopover.Trigger>x</FlexPopover.Trigger>)).toThrow(
      /inside <FlexPopover>/,
    );
    spy.mockRestore();
  });
});

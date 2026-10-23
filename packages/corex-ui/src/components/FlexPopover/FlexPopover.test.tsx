import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, fireEvent, render, screen, within } from "@testing-library/react";
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

/** Panel is portalled into an open shadow root — pierce it for queries. */
function popoverHosts(): HTMLElement[] {
  return Array.from(document.querySelectorAll<HTMLElement>("[data-corex-flex-popover-host]"));
}

function popoverShadow(host?: HTMLElement | null): ShadowRoot {
  const root = (host ?? popoverHosts()[0])?.shadowRoot;
  if (!root) throw new Error("FlexPopover shadow root missing");
  return root;
}

function popoverUi(host?: HTMLElement | null) {
  return within(popoverShadow(host) as unknown as HTMLElement);
}

function popoverDialog(host?: HTMLElement | null): HTMLElement {
  return popoverUi(host).getByRole("dialog");
}

function queryInPopovers(selector: string): Element | null {
  for (const host of popoverHosts()) {
    const found = host.shadowRoot?.querySelector(selector);
    if (found) return found;
  }
  return null;
}

describe("FlexPopover", () => {
  it("renders no header when no heading is passed", () => {
    render(
      <FlexPopover isOpen onClose={vi.fn()}>
        <Text>Content</Text>
      </FlexPopover>,
    );

    expect(popoverUi().getByText("Content")).toBeInTheDocument();
    expect(popoverUi().queryByText("Filters")).toBeNull();
    expect(queryInPopovers("[accessibilitylabel]")).toBeNull();
  });

  it("renders the heading and its close button when a heading is passed", () => {
    const onClose = vi.fn();
    render(
      <FlexPopover isOpen onClose={onClose} heading="Filters">
        <Text>Content</Text>
      </FlexPopover>,
    );

    expect(popoverUi().getByText("Filters")).toBeInTheDocument();
    const closeBtn = queryInPopovers('[accessibilitylabel="Close filters popup"]');
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

    expect(popoverUi().getByText("Categories")).toBeInTheDocument();
    const closeBtn = queryInPopovers('[accessibilitylabel="Close popup"]');
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

    expect(popoverUi().getByText("Custom Node Header")).toBeInTheDocument();
    const closeBtn = queryInPopovers('[accessibilitylabel="Dismiss modal"]');
    expect(closeBtn).toBeInTheDocument();
  });

  it("omits the header when noHeader is true", () => {
    render(
      <FlexPopover isOpen onClose={vi.fn()} noHeader heading="Ignored Header">
        <Text>Content Only</Text>
      </FlexPopover>,
    );

    expect(popoverUi().queryByText("Ignored Header")).toBeNull();
    expect(popoverUi().getByText("Content Only")).toBeInTheDocument();
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

      const dialog = popoverDialog();
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

      const dialog = popoverDialog();
      expect(dialog.style.top).toBe("112px");
      expect(dialog.style.left).toBe("100px");
    } finally {
      HTMLElement.prototype.getBoundingClientRect = real;
      host.remove();
    }
  });

  it("keeps open-animation styles inside a shadow root", () => {
    render(
      <FlexPopover isOpen onClose={vi.fn()}>
        <Text>Isolated</Text>
      </FlexPopover>,
    );

    const host = popoverHosts()[0];
    expect(host).toBeTruthy();
    expect(host.shadowRoot).toBeTruthy();
    expect(host.shadowRoot!.querySelector("style[data-corex-flex-popover]")).toBeTruthy();
    expect(document.querySelector(".corex-native-popover")).toBeNull();
    expect(host.shadowRoot!.querySelector(".corex-native-popover")).toBeTruthy();
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
    dispatchPointer(popoverDialog(), "pointerenter", 160, 180);
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
    expect(popoverUi().queryByText("Body")).toBeNull();

    fireEvent.click(screen.getByText("Open"));
    expect(popoverUi().getByText("Body")).toBeInTheDocument();
    expect(popoverUi().getByText("Details")).toBeInTheDocument();

    fireEvent.click(screen.getByText("Open"));
    expect(popoverUi().queryByText("Body")).toBeNull();
  });

  it("supports defaultOpen and the close button", () => {
    render(
      <FlexPopover defaultOpen>
        <FlexPopover.Trigger>
          <Button>Open</Button>
        </FlexPopover.Trigger>
        <FlexPopover.Content heading="Filters">
          <Text>Body</Text>
        </FlexPopover.Content>
      </FlexPopover>,
    );
    expect(popoverUi().getByText("Body")).toBeInTheDocument();
    fireEvent.click(queryInPopovers('[accessibilitylabel="Close filters popup"]')!);
    expect(popoverUi().queryByText("Body")).toBeNull();
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
    expect(popoverUi().queryByText("Body")).toBeNull();
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
      expect(popoverUi().getByText("Body")).toBeInTheDocument();
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

    expect(popoverUi().getByText("Inner content")).toBeInTheDocument();
    const closeBtn = queryInPopovers('[accessibilitylabel="Close popup"]');
    expect(closeBtn).toBeInTheDocument();

    fireEvent.click(closeBtn!);
    expect(onContentClose).toHaveBeenCalledTimes(1);
    expect(onRootClose).toHaveBeenCalledTimes(1);
    expect(popoverUi().queryByText("Inner content")).toBeNull();
  });

  it("throws a clear error when a part is used outside FlexPopover", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    expect(() => render(<FlexPopover.Trigger>x</FlexPopover.Trigger>)).toThrow(
      /inside <FlexPopover>/,
    );
    spy.mockRestore();
  });
});

describe("FlexPopover padding", () => {
  const bodyPadding = (padding?: string) => {
    const { unmount } = render(
      <FlexPopover isOpen onClose={vi.fn()} {...(padding ? { padding: padding as never } : {})}>
        <Text>Padded</Text>
      </FlexPopover>,
    );
    const body = popoverUi()
      .getByText("Padded")
      .closest("[style*='padding']") as HTMLElement | null;
    const value = body?.style.padding ?? null;
    unmount();
    return value;
  };

  it("pads the content with `small-200` by default and honours each size", () => {
    expect(bodyPadding()).toContain("--p-space-200");
    expect(bodyPadding("small-200")).toBe(bodyPadding());
    expect(bodyPadding("small")).toContain("--p-space-300");
    expect(bodyPadding("none")).toBe("0px");
    expect(bodyPadding("base")).toContain("--p-space-400");
    expect(bodyPadding("large")).toContain("--p-space-500");
    expect(bodyPadding("small-200")).toContain("--p-space-200");
  });
});

describe("FlexPopover nested popovers", () => {
  beforeEach(() => {
    vi.useFakeTimers({ toFake: ["setTimeout", "clearTimeout"] });
    window.matchMedia = vi.fn().mockImplementation((query: string) => ({
      matches: query === "(hover: hover)",
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })) as unknown as typeof window.matchMedia;
  });
  afterEach(() => vi.useRealTimers());

  const renderNested = () =>
    render(
      <FlexPopover openOnHover defaultOpen closeDelay={150}>
        <FlexPopover.Trigger>
          <Button>Root</Button>
        </FlexPopover.Trigger>
        <FlexPopover.Content>
          <Text>Parent body</Text>
          <FlexPopover openOnHover defaultOpen closeDelay={150}>
            <FlexPopover.Trigger>
              <Button>Row</Button>
            </FlexPopover.Trigger>
            <FlexPopover.Content>
              <Text>Child body</Text>
            </FlexPopover.Content>
          </FlexPopover>
        </FlexPopover.Content>
      </FlexPopover>,
    );
  const dialogOf = (text: string) => {
    for (const host of popoverHosts()) {
      const match = Array.from(
        host.shadowRoot?.querySelectorAll('[role="dialog"]') ?? [],
      ).find((dialog) => dialog.textContent?.includes(text));
      if (match) return match as HTMLElement;
    }
    throw new Error(`dialog containing "${text}" not found`);
  };

  it("keeps the parent open while the pointer is in the child popover", () => {
    renderNested();
    const child = dialogOf("Child body");

    // The pointer moves from the parent popover into the child, which is portalled outside it.
    dispatchPointer(child, "pointerenter", 500, 200);
    dispatchPointer(dialogOf("Parent body"), "pointerleave", 500, 200);
    act(() => {
      vi.advanceTimersByTime(500);
    });

    expect(popoverUi().getByText("Parent body")).toBeInTheDocument();
    expect(dialogOf("Child body").textContent).toContain("Child body");
  });

  it("closes the parent once the pointer has left both popovers", () => {
    renderNested();
    dispatchPointer(dialogOf("Child body"), "pointerenter", 500, 200);
    dispatchPointer(dialogOf("Parent body"), "pointerleave", 500, 200);
    act(() => {
      vi.advanceTimersByTime(500);
    });

    dispatchPointer(dialogOf("Child body"), "pointerleave", 900, 900);
    dispatchPointer(window as unknown as EventTarget, "pointermove", 900, 900);
    act(() => {
      vi.advanceTimersByTime(500);
    });

    expect(() => dialogOf("Parent body")).toThrow(/not found/);
  });

  it("does not dismiss the parent when the child is clicked", () => {
    const onClose = vi.fn();
    render(
      <FlexPopover defaultOpen onClose={onClose}>
        <FlexPopover.Trigger>
          <Button>Root</Button>
        </FlexPopover.Trigger>
        <FlexPopover.Content>
          <FlexPopover defaultOpen>
            <FlexPopover.Trigger>
              <Button>Row</Button>
            </FlexPopover.Trigger>
            <FlexPopover.Content>
              <Text>Child body</Text>
            </FlexPopover.Content>
          </FlexPopover>
        </FlexPopover.Content>
      </FlexPopover>,
    );
    act(() => {
      vi.advanceTimersByTime(20);
    });
    fireEvent.pointerDown(dialogOf("Child body"));
    expect(onClose).not.toHaveBeenCalled();
  });
});

describe("FlexPopover hover recovery", () => {
  beforeEach(() => {
    vi.useFakeTimers({ toFake: ["setTimeout", "clearTimeout"] });
    window.matchMedia = vi.fn().mockImplementation((query: string) => ({
      matches: query === "(hover: hover)",
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })) as unknown as typeof window.matchMedia;
  });
  afterEach(() => vi.useRealTimers());

  it("closes when the pointer is over something else, even if the leave event never fired", () => {
    const onClose = vi.fn();
    render(
      <div>
        <button id="row">Row</button>
        <button id="other">Other</button>
        <FlexPopover isOpen anchorId="row" openOnHover closeDelay={100} onClose={onClose}>
          <Text>Submenu</Text>
        </FlexPopover>
      </div>,
    );

    // Entered the row, then moved away with no pointerleave (a missed event).
    dispatchPointer(document.getElementById("row")!, "pointerenter", 10, 10);
    dispatchPointer(document.getElementById("other")!, "pointermove", 10, 200);
    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(onClose).toHaveBeenCalled();
  });
});

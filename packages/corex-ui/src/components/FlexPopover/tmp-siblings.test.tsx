import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, render, screen } from "@testing-library/react";
import { FlexPopover } from "./FlexPopover";
import { Text } from "../Text";
import { Button } from "../Button";

function ptr(target: EventTarget, type: string, x: number, y: number, related?: EventTarget) {
  target.dispatchEvent(
    new MouseEvent(type, { bubbles: true, clientX: x, clientY: y, relatedTarget: related as Node }),
  );
}
const box = (top: number, left: number, width: number, height: number) =>
  ({ x: left, y: top, top, left, width, height, right: left + width, bottom: top + height, toJSON() {} }) as DOMRect;

describe("siblings", () => {
  const real = HTMLElement.prototype.getBoundingClientRect;
  let hovered: Element | null = null;
  const realMatches = Element.prototype.matches;
  Element.prototype.matches = function (sel: string) {
    if (sel === ":hover") return !!hovered && (this === hovered || this.contains(hovered));
    return realMatches.call(this, sel);
  };
  beforeEach(() => {
    vi.useFakeTimers({ toFake: ["setTimeout", "clearTimeout"] });
    window.matchMedia = vi.fn().mockImplementation((q: string) => ({ matches: q === "(hover: hover)", media: q, addEventListener() {}, removeEventListener() {} })) as never;
    HTMLElement.prototype.getBoundingClientRect = function () {
      const t = this.textContent ?? "";
      if (this.tagName === "S-BUTTON" && t === "RowA") return box(100, 20, 200, 40);
      if (this.tagName === "S-BUTTON" && t === "RowB") return box(150, 20, 200, 40);
      if (this.classList?.contains("corex-native-popover")) return box(100, 320, 200, 120);
      return real.call(this);
    };
  });
  afterEach(() => { vi.useRealTimers(); HTMLElement.prototype.getBoundingClientRect = real; });

  it("closes A when moving to row B", () => {
    render(
      <FlexPopover openOnHover defaultOpen closeDelay={140}>
        <FlexPopover.Trigger><Button>Root</Button></FlexPopover.Trigger>
        <FlexPopover.Content>
          <FlexPopover openOnHover position="right-start" offset={4} closeDelay={140}>
            <FlexPopover.Trigger><Button>RowA</Button></FlexPopover.Trigger>
            <FlexPopover.Content offset={14}><Text>A body</Text></FlexPopover.Content>
          </FlexPopover>
          <FlexPopover openOnHover position="right-start" offset={4} closeDelay={140}>
            <FlexPopover.Trigger><Button>RowB</Button></FlexPopover.Trigger>
            <FlexPopover.Content offset={14}><Text>B body</Text></FlexPopover.Content>
          </FlexPopover>
        </FlexPopover.Content>
      </FlexPopover>,
    );
    const a = screen.getByText("RowA").closest("s-button")!;
    const b = screen.getByText("RowB").closest("s-button")!;
    act(() => { hovered = a; ptr(a, "pointerenter", 100, 120); });
    expect(screen.queryByText("A body")).toBeInTheDocument();
    act(() => { hovered = b; ptr(a, "pointerleave", 100, 145, b); ptr(b, "pointerenter", 100, 170); ptr(window, "pointermove", 100, 170); });
    console.log("after enter: A", !!screen.queryByText("A body"), "B", !!screen.queryByText("B body"));
    act(() => { vi.advanceTimersByTime(600); });
    console.log("rowA present:", !!screen.queryByText("RowA"), "A open:", !!screen.queryByText("A body"), "B open:", !!screen.queryByText("B body"));
    expect(screen.queryByText("A body")).not.toBeInTheDocument();
  });
});

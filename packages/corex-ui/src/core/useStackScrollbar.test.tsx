import { act, fireEvent, render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { BlockStack } from "../components/BlockStack/BlockStack";
import { InlineStack } from "../components/InlineStack/InlineStack";

describe("stack scrollbar", () => {
  it.each([
    ["InlineStack", InlineStack],
    ["BlockStack", BlockStack],
  ])("%s shows the thumb only while scrolling", (_, Stack) => {
    vi.useFakeTimers();
    const { container } = render(<Stack overflow="auto">x</Stack>);
    const el = container.firstElementChild!;
    expect(el).toHaveClass("cx-stack-scroll");
    expect(document.getElementById("cx-stack-scrollbar-styles")).not.toBeNull();
    fireEvent.scroll(el);
    expect(el).toHaveClass("cx-stack-scroll--scrolling");
    act(() => vi.advanceTimersByTime(800));
    expect(el).not.toHaveClass("cx-stack-scroll--scrolling");
    vi.useRealTimers();
  });

  it("hides the scrollbar with hideScrollbar", () => {
    const { container } = render(
      <BlockStack overflowY="scroll" hideScrollbar className="mine">x</BlockStack>,
    );
    expect(container.firstElementChild).toHaveClass("mine", "cx-stack-scroll--hidden");
  });

  it("leaves non-scrollable stacks untouched", () => {
    const { container } = render(<InlineStack hideScrollbar>x</InlineStack>);
    expect(container.firstElementChild).not.toHaveAttribute("class");
  });
});

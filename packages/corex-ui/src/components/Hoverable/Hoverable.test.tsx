import { act, fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Hoverable } from "./Hoverable";

const slotOf = (text: string) => screen.getByText(text).parentElement!;

function setup(props: Partial<Parameters<typeof Hoverable>[0]> = {}) {
  return render(
    <Hoverable {...props}>
      <section data-testid="card">
        <input aria-label="name" />
        <Hoverable.Show>
          <button>Edit</button>
        </Hoverable.Show>
        <Hoverable.Hide>
          <em>Idle</em>
        </Hoverable.Hide>
      </section>
    </Hoverable>,
  );
}

describe("Hoverable", () => {
  it("adds no layout box around the group or the slots", () => {
    const { container } = setup();
    expect(container.firstElementChild).toHaveClass("cx-hoverable");
    expect(slotOf("Edit")).toHaveClass("cx-hoverable-slot");
    expect(document.getElementById("cx-hoverable-styles")?.textContent).toContain(
      "display: contents",
    );
  });

  it("swaps Show and Hide on mouse over/out", () => {
    const onHoverChange = vi.fn();
    setup({ onHoverChange });
    expect(slotOf("Edit")).toHaveAttribute("data-visible", "false");
    expect(slotOf("Idle")).toHaveAttribute("data-visible", "true");

    fireEvent.mouseOver(screen.getByTestId("card"));
    expect(slotOf("Edit")).toHaveAttribute("data-visible", "true");
    expect(slotOf("Idle")).toHaveAttribute("data-visible", "false");

    // Moving between children of the group does not end the hover.
    fireEvent.mouseOut(screen.getByTestId("card"), {
      relatedTarget: screen.getByLabelText("name"),
    });
    expect(slotOf("Edit")).toHaveAttribute("data-visible", "true");

    fireEvent.mouseOut(screen.getByTestId("card"), { relatedTarget: document.body });
    expect(slotOf("Edit")).toHaveAttribute("data-visible", "false");
    expect(onHoverChange.mock.calls).toEqual([[true], [false]]);
  });

  it("treats focus inside the group as hover", () => {
    setup();
    fireEvent.focus(screen.getByLabelText("name"));
    expect(slotOf("Edit")).toHaveAttribute("data-visible", "true");
  });

  it("supports render-function children without slots", () => {
    render(<Hoverable>{({ hovered }) => <p>{hovered ? "on" : "off"}</p>}</Hoverable>);
    fireEvent.mouseOver(screen.getByText("off"));
    expect(screen.getByText("on")).toBeInTheDocument();
  });

  it("honours controlled, disabled and delays", () => {
    vi.useFakeTimers();
    const { rerender } = render(
      <Hoverable openDelay={200}>
        <Hoverable.Show keepSpace={false}>
          <b>X</b>
        </Hoverable.Show>
      </Hoverable>,
    );
    expect(slotOf("X")).toHaveAttribute("data-keep-space", "false");
    fireEvent.mouseOver(screen.getByText("X"));
    expect(slotOf("X")).toHaveAttribute("data-visible", "false");
    act(() => vi.advanceTimersByTime(200));
    expect(slotOf("X")).toHaveAttribute("data-visible", "true");
    vi.useRealTimers();

    rerender(
      <Hoverable hovered disabled>
        <Hoverable.Show>
          <b>X</b>
        </Hoverable.Show>
      </Hoverable>,
    );
    expect(slotOf("X")).toHaveAttribute("data-visible", "false");
  });
});

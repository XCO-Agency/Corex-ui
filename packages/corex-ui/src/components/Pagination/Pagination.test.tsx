import { describe, expect, it, vi } from "vitest";
import { fireEvent, render } from "@testing-library/react";
import { Pagination } from "./Pagination";

describe("Pagination", () => {
  it("disables the button for an edge with no page", () => {
    const { container } = render(<Pagination hasNext />);
    const [previous, next] = Array.from(container.querySelectorAll("s-button"));

    expect(previous).toHaveAttribute("disabled", "true");
    expect(next).not.toHaveAttribute("disabled", "true");
  });

  it("calls the handlers on click", () => {
    const onPrevious = vi.fn();
    const onNext = vi.fn();
    const { container } = render(
      <Pagination hasPrevious hasNext onPrevious={onPrevious} onNext={onNext} />,
    );
    const [previous, next] = Array.from(container.querySelectorAll("s-button"));

    fireEvent.click(previous!);
    fireEvent.click(next!);

    expect(onPrevious).toHaveBeenCalledTimes(1);
    expect(onNext).toHaveBeenCalledTimes(1);
  });

  it("names the buttons, and renders a label between them", () => {
    const { container } = render(
      <Pagination label="1 – 20 of 240" previousTooltip="Older" nextTooltip="Newer" />,
    );
    const [previous, next] = Array.from(container.querySelectorAll("s-button"));

    expect(previous).toHaveAttribute("accessibility-label", "Older");
    expect(next).toHaveAttribute("accessibility-label", "Newer");
    expect(container.querySelector("s-text")).toHaveTextContent("1 – 20 of 240");
  });
});

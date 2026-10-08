import { describe, expect, it, vi } from "vitest";
import { fireEvent, render } from "@testing-library/react";
import { Pagination } from "./Pagination";

describe("Pagination", () => {
  it("disables the button for an edge with no page", () => {
    const { container } = render(<Pagination hasNext />);
    const [previous, next] = Array.from(container.querySelectorAll("s-button"));

    expect(previous).toHaveAttribute("disabled", "true");
    expect(next).not.toHaveAttribute("disabled");
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

    expect(previous).toHaveAttribute("accessibilitylabel", "Older");
    expect(next).toHaveAttribute("accessibilitylabel", "Newer");
    expect(container.querySelector("s-text")).toHaveTextContent("1 – 20 of 240");
  });

  it("renders a floating pill with the label between the buttons", () => {
    const onNext = vi.fn();
    const { container, getByRole, getByText } = render(
      <Pagination floating hasNext onNext={onNext} label="1-50" />,
    );

    expect(getByRole("navigation")).toHaveStyle({ display: "inline-flex" });
    expect(getByText("1-50")).toBeInTheDocument();

    const [, next] = Array.from(container.querySelectorAll("s-button"));
    fireEvent.click(next!);
    expect(onNext).toHaveBeenCalledTimes(1);
  });
});

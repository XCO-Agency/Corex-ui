import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { createRef } from "react";
import { ProgressBar } from "./ProgressBar";

describe("ProgressBar", () => {
  it("renders s-progress with determinate value and max", () => {
    const { container } = render(
      <ProgressBar
        accessibilityLabel="Order fulfillment"
        value={3}
        max={5}
        tone="success"
      />,
    );
    const el = container.querySelector("s-progress");
    expect(el).toBeInTheDocument();
    expect(el).toHaveAttribute("accessibilitylabel", "Order fulfillment");
    expect(el).toHaveAttribute("value", "3");
    expect(el).toHaveAttribute("max", "5");
    expect(el).toHaveAttribute("tone", "success");
  });

  it("renders indeterminate progress bar when value is omitted", () => {
    const { container } = render(<ProgressBar accessibilityLabel="Importing products" />);
    const el = container.querySelector("s-progress");
    expect(el).toBeInTheDocument();
    expect(el).toHaveAttribute("accessibilitylabel", "Importing products");
    expect(el).not.toHaveAttribute("value");
  });

  it("applies tone correctly", () => {
    const { container, rerender } = render(
      <ProgressBar
        accessibilityLabel="Storage used"
        value={72}
        max={100}
        tone="caution"
      />,
    );
    let el = container.querySelector("s-progress");
    expect(el).toHaveAttribute("tone", "caution");

    rerender(
      <ProgressBar
        accessibilityLabel="API rate limit"
        value={96}
        max={100}
        tone="critical"
      />,
    );
    el = container.querySelector("s-progress");
    expect(el).toHaveAttribute("tone", "critical");
  });

  it("forwards ref to s-progress element", () => {
    const ref = createRef<HTMLElement>();
    render(<ProgressBar ref={ref} accessibilityLabel="Upload" value={50} max={100} />);
    expect(ref.current).toBeInstanceOf(HTMLElement);
    expect(ref.current?.tagName.toLowerCase()).toBe("s-progress");
  });
});

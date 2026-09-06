import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ProgressBar } from "./ProgressBar";

describe("ProgressBar", () => {
  it("renders with default progress and accessibility attributes", () => {
    render(<ProgressBar progress={45} aria-label="Loading progress" />);
    const bar = screen.getByRole("progressbar");
    expect(bar).toBeInTheDocument();
    expect(bar).toHaveAttribute("aria-valuenow", "45");
    expect(bar).toHaveAttribute("aria-valuemin", "0");
    expect(bar).toHaveAttribute("aria-valuemax", "100");
    expect(bar).toHaveAttribute("aria-label", "Loading progress");
  });

  it("clamps progress between 0 and 100", () => {
    const { rerender } = render(<ProgressBar progress={150} />);
    expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "100");

    rerender(<ProgressBar progress={-20} />);
    expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "0");

    rerender(<ProgressBar progress={NaN} />);
    expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "0");
  });

  it("applies tone styles and custom colors", () => {
    const { rerender } = render(<ProgressBar progress={50} tone="critical" />);
    const bar = screen.getByRole("progressbar");
    expect(bar.style.backgroundColor).toBe("rgb(254, 226, 226)"); // #fee2e2

    rerender(
      <ProgressBar
        progress={50}
        trackColor="#123456"
        barColor="#654321"
      />,
    );
    expect(bar.style.backgroundColor).toBe("rgb(18, 52, 86)");
  });
});

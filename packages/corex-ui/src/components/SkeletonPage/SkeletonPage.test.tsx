import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { SkeletonPage } from "./SkeletonPage";

describe("SkeletonPage", () => {
  it("draws a title placeholder by default", () => {
    const { container } = render(<SkeletonPage />);

    expect(container.querySelectorAll("[data-corex-skeleton]")).toHaveLength(1);
  });

  it("adds a placeholder action on request", () => {
    const { container } = render(<SkeletonPage primaryAction />);

    expect(container.querySelectorAll("[data-corex-skeleton]")).toHaveLength(2);
  });

  it("draws no title row when there is neither title nor action", () => {
    const { container } = render(<SkeletonPage title={false} />);

    expect(container.querySelectorAll("[data-corex-skeleton]")).toHaveLength(0);
  });

  it("renders a real title when given one", () => {
    render(<SkeletonPage title={<span>Orders</span>} />);

    expect(screen.getByText("Orders")).toBeInTheDocument();
  });

  it("renders its children below the title row", () => {
    render(
      <SkeletonPage title={false}>
        <span>Body placeholder</span>
      </SkeletonPage>,
    );

    expect(screen.getByText("Body placeholder")).toBeInTheDocument();
  });
});

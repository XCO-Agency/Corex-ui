import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { MetricCard } from "./MetricCard";

describe("MetricCard", () => {
  it("renders title, value, and tooltip", () => {
    render(
      <MetricCard
        id="test-metric"
        title="Total Sales"
        value="$12,345"
        tooltip="Gross sales over last 30 days"
      />
    );
    expect(screen.getByText("Total Sales")).toBeInTheDocument();
    expect(screen.getByText("$12,345")).toBeInTheDocument();
    expect(screen.getByText("Gross sales over last 30 days")).toBeInTheDocument();
  });

  it("renders sparkline with custom sparklineColor", () => {
    const { container } = render(
      <MetricCard
        id="test-sparkline"
        title="Orders"
        value="120"
        sparklineData={[10, 20, 15, 30]}
        sparklineColor="#ff0000"
      />
    );
    const path = container.querySelector("path[stroke='#ff0000']");
    expect(path).toBeInTheDocument();
  });

  it("resolves tone sparklineColor", () => {
    const { container } = render(
      <MetricCard
        id="test-tone"
        title="Orders"
        value="120"
        sparklineData={[10, 20, 15, 30]}
        sparklineColor="success"
      />
    );
    const path = container.querySelector("path[stroke='var(--p-color-text-success, #108043)']");
    expect(path).toBeInTheDocument();
  });
});

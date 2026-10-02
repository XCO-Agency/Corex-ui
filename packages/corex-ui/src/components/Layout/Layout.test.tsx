import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { Layout } from "./Layout";

describe("Layout", () => {
  it("renders a twelve-column grid of sections", () => {
    const { container } = render(
      <Layout>
        <Layout.Section variant="oneHalf">Left</Layout.Section>
        <Layout.Section variant="oneHalf">Right</Layout.Section>
      </Layout>,
    );

    const grid = container.querySelector("s-grid")!;
    expect(grid).toHaveAttribute("grid-template-columns", "1fr ".repeat(12).trim());
    expect(grid.querySelectorAll("s-grid-item")).toHaveLength(2);
  });

  it("spans a fraction at desktop widths", () => {
    const { container } = render(
      <Layout>
        <Layout.Section variant="oneThird">Side</Layout.Section>
      </Layout>,
    );

    expect(container.querySelector("s-grid-item")).toHaveAttribute(
      "grid-column",
      "span 4",
    );
  });

  it("gives a section with no variant the full width", () => {
    const { container } = render(
      <Layout>
        <Layout.Section>Only</Layout.Section>
      </Layout>,
    );

    expect(container.querySelector("s-grid-item")).toHaveAttribute(
      "grid-column",
      "span 12",
    );
  });

  it("accepts v12's boolean aliases", () => {
    const { container } = render(
      <Layout>
        <Layout.Section oneThird>Side</Layout.Section>
      </Layout>,
    );

    expect(container.querySelector("s-grid-item")).toHaveAttribute(
      "grid-column",
      "span 4",
    );
  });
});

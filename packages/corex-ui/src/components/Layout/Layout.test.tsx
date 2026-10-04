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

  it("auto-fills the remaining columns when paired with oneThird", () => {
    const { container } = render(
      <Layout>
        <Layout.Section variant="oneThird">Sidebar</Layout.Section>
        <Layout.Section>Main Content</Layout.Section>
      </Layout>,
    );

    const items = container.querySelectorAll("s-grid-item");
    expect(items).toHaveLength(2);
    expect(items[0]).toHaveAttribute("grid-column", "span 4");
    expect(items[1]).toHaveAttribute("grid-column", "span 8");
  });

  it("auto-fills the remaining columns when unvarianted section comes first", () => {
    const { container } = render(
      <Layout>
        <Layout.Section>Main Content</Layout.Section>
        <Layout.Section variant="oneThird">Sidebar</Layout.Section>
      </Layout>,
    );

    const items = container.querySelectorAll("s-grid-item");
    expect(items).toHaveLength(2);
    expect(items[0]).toHaveAttribute("grid-column", "span 8");
    expect(items[1]).toHaveAttribute("grid-column", "span 4");
  });

  it("auto-fills the remaining columns when paired with oneFourth", () => {
    const { container } = render(
      <Layout>
        <Layout.Section variant="oneFourth">Sidebar</Layout.Section>
        <Layout.Section>Main Content</Layout.Section>
      </Layout>,
    );

    const items = container.querySelectorAll("s-grid-item");
    expect(items).toHaveLength(2);
    expect(items[0]).toHaveAttribute("grid-column", "span 3");
    expect(items[1]).toHaveAttribute("grid-column", "span 9");
  });

  it("handles multi-row layouts with auto-fill sections and paired halves", () => {
    const { container } = render(
      <Layout>
        <Layout.Section variant="oneThird">Filters</Layout.Section>
        <Layout.Section>Results</Layout.Section>
        <Layout.Section variant="oneHalf">Half Left</Layout.Section>
        <Layout.Section variant="oneHalf">Half Right</Layout.Section>
      </Layout>,
    );

    const items = container.querySelectorAll("s-grid-item");
    expect(items).toHaveLength(4);
    // Row 1
    expect(items[0]).toHaveAttribute("grid-column", "span 4");
    expect(items[1]).toHaveAttribute("grid-column", "span 8");
    // Row 2
    expect(items[2]).toHaveAttribute("grid-column", "span 6");
    expect(items[3]).toHaveAttribute("grid-column", "span 6");
  });
});

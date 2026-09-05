import { createRef } from "react";
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { Grid, GridItem } from "./index";

describe("Grid", () => {
  it("renders an s-grid element with grid template columns and rows", () => {
    render(
      <Grid
        gridTemplateColumns="repeat(4, 1fr)"
        gridTemplateRows="auto 1fr"
        data-testid="grid-test"
      >
        <span>Content</span>
      </Grid>,
    );

    const el = screen.getByTestId("grid-test");
    expect(el.tagName.toLowerCase()).toBe("s-grid");
    expect(el).toHaveAttribute("grid-template-columns", "repeat(4, 1fr)");
    expect(el).toHaveAttribute("grid-template-rows", "auto 1fr");
  });

  it("maps numeric columns prop to repeat(N, minmax(0, 1fr))", () => {
    render(
      <Grid columns={3} data-testid="grid-columns">
        <span>Cols</span>
      </Grid>,
    );

    const el = screen.getByTestId("grid-columns");
    expect(el).toHaveAttribute("grid-template-columns", "repeat(3, minmax(0, 1fr))");
  });

  it("maps legacy gap, rowGap, and columnGap tokens to modern tokens", () => {
    render(
      <Grid gap="200" rowGap="400" columnGap="100" data-testid="grid-gaps">
        <span>Gaps</span>
      </Grid>,
    );

    const el = screen.getByTestId("grid-gaps");
    expect(el).toHaveAttribute("gap", "small-200");
    expect(el).toHaveAttribute("row-gap", "base");
    expect(el).toHaveAttribute("column-gap", "small-300");
  });

  it("forwards ref to the underlying s-grid element", () => {
    const ref = createRef<HTMLElement>();
    render(<Grid ref={ref}>Ref test</Grid>);

    expect(ref.current).not.toBeNull();
    expect(ref.current?.tagName.toLowerCase()).toBe("s-grid");
  });

  it("renders Grid.Item as s-grid-item with columnSpan mapped to span N", () => {
    render(
      <Grid>
        <Grid.Item columnSpan={2} rowSpan={3} data-testid="grid-item">
          Item Child
        </Grid.Item>
      </Grid>,
    );

    const item = screen.getByTestId("grid-item");
    expect(item.tagName.toLowerCase()).toBe("s-grid-item");
    expect(item).toHaveAttribute("grid-column", "span 2");
    expect(item).toHaveAttribute("grid-row", "span 3");
  });

  it("supports standalone GridItem and direct gridColumn/gridRow props", () => {
    render(
      <Grid>
        <GridItem gridColumn="1 / 3" gridRow="2 / 4" data-testid="standalone-item">
          Standalone Item
        </GridItem>
      </Grid>,
    );

    const item = screen.getByTestId("standalone-item");
    expect(item.tagName.toLowerCase()).toBe("s-grid-item");
    expect(item).toHaveAttribute("grid-column", "1 / 3");
    expect(item).toHaveAttribute("grid-row", "2 / 4");
  });

  it("forwards ref to the underlying s-grid-item element", () => {
    const itemRef = createRef<HTMLElement>();
    render(
      <Grid>
        <Grid.Item ref={itemRef}>Item Ref</Grid.Item>
      </Grid>,
    );

    expect(itemRef.current).not.toBeNull();
    expect(itemRef.current?.tagName.toLowerCase()).toBe("s-grid-item");
  });

  it("passes BoxElement properties such as padding and background", () => {
    render(
      <Grid padding="400" background="bg-surface" data-testid="grid-box">
        <Grid.Item padding="200" background="bg-surface-secondary" data-testid="item-box">
          Box props
        </Grid.Item>
      </Grid>,
    );

    const gridEl = screen.getByTestId("grid-box");
    expect(gridEl).toHaveAttribute("padding", "base");
    expect(gridEl).toHaveAttribute("background", "base");

    const itemEl = screen.getByTestId("item-box");
    expect(itemEl).toHaveAttribute("padding", "small-200");
    expect(itemEl).toHaveAttribute("background", "subdued");
  });
});

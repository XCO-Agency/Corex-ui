import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { InlineGrid } from "./InlineGrid";

describe("InlineGrid", () => {
  it("turns a column count into equal tracks", () => {
    const { container } = render(<InlineGrid columns={3}>cells</InlineGrid>);

    expect(container.querySelector("s-grid")).toHaveAttribute(
      "grid-template-columns",
      "1fr 1fr 1fr",
    );
  });

  it("keeps an explicit track list", () => {
    const { container } = render(<InlineGrid columns="1fr auto">cells</InlineGrid>);

    expect(container.querySelector("s-grid")).toHaveAttribute(
      "grid-template-columns",
      "1fr auto",
    );
  });

  it("translates v12's fraction names", () => {
    const { container } = render(
      <InlineGrid columns={["oneThird", "twoThirds"]}>cells</InlineGrid>,
    );

    expect(container.querySelector("s-grid")).toHaveAttribute(
      "grid-template-columns",
      "1fr 2fr",
    );
  });

  // jsdom reports a 1024px window, which is Polaris's `md`.
  it("resolves a per-breakpoint object at the current breakpoint", () => {
    const { container } = render(
      <InlineGrid columns={{ xs: 1, md: 2 }}>cells</InlineGrid>,
    );

    expect(container.querySelector("s-grid")).toHaveAttribute(
      "grid-template-columns",
      "1fr 1fr",
    );
  });

  it("cascades down to the nearest smaller breakpoint", () => {
    const { container } = render(
      <InlineGrid columns={{ xs: 1, lg: 4 }}>cells</InlineGrid>,
    );

    expect(container.querySelector("s-grid")).toHaveAttribute(
      "grid-template-columns",
      "1fr",
    );
  });
});

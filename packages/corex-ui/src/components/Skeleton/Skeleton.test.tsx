import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { Skeleton } from "./index";

describe("Skeleton", () => {
  it("renders with default shimmer animation and base border-radius", () => {
    const { container } = render(<Skeleton width={120} height={24} />);
    const el = container.querySelector("[data-corex-skeleton]");
    expect(el).not.toBeNull();
    expect(el).toHaveAttribute("aria-hidden", "true");
    expect(el?.getAttribute("style")).toContain("width: 120px");
    expect(el?.getAttribute("style")).toContain("height: 24px");
    expect(el?.getAttribute("style")).toContain(
      "border-radius: var(--p-border-radius-200, 8px)",
    );
    expect(el?.getAttribute("style")).toContain("animation: corex-skeleton-shimmer");
  });

  it("supports small, large, full, and none border-radius values", () => {
    const { container: cSmall } = render(<Skeleton borderRadius="small" />);
    expect(
      cSmall.querySelector("[data-corex-skeleton]")?.getAttribute("style"),
    ).toContain("border-radius: var(--p-border-radius-100, 4px)");

    const { container: cLarge } = render(<Skeleton borderRadius="large" />);
    expect(
      cLarge.querySelector("[data-corex-skeleton]")?.getAttribute("style"),
    ).toContain("border-radius: var(--p-border-radius-300, 12px)");

    const { container: cFull } = render(<Skeleton borderRadius="full" />);
    expect(
      cFull.querySelector("[data-corex-skeleton]")?.getAttribute("style"),
    ).toContain("border-radius: var(--p-border-radius-full, 9999px)");

    const { container: cNone } = render(<Skeleton borderRadius="none" />);
    expect(
      cNone.querySelector("[data-corex-skeleton]")?.getAttribute("style"),
    ).toContain("border-radius: 0px");
  });

  it("supports dynamic inlineSize and blockSize", () => {
    const { container } = render(
      <Skeleton inlineSize="75%" blockSize={32} borderRadius={6} />,
    );
    const el = container.querySelector("[data-corex-skeleton]");
    expect(el?.getAttribute("style")).toContain("width: 75%");
    expect(el?.getAttribute("style")).toContain("height: 32px");
    expect(el?.getAttribute("style")).toContain("border-radius: 6px");
  });
});

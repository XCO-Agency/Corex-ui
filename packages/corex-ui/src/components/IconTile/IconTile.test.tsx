import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { IconTile } from "./IconTile";

describe("IconTile", () => {
  it("renders children with default styles", () => {
    render(
      <IconTile data-testid="tile">
        <span data-testid="icon">★</span>
      </IconTile>,
    );
    const tile = screen.getByTestId("tile");
    expect(tile).toBeInTheDocument();
    expect(screen.getByTestId("icon")).toBeInTheDocument();
    expect(tile.style.backgroundColor).toBe("rgb(174, 254, 190)"); // #aefebe
    expect(tile.style.color).toBe("rgb(5, 150, 105)"); // #059669
  });

  it("applies tone, size, and border radius correctly", () => {
    const { rerender } = render(
      <IconTile data-testid="tile" tone="caution" size="lg" borderRadius="full">
        Icon
      </IconTile>,
    );
    const tile = screen.getByTestId("tile");
    expect(tile.style.backgroundColor).toBe("rgb(254, 243, 199)"); // #fef3c7
    expect(tile.style.color).toBe("rgb(217, 119, 6)"); // #d97706
    expect(tile.style.width).toBe("2.75rem");
    expect(tile.style.height).toBe("2.75rem");
    expect(tile.style.borderRadius).toBe("9999px");

    rerender(
      <IconTile data-testid="tile" size="sm" borderRadius="none">
        Icon
      </IconTile>,
    );
    expect(tile.style.width).toBe("1.3rem");
    expect(tile.style.borderRadius).toBe("0px");
  });
});

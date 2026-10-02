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
    expect(tile.style.backgroundColor).toBe("rgb(188, 249, 126)"); // #BCF97E
    expect(tile.style.color).toBe("rgb(44, 74, 18)"); // #2C4A12
  });

  it("applies tone, size, and border radius correctly", () => {
    const { rerender } = render(
      <IconTile data-testid="tile" tone="caution" size="large" borderRadius="full">
        Icon
      </IconTile>,
    );
    const tile = screen.getByTestId("tile");
    expect(tile.style.backgroundColor).toBe("rgb(250, 221, 130)"); // #FADD82
    expect(tile.style.color).toBe("rgb(83, 60, 15)"); // #533C0F
    expect(tile.style.width).toBe("auto");
    expect(tile.style.height).toBe("2.75rem");
    expect(tile.style.borderRadius).toBe("9999px");

    rerender(
      <IconTile data-testid="tile" size="small" borderRadius="none">
        Icon
      </IconTile>,
    );
    expect(tile.style.width).toBe("auto");
    expect(tile.style.height).toBe("1.35rem");
    expect(tile.style.borderRadius).toBe("0px");
  });

  it("applies strong color intensity with bold background and text", () => {
    const { rerender } = render(
      <IconTile data-testid="tile" tone="critical" color="strong">
        Icon
      </IconTile>,
    );
    const tile = screen.getByTestId("tile");
    expect(tile.style.backgroundColor).toBe("rgb(243, 185, 180)"); // #F3B9B4
    expect(tile.style.color).toBe("rgb(100, 21, 15)"); // #64150F

    rerender(
      <IconTile data-testid="tile" tone="success" color="strong">
        Icon
      </IconTile>,
    );
    expect(tile.style.backgroundColor).toBe("rgb(163, 244, 94)"); // #A3F45E
    expect(tile.style.color).toBe("rgb(36, 66, 11)"); // #24420B
  });
});

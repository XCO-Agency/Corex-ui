import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { TitleBar } from "./TitleBar";

describe("TitleBar", () => {
  it("renders ui-title-bar with title attribute and children", () => {
    render(
      <TitleBar title="Edit Settings">
        <button type="button">Action</button>
      </TitleBar>,
    );

    const btn = screen.getByRole("button", { name: "Action" });
    const el = btn.closest("ui-title-bar");
    expect(el).not.toBeNull();
    expect(el).toHaveAttribute("title", "Edit Settings");
  });
});

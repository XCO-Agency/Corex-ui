import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { Tooltip } from "./Tooltip";

describe("Tooltip", () => {
  it("renders the trigger and content in a slot", () => {
    render(
      <Tooltip content="Deletes the item permanently">
        <span>Delete</span>
      </Tooltip>,
    );
    expect(screen.getByText("Delete")).toBeInTheDocument();
    const contentEl = screen.getByText("Deletes the item permanently");
    expect(contentEl).toHaveAttribute("slot", "content");
  });
});

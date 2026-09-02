import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { Tooltip } from "./Tooltip";

describe("Tooltip", () => {
  it("links the trigger to a sibling tooltip by id", () => {
    render(
      <Tooltip content="Deletes the item permanently">
        <span>Delete</span>
      </Tooltip>,
    );
    const trigger = screen.getByText("Delete");
    expect(trigger).toBeInTheDocument();
    const contentEl = screen.getByText("Deletes the item permanently");
    expect(contentEl.closest("s-tooltip")).toHaveAttribute("id");
    expect(trigger.closest("s-text")).toHaveAttribute("interestfor", contentEl.closest("s-tooltip")?.id);
  });
});

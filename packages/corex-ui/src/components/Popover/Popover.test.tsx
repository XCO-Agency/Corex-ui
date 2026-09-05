import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { Popover } from "./Popover";

describe("Popover", () => {
  it("renders s-popover with id and children", () => {
    render(
      <Popover id="test-popover">
        <div>Content</div>
      </Popover>,
    );

    const el = document.querySelector("s-popover");
    expect(el).toBeInTheDocument();
    expect(el).toHaveAttribute("id", "test-popover");
  });
});

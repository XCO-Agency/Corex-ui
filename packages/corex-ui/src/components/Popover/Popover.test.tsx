import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { Popover } from "./Popover";
import { Button } from "../Button";

describe("Popover", () => {
  it("renders compound Popover.Trigger and Popover.Content bound together", () => {
    render(
      <Popover>
        <Popover.Trigger>
          <Button icon="menu-horizontal">Options</Button>
        </Popover.Trigger>
        <Popover.Content>
          <div>Popover Body</div>
        </Popover.Content>
      </Popover>,
    );

    const triggerEl = document.querySelector("s-button");
    const popoverEl = document.querySelector("s-popover");

    expect(triggerEl).toBeInTheDocument();
    expect(popoverEl).toBeInTheDocument();

    const popoverId = popoverEl?.getAttribute("id");
    expect(popoverId).toBeTruthy();
    expect(triggerEl).toHaveAttribute("commandfor", popoverId);
  });

  it("uses provided id when specified", () => {
    render(
      <Popover id="custom-popover-id">
        <Popover.Trigger>
          <Button>Click</Button>
        </Popover.Trigger>
        <Popover.Content>
          <div>Custom content</div>
        </Popover.Content>
      </Popover>,
    );

    const triggerEl = document.querySelector("s-button");
    const popoverEl = document.querySelector("s-popover");

    expect(popoverEl).toHaveAttribute("id", "custom-popover-id");
    expect(triggerEl).toHaveAttribute("commandfor", "custom-popover-id");
  });
});

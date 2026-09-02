import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { Tabs } from "./Tabs";

const tabs = [
  { id: "all", content: "All" },
  { id: "drafts", content: "Drafts" },
];

describe("Tabs", () => {
  it("supports uncontrolled selection, defaulting to the first tab", () => {
    render(
      <Tabs tabs={tabs}>
        <span>Panel content</span>
      </Tabs>,
    );
    expect(screen.getByText("All")).toHaveAttribute("pressed");
    expect(screen.getByText("Panel content")).toBeInTheDocument();
  });

  it("calls onSelect with the clicked tab's index in controlled mode", () => {
    const onSelect = vi.fn();
    render(<Tabs tabs={tabs} selected={0} onSelect={onSelect} />);

    screen.getByText("Drafts").dispatchEvent(new MouseEvent("click", { bubbles: true }));

    expect(onSelect).toHaveBeenCalledWith(1);
  });
});

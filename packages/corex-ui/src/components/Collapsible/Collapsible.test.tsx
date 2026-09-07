import { describe, expect, it, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Collapsible } from "./Collapsible";

describe("Collapsible", () => {
  it("always renders the target, and collapses the content track by default", () => {
    const { container } = render(
      <Collapsible content={<div>Revealed content</div>}>
        <div>Target</div>
      </Collapsible>,
    );

    expect(screen.getByText("Target")).toBeInTheDocument();
    expect(screen.getByText("Revealed content")).toBeInTheDocument();

    const track = container.querySelector("[aria-hidden='true']") as HTMLElement;
    expect(track).toBeInTheDocument();
    expect(track.style.gridTemplateRows).toBe("0fr");
  });

  it("expands the content track when `expanded` is true", () => {
    const { container } = render(
      <Collapsible expanded content={<div>Revealed content</div>}>
        <div>Target</div>
      </Collapsible>,
    );

    const track = container.querySelector("[aria-hidden='false']") as HTMLElement;
    expect(track).toBeInTheDocument();
    expect(track.style.gridTemplateRows).toBe("1fr");
  });

  it("toggles uncontrolled state and notifies onExpandedChange via render-prop helpers", () => {
    const onExpandedChange = vi.fn();
    render(
      <Collapsible onExpandedChange={onExpandedChange} content={<div>Revealed content</div>}>
        {({ expanded, toggle }) => (
          <button type="button" onClick={toggle}>
            {expanded ? "Hide" : "Show"}
          </button>
        )}
      </Collapsible>,
    );

    const button = screen.getByRole("button");
    expect(button).toHaveTextContent("Show");

    fireEvent.click(button);

    expect(button).toHaveTextContent("Hide");
    expect(onExpandedChange).toHaveBeenCalledWith(true);
  });

  it("does not render a content track when `content` is omitted", () => {
    const { container } = render(
      <Collapsible>
        <div>Target only</div>
      </Collapsible>,
    );

    expect(container.querySelector("[aria-hidden]")).not.toBeInTheDocument();
  });
});

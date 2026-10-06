import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { Selectable } from "./Selectable";

describe("Selectable", () => {
  it("toggles on click and reports the change", () => {
    const onSelectedChange = vi.fn();
    render(
      <Selectable onSelectedChange={onSelectedChange} accessibilityLabel="Option">
        content
      </Selectable>,
    );

    const box = screen.getByRole("checkbox", { name: "Option" });
    expect(box).toHaveAttribute("aria-checked", "false");
    fireEvent.click(box);
    expect(box).toHaveAttribute("aria-checked", "true");
    expect(onSelectedChange).toHaveBeenLastCalledWith(true);
    fireEvent.click(box);
    expect(onSelectedChange).toHaveBeenLastCalledWith(false);
  });

  it("toggles with Space and Enter", () => {
    render(<Selectable accessibilityLabel="Option">content</Selectable>);
    const box = screen.getByRole("checkbox");
    fireEvent.keyDown(box, { key: " " });
    expect(box).toHaveAttribute("aria-checked", "true");
    fireEvent.keyDown(box, { key: "Enter" });
    expect(box).toHaveAttribute("aria-checked", "false");
  });

  it("follows the controlled selected prop", () => {
    const { rerender } = render(<Selectable selected>content</Selectable>);
    expect(screen.getByRole("checkbox")).toHaveAttribute("aria-checked", "true");
    fireEvent.click(screen.getByRole("checkbox"));
    // Still controlled: the parent decides.
    expect(screen.getByRole("checkbox")).toHaveAttribute("aria-checked", "true");
    rerender(<Selectable selected={false}>content</Selectable>);
    expect(screen.getByRole("checkbox")).toHaveAttribute("aria-checked", "false");
  });

  it("does nothing when disabled", () => {
    const onSelectedChange = vi.fn();
    render(
      <Selectable disabled onSelectedChange={onSelectedChange}>
        content
      </Selectable>,
    );
    const box = screen.getByRole("checkbox");
    fireEvent.click(box);
    expect(onSelectedChange).not.toHaveBeenCalled();
    expect(box).toHaveAttribute("aria-disabled", "true");
    expect(box).not.toHaveAttribute("tabindex");
  });

  it("is a highlight only when not interactive", () => {
    const { container } = render(
      <Selectable interactive={false} selected tone="success">
        content
      </Selectable>,
    );
    const root = container.firstElementChild as HTMLElement;
    expect(root).not.toHaveAttribute("role");
    expect(root).toHaveClass("cx-selectable--selected");
    expect(root.style.getPropertyValue("--cx-sel-color")).toContain("success");
    fireEvent.click(root);
    expect(root).toHaveClass("cx-selectable--selected");
  });

  it("renders the check badge only when asked", () => {
    const { container, rerender } = render(<Selectable>content</Selectable>);
    expect(container.querySelector(".cx-selectable__badge")).toBeNull();
    rerender(<Selectable indicator>content</Selectable>);
    expect(container.querySelector(".cx-selectable__badge")).not.toBeNull();
  });

  it("injects the stylesheet once", () => {
    render(
      <>
        <Selectable>a</Selectable>
        <Selectable>b</Selectable>
      </>,
    );
    expect(document.querySelectorAll("#cx-selectable-styles")).toHaveLength(1);
  });

  describe("Group", () => {
    it("behaves like radio buttons by default", () => {
      const onChange = vi.fn();
      render(
        <Selectable.Group onChange={onChange} accessibilityLabel="Plan">
          <Selectable value="a" accessibilityLabel="A">
            A
          </Selectable>
          <Selectable value="b" accessibilityLabel="B">
            B
          </Selectable>
        </Selectable.Group>,
      );

      expect(screen.getByRole("radiogroup", { name: "Plan" })).toBeInTheDocument();
      fireEvent.click(screen.getByRole("radio", { name: "A" }));
      fireEvent.click(screen.getByRole("radio", { name: "B" }));
      expect(onChange).toHaveBeenLastCalledWith(["b"]);
      expect(screen.getByRole("radio", { name: "A" })).toHaveAttribute(
        "aria-checked",
        "false",
      );
      // Choosing the selected one again keeps it selected.
      fireEvent.click(screen.getByRole("radio", { name: "B" }));
      expect(screen.getByRole("radio", { name: "B" })).toHaveAttribute(
        "aria-checked",
        "true",
      );
    });

    it("selects several items with multiple", () => {
      const onChange = vi.fn();
      render(
        <Selectable.Group multiple defaultValue={["a"]} onChange={onChange}>
          <Selectable value="a" accessibilityLabel="A">
            A
          </Selectable>
          <Selectable value="b" accessibilityLabel="B">
            B
          </Selectable>
        </Selectable.Group>,
      );

      fireEvent.click(screen.getByRole("checkbox", { name: "B" }));
      expect(onChange).toHaveBeenLastCalledWith(["a", "b"]);
      fireEvent.click(screen.getByRole("checkbox", { name: "A" }));
      expect(onChange).toHaveBeenLastCalledWith(["b"]);
    });

    it("passes its tone and disabled state down", () => {
      const { container } = render(
        <Selectable.Group tone="critical" disabled>
          <Selectable value="a">A</Selectable>
        </Selectable.Group>,
      );
      const item = container.querySelector(".cx-selectable") as HTMLElement;
      expect(item.style.getPropertyValue("--cx-sel-color")).toContain("critical");
      expect(item).toHaveAttribute("aria-disabled", "true");
    });
  });
});

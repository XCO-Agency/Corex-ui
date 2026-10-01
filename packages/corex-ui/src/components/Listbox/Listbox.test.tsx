import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { Listbox } from "./Listbox";

describe("Listbox", () => {
  it("renders a listbox of options", () => {
    const { container } = render(
      <Listbox accessibilityLabel="Tags">
        <Listbox.Option value="a">Alpha</Listbox.Option>
        <Listbox.Option value="b" selected>
          Beta
        </Listbox.Option>
      </Listbox>,
    );

    expect(container.querySelector('[role="listbox"]')).toHaveAttribute(
      "aria-label",
      "Tags",
    );
    const options = container.querySelectorAll('[role="option"]');
    expect(options).toHaveLength(2);
    expect(options[1]).toHaveAttribute("aria-selected", "true");
  });

  it("selects on pointer-down, so the field keeps focus", () => {
    const onSelect = vi.fn();
    const { container } = render(
      <Listbox onSelect={onSelect}>
        <Listbox.Option value="a">Alpha</Listbox.Option>
      </Listbox>,
    );
    const option = container.querySelector('[role="option"]')!;

    fireEvent.mouseDown(option);
    expect(onSelect).toHaveBeenCalledWith("a");

    // The click that follows a pointer pick must not select a second time.
    fireEvent.click(option);
    expect(onSelect).toHaveBeenCalledTimes(1);
  });

  it("selects on Enter and Space for a keyboard user", () => {
    const onSelect = vi.fn();
    const { container } = render(
      <Listbox onSelect={onSelect}>
        <Listbox.Option value="a">Alpha</Listbox.Option>
      </Listbox>,
    );
    const option = container.querySelector('[role="option"]')!;

    fireEvent.keyDown(option, { key: "Enter" });
    fireEvent.keyDown(option, { key: " " });
    fireEvent.keyDown(option, { key: "x" });

    expect(onSelect).toHaveBeenCalledTimes(2);
  });

  it("ignores a disabled option", () => {
    const onSelect = vi.fn();
    const { container } = render(
      <Listbox onSelect={onSelect}>
        <Listbox.Option value="a" disabled>
          Alpha
        </Listbox.Option>
      </Listbox>,
    );

    fireEvent.mouseDown(container.querySelector('[role="option"]')!);

    expect(onSelect).not.toHaveBeenCalled();
  });

  it("groups options in a titled section", () => {
    const { container } = render(
      <Listbox>
        <Listbox.Section title="Products" divider>
          <Listbox.Option value="a">Alpha</Listbox.Option>
        </Listbox.Section>
      </Listbox>,
    );

    expect(container.querySelector('[role="group"]')).toHaveAttribute(
      "aria-label",
      "Products",
    );
    expect(screen.getByText("Products")).toBeInTheDocument();
    expect(container.querySelector("s-divider")).not.toBeNull();
  });

  it("runs an action's own handler rather than selecting", () => {
    const onAction = vi.fn();
    const onSelect = vi.fn();
    const { container } = render(
      <Listbox onSelect={onSelect}>
        <Listbox.Action onAction={onAction}>Add new</Listbox.Action>
      </Listbox>,
    );

    fireEvent.mouseDown(container.querySelector("s-clickable")!);

    expect(onAction).toHaveBeenCalledTimes(1);
    expect(onSelect).not.toHaveBeenCalled();
  });

  it("announces the loading row", () => {
    const { container } = render(
      <Listbox>
        <Listbox.Loading accessibilityLabel="Finding products" />
      </Listbox>,
    );

    expect(container.querySelector('[role="status"]')).toHaveAttribute(
      "aria-live",
      "polite",
    );
    expect(container.querySelector("s-spinner")).toHaveAttribute(
      "accessibility-label",
      "Finding products",
    );
  });
});

import { render, fireEvent } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Switch } from "./Switch";

describe("Switch", () => {
  it("renders with checked property", () => {
    const { container } = render(<Switch checked={true} label="Enable feature" />);
    const el = container.querySelector("s-switch") as HTMLElement & { checked?: boolean };
    expect(el).toBeInTheDocument();
    expect(el.checked).toBe(true);
  });

  it("fires onChange with the new checked value on change event", () => {
    const onChange = vi.fn();
    const { container } = render(
      <Switch checked={false} id="my-switch" onChange={onChange} />,
    );
    const el = container.querySelector("s-switch") as HTMLElement & { checked?: boolean };

    el.checked = true;
    fireEvent(el, new Event("change", { bubbles: true }));

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith(true, "my-switch");
  });
});

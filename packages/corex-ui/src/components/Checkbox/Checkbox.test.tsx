import { describe, expect, it, vi } from "vitest";
import { render } from "@testing-library/react";
import { Checkbox } from "./Checkbox";

describe("Checkbox", () => {
  it("sets `checked` as a live DOM property", () => {
    render(<Checkbox label="Accept terms" checked id="terms" />);
    const el = document.querySelector("s-checkbox") as HTMLElement & {
      checked?: boolean;
    };
    expect(el.checked).toBe(true);
  });

  it("calls legacy onChange(checked, id) on the native change event", () => {
    const onChange = vi.fn();
    render(
      <Checkbox label="Accept terms" checked={false} onChange={onChange} id="terms" />,
    );

    const el = document.querySelector("s-checkbox") as HTMLElement & {
      checked?: boolean;
    };
    el.checked = true;
    el.dispatchEvent(new Event("change", { bubbles: true }));

    expect(onChange).toHaveBeenCalledWith(true, "terms");
  });
});

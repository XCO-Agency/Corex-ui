import { describe, expect, it, vi } from "vitest";
import { render } from "@testing-library/react";
import { DatePicker } from "./DatePicker";

describe("DatePicker", () => {
  it("sets `selected` as a live DOM property", () => {
    render(<DatePicker selected="2026-03-01" />);
    const el = document.querySelector("s-date-picker") as HTMLElement & { selected?: string };
    expect(el.selected).toBe("2026-03-01");
  });

  it("calls onChange(date) on the native change event", () => {
    const onChange = vi.fn();
    render(<DatePicker onChange={onChange} />);

    const el = document.querySelector("s-date-picker") as HTMLElement & { selected?: string };
    el.selected = "2026-04-10";
    el.dispatchEvent(new Event("change", { bubbles: true }));

    expect(onChange).toHaveBeenCalledWith("2026-04-10");
  });
});

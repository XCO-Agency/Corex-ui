import { describe, expect, it, vi } from "vitest";
import { render } from "@testing-library/react";
import { DateField } from "./DateField";

describe("DateField", () => {
  it("sets `value` as a live DOM property", () => {
    render(<DateField label="Start date" value="2026-01-01" id="start" />);
    const el = document.querySelector("s-date-field") as HTMLElement & { value?: string };
    expect(el.value).toBe("2026-01-01");
  });

  it("calls legacy onChange(value, id) on input", () => {
    const onChange = vi.fn();
    render(<DateField label="Start date" onChange={onChange} id="start" />);

    const el = document.querySelector("s-date-field") as HTMLElement & { value?: string };
    el.value = "2026-02-14";
    el.dispatchEvent(new Event("input", { bubbles: true }));

    expect(onChange).toHaveBeenCalledWith("2026-02-14", "start");
  });
});

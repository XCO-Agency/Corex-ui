import { describe, expect, it, vi } from "vitest";
import { render } from "@testing-library/react";
import { NumberField } from "./NumberField";

describe("NumberField", () => {
  it("sets `value` as a live DOM property", () => {
    render(<NumberField label="Quantity" value="10" min={1} max={100} step={1} id="quantity" />);
    const el = document.querySelector("s-number-field") as HTMLElement & { value?: string };
    expect(el.value).toBe("10");
  });

  it("calls legacy onChange(value, id) on input", () => {
    const onChange = vi.fn();
    render(<NumberField label="Quantity" onChange={onChange} id="quantity" />);

    const el = document.querySelector("s-number-field") as HTMLElement & { value?: string };
    el.value = "15";
    el.dispatchEvent(new Event("input", { bubbles: true }));

    expect(onChange).toHaveBeenCalledWith("15", "quantity");
  });
});

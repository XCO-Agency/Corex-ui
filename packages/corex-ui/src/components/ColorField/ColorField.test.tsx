import { describe, expect, it, vi } from "vitest";
import { render } from "@testing-library/react";
import { ColorField } from "./ColorField";

describe("ColorField", () => {
  it("sets `value` as a live DOM property", () => {
    render(<ColorField label="Brand Color" value="#008060" id="brand-color" />);
    const el = document.querySelector("s-color-field") as HTMLElement & { value?: string };
    expect(el.value).toBe("#008060");
  });

  it("calls legacy onChange(value, id) on input", () => {
    const onChange = vi.fn();
    render(<ColorField label="Brand Color" onChange={onChange} id="brand-color" />);

    const el = document.querySelector("s-color-field") as HTMLElement & { value?: string };
    el.value = "#ff0000";
    el.dispatchEvent(new Event("input", { bubbles: true }));

    expect(onChange).toHaveBeenCalledWith("#ff0000", "brand-color");
  });
});

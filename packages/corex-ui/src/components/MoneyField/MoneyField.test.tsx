import { describe, expect, it, vi } from "vitest";
import { render } from "@testing-library/react";
import { MoneyField } from "./MoneyField";

describe("MoneyField", () => {
  it("sets `value` as a live DOM property", () => {
    render(<MoneyField label="Price" value="29.99" currencyCode="USD" id="price" />);
    const el = document.querySelector("s-money-field") as HTMLElement & { value?: string };
    expect(el.value).toBe("29.99");
  });

  it("calls legacy onChange(value, id) on input", () => {
    const onChange = vi.fn();
    render(<MoneyField label="Price" onChange={onChange} id="price" />);

    const el = document.querySelector("s-money-field") as HTMLElement & { value?: string };
    el.value = "49.99";
    el.dispatchEvent(new Event("input", { bubbles: true }));

    expect(onChange).toHaveBeenCalledWith("49.99", "price");
  });
});

import { describe, expect, it, vi } from "vitest";
import { act, render, waitFor } from "@testing-library/react";
import { ColorField } from "./ColorField";

describe("ColorField", () => {
  it("renders a text field with the current color value", () => {
    render(<ColorField label="Brand Color" value="#008060" id="brand-color" />);
    const el = document.querySelector("s-text-field") as HTMLElement & {
      value?: string;
    };
    expect(el).toBeTruthy();
    expect(el.value).toBe("#008060");
  });

  it("renders a color swatch prefix", () => {
    render(<ColorField label="Brand Color" value="#5c6ac4" id="brand-color" />);
    const swatch = document.querySelector('[slot="prefix"]') as HTMLElement;
    expect(swatch).toBeTruthy();
    expect(swatch.style.backgroundColor).toMatch(/#5c6ac4|rgb\(92,\s*106,\s*196\)/i);
  });

  it("calls onChange(value, id) when the text field inputs", () => {
    const onChange = vi.fn();
    render(
      <ColorField label="Brand Color" value="#008060" onChange={onChange} id="brand-color" />,
    );

    const el = document.querySelector("s-text-field") as HTMLElement & {
      value?: string;
    };
    act(() => {
      el.value = "#ff0000";
      el.dispatchEvent(new Event("input", { bubbles: true }));
    });

    expect(onChange).toHaveBeenCalledWith("#ff0000", "brand-color");
  });

  it("opens the color picker popover when the text field is focused", async () => {
    render(<ColorField label="Brand Color" value="#008060" id="brand-color" />);
    const el = document.querySelector("s-text-field") as HTMLElement;

    expect(document.querySelector("s-color-picker")).toBeNull();

    act(() => {
      el.dispatchEvent(new Event("focus", { bubbles: true }));
    });

    await waitFor(() => {
      expect(document.querySelector("s-color-picker")).toBeTruthy();
    });
  });

  it("updates from the color picker input", async () => {
    const onChange = vi.fn();
    render(
      <ColorField label="Brand Color" value="#008060" onChange={onChange} id="brand-color" />,
    );
    const field = document.querySelector("s-text-field") as HTMLElement;

    act(() => {
      field.dispatchEvent(new Event("focus", { bubbles: true }));
    });

    const picker = await waitFor(
      () => document.querySelector("s-color-picker") as HTMLElement & { value?: string },
    );

    act(() => {
      picker.value = "#123456";
      picker.dispatchEvent(new Event("input", { bubbles: true }));
    });

    expect(onChange).toHaveBeenCalledWith("#123456", "brand-color");
  });

  it("does not open when disabled", () => {
    render(<ColorField label="Brand Color" value="#008060" disabled id="brand-color" />);
    const el = document.querySelector("s-text-field") as HTMLElement;

    act(() => {
      el.dispatchEvent(new Event("focus", { bubbles: true }));
    });

    expect(document.querySelector("s-color-picker")).toBeNull();
  });
});

import { describe, expect, it, vi } from "vitest";
import { render } from "@testing-library/react";
import { UrlField } from "./UrlField";

describe("UrlField", () => {
  it("sets `value` as a live DOM property", () => {
    render(<UrlField label="Store Website" value="https://example.com" id="website" />);
    const el = document.querySelector("s-url-field") as HTMLElement & { value?: string };
    expect(el.value).toBe("https://example.com");
  });

  it("calls legacy onChange(value, id) on input", () => {
    const onChange = vi.fn();
    render(<UrlField label="Store Website" onChange={onChange} id="website" />);

    const el = document.querySelector("s-url-field") as HTMLElement & { value?: string };
    el.value = "https://myshopify.com";
    el.dispatchEvent(new Event("input", { bubbles: true }));

    expect(onChange).toHaveBeenCalledWith("https://myshopify.com", "website");
  });
});

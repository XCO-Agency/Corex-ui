import { describe, expect, it, vi } from "vitest";
import { render } from "@testing-library/react";
import { EmailField } from "./EmailField";

describe("EmailField", () => {
  it("sets `value` as a live DOM property", () => {
    render(<EmailField label="Email" value="user@example.com" id="email" />);
    const el = document.querySelector("s-email-field") as HTMLElement & { value?: string };
    expect(el.value).toBe("user@example.com");
  });

  it("calls legacy onChange(value, id) on input", () => {
    const onChange = vi.fn();
    render(<EmailField label="Email" onChange={onChange} id="email" />);

    const el = document.querySelector("s-email-field") as HTMLElement & { value?: string };
    el.value = "new@example.com";
    el.dispatchEvent(new Event("input", { bubbles: true }));

    expect(onChange).toHaveBeenCalledWith("new@example.com", "email");
  });
});

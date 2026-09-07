import { describe, expect, it, vi } from "vitest";
import { render } from "@testing-library/react";
import { PasswordField } from "./PasswordField";

describe("PasswordField", () => {
  it("sets `value` as a live DOM property", () => {
    render(<PasswordField label="Password" value="secret123" id="password" />);
    const el = document.querySelector("s-password-field") as HTMLElement & {
      value?: string;
    };
    expect(el.value).toBe("secret123");
  });

  it("calls legacy onChange(value, id) on input", () => {
    const onChange = vi.fn();
    render(<PasswordField label="Password" onChange={onChange} id="password" />);

    const el = document.querySelector("s-password-field") as HTMLElement & {
      value?: string;
    };
    el.value = "newsecret456";
    el.dispatchEvent(new Event("input", { bubbles: true }));

    expect(onChange).toHaveBeenCalledWith("newsecret456", "password");
  });
});

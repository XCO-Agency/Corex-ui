import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { TextField } from "./TextField";

describe("TextField", () => {
  it("renders an s-text-field by default and sets `value` as a live property", () => {
    render(<TextField label="Name" value="Ada" onChange={() => {}} id="name" />);
    const el = document.querySelector("s-text-field") as HTMLElement & { value?: string };
    expect(el).not.toBeNull();
    expect(el).toHaveAttribute("label", "Name");
    expect(el.value).toBe("Ada");
  });

  it("renders s-text-area when multiline is set", () => {
    render(<TextField label="Notes" multiline onChange={() => {}} id="notes" />);
    expect(document.querySelector("s-text-area")).not.toBeNull();
    expect(document.querySelector("s-text-field")).toBeNull();
  });

  it("calls legacy onChange(value, id) on every keystroke (input event)", () => {
    const onChange = vi.fn();
    render(<TextField label="Name" onChange={onChange} id="name" />);

    const el = document.querySelector("s-text-field") as HTMLElement & { value?: string };
    el.value = "Ada Lovelace";
    el.dispatchEvent(new Event("input", { bubbles: true }));

    expect(onChange).toHaveBeenCalledWith("Ada Lovelace", "name");
  });
});

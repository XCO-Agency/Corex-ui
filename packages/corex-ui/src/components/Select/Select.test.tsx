import { describe, expect, it, vi } from "vitest";
import { render } from "@testing-library/react";
import { Select } from "./Select";

describe("Select", () => {
  it("renders string and object options as <option> elements", () => {
    render(
      <Select
        label="Country"
        id="country"
        options={["Canada", { label: "United States", value: "us" }]}
      />,
    );

    const options = document.querySelectorAll("s-select option");
    expect(options).toHaveLength(2);
    expect(options[0]).toHaveValue("Canada");
    expect(options[1]).toHaveValue("us");
  });

  it("calls legacy onChange(value, id) on the native change event", () => {
    const onChange = vi.fn();
    render(<Select label="Country" id="country" options={["Canada"]} onChange={onChange} />);

    const el = document.querySelector("s-select") as HTMLElement & { value?: string };
    el.value = "Canada";
    el.dispatchEvent(new Event("change", { bubbles: true }));

    expect(onChange).toHaveBeenCalledWith("Canada", "country");
  });
});

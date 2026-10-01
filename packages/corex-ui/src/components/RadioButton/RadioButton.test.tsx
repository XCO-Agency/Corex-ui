import { describe, expect, it, vi } from "vitest";
import { fireEvent, render } from "@testing-library/react";
import { RadioButton } from "./RadioButton";

describe("RadioButton", () => {
  it("renders a single-choice list holding one choice", () => {
    const { container } = render(
      <RadioButton id="fixed" label="Fixed amount" name="plan" value="FIXED" />,
    );

    expect(container.querySelectorAll("s-choice")).toHaveLength(1);
    expect(container.querySelector("s-choice")).toHaveAttribute("value", "FIXED");
    expect(container.querySelector("s-choice-list")).toHaveAttribute("name", "plan");
  });

  it("marks itself selected when checked", () => {
    const { container } = render(
      <RadioButton id="fixed" label="Fixed amount" value="FIXED" checked />,
    );
    const list = container.querySelector("s-choice-list") as HTMLElement & {
      values?: string[];
    };

    expect(list.values).toEqual(["FIXED"]);
  });

  it("falls back to the id for its value", () => {
    const { container } = render(<RadioButton id="lifetime" label="Lifetime" />);

    expect(container.querySelector("s-choice")).toHaveAttribute("value", "lifetime");
  });

  it("reports v12's (checked, id) on change", () => {
    const onChange = vi.fn();
    const { container } = render(
      <RadioButton id="fixed" label="Fixed amount" value="FIXED" onChange={onChange} />,
    );

    fireEvent.click(container.querySelector("s-choice")!);

    expect(onChange).toHaveBeenCalledWith(true, "fixed");
  });

  it("flattens a node label into the choice's text label", () => {
    const { container } = render(
      <RadioButton
        id="fixed"
        label={
          <span>
            Fixed <strong>amount</strong>
          </span>
        }
      />,
    );

    expect(container.querySelector("s-choice")).toHaveAttribute(
      "accessibility-label",
      "Fixed amount",
    );
  });
});

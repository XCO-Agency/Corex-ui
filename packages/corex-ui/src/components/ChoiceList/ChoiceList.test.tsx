import { describe, expect, it, vi } from "vitest";
import { render } from "@testing-library/react";
import { ChoiceList } from "./ChoiceList";

const choices = [
  { label: "Email", value: "email" },
  { label: "SMS", value: "sms" },
];

describe("ChoiceList", () => {
  it("renders choices as Polaris s-choice elements and sets values", () => {
    render(
      <ChoiceList
        title="Notify me by"
        choices={choices}
        selected={["email"]}
        name="notify"
      />,
    );
    const el = document.querySelector("s-choice-list") as HTMLElement & {
      values?: string[];
    };
    expect(el.values).toEqual(["email"]);
    expect(document.querySelectorAll("s-choice-list s-choice")).toHaveLength(2);
    expect(document.querySelector("s-choice[value='email']")).toHaveAttribute("selected");
  });

  it("calls legacy onChange(selected, name) on the native change event", () => {
    const onChange = vi.fn();
    render(
      <ChoiceList choices={choices} selected={[]} name="notify" onChange={onChange} />,
    );

    const el = document.querySelector("s-choice-list") as HTMLElement & {
      values?: string[];
    };
    el.values = ["sms"];
    el.dispatchEvent(new Event("change", { bubbles: true }));

    expect(onChange).toHaveBeenCalledWith(["sms"], "notify");
  });
});

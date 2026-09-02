import { describe, expect, it, vi } from "vitest";
import { render } from "@testing-library/react";
import { ChoiceList } from "./ChoiceList";

const choices = [
  { label: "Email", value: "email" },
  { label: "SMS", value: "sms" },
];

describe("ChoiceList", () => {
  it("sets `choices`/`selected` as live DOM properties", () => {
    render(<ChoiceList title="Notify me by" choices={choices} selected={["email"]} name="notify" />);
    const el = document.querySelector("s-choice-list") as HTMLElement & {
      choices?: unknown;
      selected?: string[];
    };
    expect(el.choices).toEqual(choices);
    expect(el.selected).toEqual(["email"]);
  });

  it("calls legacy onChange(selected, name) on the native change event", () => {
    const onChange = vi.fn();
    render(<ChoiceList choices={choices} selected={[]} name="notify" onChange={onChange} />);

    const el = document.querySelector("s-choice-list") as HTMLElement & { selected?: string[] };
    el.selected = ["sms"];
    el.dispatchEvent(new Event("change", { bubbles: true }));

    expect(onChange).toHaveBeenCalledWith(["sms"], "notify");
  });
});

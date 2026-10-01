import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { ChoiceList } from "./ChoiceList";
import type { ChoiceListOptionType } from "./ChoiceList.types";

/**
 * Type-level coverage: choice lists are routinely built from optional backend
 * fields, so nullable `label`/`value` has to compile, and the component coerces
 * them rather than rendering `null`.
 */
describe("ChoiceList types", () => {
  it("accepts choices with nullable label and value", () => {
    const fromBackend: Array<{ label: string | null; value: string | null }> = [
      { label: "Active", value: "ACTIVE" },
      { label: null, value: null },
    ];
    const choices: ChoiceListOptionType[] = fromBackend;

    const { container } = render(
      <ChoiceList label="Status" choices={choices} selected={["ACTIVE"]} />,
    );

    const options = container.querySelectorAll("s-choice");
    expect(options).toHaveLength(2);
    expect(options[1]).toHaveAttribute("value", "");
    expect(options[1]).toHaveAttribute("accessibility-label", "");
  });
});

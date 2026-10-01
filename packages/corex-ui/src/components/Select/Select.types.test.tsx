import type { Dispatch, SetStateAction } from "react";
import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { Select } from "./Select";

type PlanType = "FIXED" | "LIFETIME";

/**
 * Type-level coverage: these render calls only have to compile. A select bound
 * to union-typed state is the normal case, and before `SelectPropsType` became
 * generic in its value, `Dispatch<SetStateAction<Union>>` was not assignable to
 * `onChange` and every such call site needed a widening wrapper or a cast.
 */
describe("Select types", () => {
  it("accepts a Dispatch<SetStateAction<Union>> as onChange", () => {
    const setPlan: Dispatch<SetStateAction<PlanType>> = () => {};

    const { container } = render(
      <Select
        label="Plan"
        value={"FIXED" as PlanType}
        onChange={setPlan}
        options={[
          { label: "Fixed", value: "FIXED" },
          { label: "Lifetime", value: "LIFETIME" },
        ]}
      />,
    );

    expect(container.querySelector("s-select")).not.toBeNull();
  });

  it("narrows the handler's value parameter to the union", () => {
    const { container } = render(
      <Select
        label="Plan"
        value={"FIXED" as PlanType}
        onChange={(value) => {
          const plan: PlanType = value;
          void plan;
        }}
        options={["FIXED", "LIFETIME"]}
      />,
    );

    expect(container.querySelector("s-select")).not.toBeNull();
  });

  it("still accepts a plain string handler when the value is a plain string", () => {
    const setValue = (value: string, id: string) => void [value, id];

    const { container } = render(
      <Select label="Plan" value="FIXED" onChange={setValue} options={["FIXED"]} />,
    );

    expect(container.querySelector("s-select")).not.toBeNull();
  });
});

import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { FormLayout } from "./FormLayout";

describe("FormLayout", () => {
  it("stacks its fields in a column", () => {
    render(
      <FormLayout>
        <span>First</span>
      </FormLayout>,
    );

    const stack = screen.getByText("First").parentElement!;
    expect(stack).toHaveStyle({ display: "flex", flexDirection: "column" });
  });

  it("puts a group on one wrapping row", () => {
    render(
      <FormLayout>
        <FormLayout.Group>
          <span>Side by side</span>
        </FormLayout.Group>
      </FormLayout>,
    );

    const group = screen.getByText("Side by side").parentElement!;
    expect(group).toHaveStyle({ flexDirection: "row", flexWrap: "wrap" });
  });

  it("tightens a condensed group", () => {
    render(
      <FormLayout>
        <FormLayout.Group condensed>
          <span>Tight</span>
        </FormLayout.Group>
      </FormLayout>,
    );

    const group = screen.getByText("Tight").parentElement!;
    expect(group.style.gap).toContain("--p-space-200");
  });
});

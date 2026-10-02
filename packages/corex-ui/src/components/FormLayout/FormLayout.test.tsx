import { createRef } from "react";
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { FormLayout } from "./FormLayout";

describe("FormLayout", () => {
  it("stacks its fields in a column with 100% width", () => {
    render(
      <FormLayout>
        <span>First</span>
        <span>Second</span>
      </FormLayout>,
    );

    const first = screen.getByText("First");
    const stack = first.parentElement!;
    expect(stack).toHaveStyle({ display: "flex", flexDirection: "column", width: "100%" });
  });

  it("lays out fields in a group using equal columns", () => {
    render(
      <FormLayout>
        <FormLayout.Group>
          <span>City</span>
          <span>Postcode</span>
        </FormLayout.Group>
      </FormLayout>,
    );

    const city = screen.getByText("City");
    const grid = city.closest("s-grid");
    expect(grid).toBeInTheDocument();
    expect(grid).toHaveAttribute("gap", "base");
  });

  it("supports condensed spacing in a group", () => {
    render(
      <FormLayout>
        <FormLayout.Group condensed>
          <span>Tight 1</span>
          <span>Tight 2</span>
        </FormLayout.Group>
      </FormLayout>,
    );

    const el = screen.getByText("Tight 1");
    const grid = el.closest("s-grid");
    expect(grid).toBeInTheDocument();
    expect(grid).toHaveAttribute("gap", "small-200");
  });

  it("renders title and helpText in a group when provided", () => {
    render(
      <FormLayout>
        <FormLayout.Group title="Contact Info" helpText="We will not share your email">
          <span>Field 1</span>
        </FormLayout.Group>
      </FormLayout>,
    );

    expect(screen.getByText("Contact Info")).toBeInTheDocument();
    expect(screen.getByText("We will not share your email")).toBeInTheDocument();
  });

  it("forwards ref to container elements", () => {
    const layoutRef = createRef<HTMLDivElement>();
    const groupRef = createRef<HTMLDivElement>();


    render(
      <FormLayout ref={layoutRef}>
        <FormLayout.Group ref={groupRef}>
          <span>Field</span>
        </FormLayout.Group>
      </FormLayout>,
    );

    expect(layoutRef.current).toBeInstanceOf(HTMLDivElement);
    expect(groupRef.current).toBeInstanceOf(HTMLElement);
  });
});


import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { ButtonGroup } from "./ButtonGroup";
import { Button } from "../Button";

describe("ButtonGroup", () => {
  it("renders an s-button-group wrapping its children", () => {
    render(
      <ButtonGroup>
        <Button>One</Button>
        <Button>Two</Button>
      </ButtonGroup>,
    );

    const group = screen.getByText("One").closest("s-button-group");
    expect(group).not.toBeNull();
    expect(screen.getByText("Two")).toBeInTheDocument();
  });

  it("supports the Polaris-native gap prop", () => {
    render(<ButtonGroup gap="none"><Button>One</Button></ButtonGroup>);
    expect(screen.getByText("One").closest("s-button-group")).toHaveAttribute("gap", "none");
  });
});

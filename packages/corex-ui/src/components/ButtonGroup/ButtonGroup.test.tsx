import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { ButtonGroup } from "./ButtonGroup";
import { Button } from "../Button";

function buttonSlot(name: string) {
  return screen.getByText(name).closest("s-button");
}

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
    expect(group).toHaveAttribute("accessibilitylabel", "Actions");
    expect(buttonSlot("One")).toHaveAttribute("slot", "secondary-actions");
    expect(buttonSlot("Two")).toHaveAttribute("slot", "secondary-actions");
  });

  it("puts a primary button in primary-action and the rest in secondary-actions", () => {
    render(
      <ButtonGroup>
        <Button variant="secondary">Cancel</Button>
        <Button variant="primary">Save</Button>
      </ButtonGroup>,
    );

    expect(buttonSlot("Cancel")).toHaveAttribute("slot", "secondary-actions");
    expect(buttonSlot("Cancel")).toHaveAttribute("variant", "secondary");
    expect(buttonSlot("Save")).toHaveAttribute("slot", "primary-action");
    expect(buttonSlot("Save")).toHaveAttribute("variant", "primary");
  });

  it("treats the legacy primary flag as the primary action", () => {
    render(
      <ButtonGroup>
        <Button primary>Save</Button>
      </ButtonGroup>,
    );

    expect(buttonSlot("Save")).toHaveAttribute("slot", "primary-action");
  });

  it("keeps an explicit slot", () => {
    render(
      <ButtonGroup>
        <Button slot="secondary-actions" variant="primary">
          Keep
        </Button>
      </ButtonGroup>,
    );

    expect(buttonSlot("Keep")).toHaveAttribute("slot", "secondary-actions");
  });

  it("places every button in secondary-actions when gap is none", () => {
    render(
      <ButtonGroup gap="none">
        <Button variant="primary">One</Button>
        <Button>Two</Button>
      </ButtonGroup>,
    );

    expect(screen.getByText("One").closest("s-button-group")).toHaveAttribute(
      "gap",
      "none",
    );
    expect(buttonSlot("One")).toHaveAttribute("slot", "secondary-actions");
    expect(buttonSlot("One")).toHaveAttribute("variant", "secondary");
    expect(buttonSlot("Two")).toHaveAttribute("slot", "secondary-actions");
  });

  it("renders a tertiary button in secondary-actions as a secondary button", () => {
    render(
      <ButtonGroup>
        <Button variant="tertiary">More</Button>
      </ButtonGroup>,
    );

    expect(buttonSlot("More")).toHaveAttribute("slot", "secondary-actions");
    expect(buttonSlot("More")).toHaveAttribute("variant", "secondary");
  });

  it("slots buttons passed through a fragment", () => {
    render(
      <ButtonGroup>
        <>
          <Button variant="secondary">Cancel</Button>
          <Button variant="primary">Save</Button>
        </>
      </ButtonGroup>,
    );

    expect(buttonSlot("Cancel")).toHaveAttribute("slot", "secondary-actions");
    expect(buttonSlot("Save")).toHaveAttribute("slot", "primary-action");
  });

  it("supports the Polaris-native gap prop", () => {
    render(
      <ButtonGroup gap="none">
        <Button>One</Button>
      </ButtonGroup>,
    );
    expect(screen.getByText("One").closest("s-button-group")).toHaveAttribute(
      "gap",
      "none",
    );
  });
});

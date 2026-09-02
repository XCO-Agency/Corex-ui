import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { Menu } from "./Menu";
import { Button } from "../Button";

describe("Menu", () => {
  it("renders an s-menu with an id and Button children", () => {
    render(
      <Menu id="actions-menu">
        <Button icon="duplicate">Duplicate</Button>
        <Button icon="delete" destructive>
          Delete
        </Button>
      </Menu>,
    );

    const el = document.querySelector("s-menu#actions-menu");
    expect(el).not.toBeNull();
    expect(screen.getByText("Duplicate")).toBeInTheDocument();
    expect(screen.getByText("Delete")).toHaveAttribute("tone", "critical");
  });
});

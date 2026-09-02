import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { SaveBar } from "./SaveBar";

describe("SaveBar", () => {
  it("renders a ui-save-bar with the given id and raw button children", () => {
    render(
      <SaveBar id="modal-save-bar">
        <button type="button">Save</button>
        <button type="button">Discard</button>
      </SaveBar>,
    );

    const el = document.querySelector("ui-save-bar#modal-save-bar");
    expect(el).not.toBeNull();
    expect(screen.getByText("Save")).toBeInTheDocument();
    expect(screen.getByText("Discard")).toBeInTheDocument();
  });
});

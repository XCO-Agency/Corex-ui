import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { Combobox } from "./Combobox";
import { Listbox } from "../Listbox";

describe("Combobox", () => {
  it("renders the field above its suggestions", () => {
    const { container } = render(
      <Combobox
        activator={<Combobox.TextField label="Tags" value="" autoComplete="off" />}
      >
        <Listbox>
          <Listbox.Option value="a">Alpha</Listbox.Option>
        </Listbox>
      </Combobox>,
    );

    const field = container.querySelector("s-text-field")!;
    const list = container.querySelector('[role="listbox"]')!;

    expect(field.compareDocumentPosition(list) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(screen.getByText("Alpha")).toBeInTheDocument();
  });

  it("exposes TextField as the activator field", () => {
    expect(Combobox.TextField).toBeTypeOf("object");
  });
});

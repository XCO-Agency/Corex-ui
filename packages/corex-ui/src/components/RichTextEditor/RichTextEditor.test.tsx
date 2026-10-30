import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { RichTextEditor } from "./RichTextEditor";

function byA11yLabel(label: string) {
  return document.querySelector(`[accessibilitylabel="${label}"]`) as HTMLElement | null;
}

describe("RichTextEditor", () => {
  it("renders the toolbar and editable surface", () => {
    render(<RichTextEditor label="Description" defaultValue="<p>Hello</p>" />);

    expect(screen.getByText("Description")).toBeInTheDocument();
    expect(screen.getByRole("toolbar", { name: "Formatting" })).toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: "Description" })).toBeInTheDocument();
  });

  it("fires onChange when the surface receives input", () => {
    const onChange = vi.fn();
    render(<RichTextEditor label="Body" defaultValue="" onChange={onChange} />);

    const surface = screen.getByRole("textbox", { name: "Body" });
    surface.innerHTML = "<p>Updated</p>";
    fireEvent.input(surface);

    expect(onChange).toHaveBeenCalled();
    expect(onChange.mock.calls[0]?.[0]).toContain("Updated");
  });

  it("toggles HTML source view via the code button", () => {
    render(
      <RichTextEditor label="Body" defaultValue="<p>Source</p>" id="rte-test" />,
    );

    const codeBtn = byA11yLabel("Show HTML");
    expect(codeBtn).not.toBeNull();
    fireEvent.click(codeBtn!);

    const code = screen.getByLabelText("Body") as HTMLTextAreaElement;
    expect(code.tagName).toBe("TEXTAREA");
    expect(code.value).toContain("Source");

    const exitBtn = byA11yLabel("Exit HTML view");
    expect(exitBtn).not.toBeNull();
    fireEvent.click(exitBtn!);
    expect(screen.getByRole("textbox", { name: "Body" })).toBeInTheDocument();
  });

  it("opens the insert video modal", () => {
    render(<RichTextEditor label="Body" />);

    const videoBtn = byA11yLabel("Insert video");
    expect(videoBtn).not.toBeNull();
    fireEvent.click(videoBtn!);
    expect(
      screen.getByText("Insert a video by pasting the embed snippet in the box below."),
    ).toBeInTheDocument();
  });

  it("marks the shell disabled", () => {
    const { container } = render(<RichTextEditor label="Body" disabled />);
    expect(container.querySelector('[data-disabled="true"]')).not.toBeNull();
  });
});

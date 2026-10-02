import { describe, expect, it, vi } from "vitest";
import { render } from "@testing-library/react";
import { DropZone } from "./DropZone";

describe("DropZone", () => {
  it("renders with accept and multiple props", () => {
    render(<DropZone label="Upload Files" accept="image/*" multiple id="upload-zone" />);
    const el = document.querySelector("s-drop-zone");
    expect(el).not.toBeNull();
    expect(el?.getAttribute("label")).toBe("Upload Files");
    expect(el?.getAttribute("accept")).toBe("image/*");
  });

  it("handles onChange and onInput events", () => {
    const onChange = vi.fn();
    render(<DropZone label="Upload" onChange={onChange} id="upload-zone" />);

    const el = document.querySelector("s-drop-zone") as HTMLElement;
    el.dispatchEvent(new Event("change", { bubbles: true }));

    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it("calls v12's onDrop with the files the element accepted", () => {
    const onDrop = vi.fn();
    const { container } = render(<DropZone label="Upload" onDrop={onDrop} />);

    const el = container.querySelector("s-drop-zone")!;
    const input = document.createElement("input");
    input.type = "file";
    const file = new File(["body"], "claim.pdf", { type: "application/pdf" });
    Object.defineProperty(input, "files", { value: [file] });
    el.appendChild(input);

    input.dispatchEvent(new Event("change", { bubbles: true }));

    expect(onDrop).toHaveBeenCalledTimes(1);
    expect(onDrop.mock.calls[0]?.[0]).toEqual([file]);
  });

  it("still calls onChange with the raw event", () => {
    const onChange = vi.fn();
    const { container } = render(<DropZone label="Upload" onChange={onChange} />);

    container
      .querySelector("s-drop-zone")!
      .dispatchEvent(new Event("change", { bubbles: true }));

    expect(onChange).toHaveBeenCalledTimes(1);
  });
});

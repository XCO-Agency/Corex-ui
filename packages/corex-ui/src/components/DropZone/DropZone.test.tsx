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
});

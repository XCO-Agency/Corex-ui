import { describe, expect, it, vi } from "vitest";
import { fireEvent, render } from "@testing-library/react";
import { Image } from "./Image";

describe("Image", () => {
  it("renders an s-image with src and alt", () => {
    render(<Image src="https://example.com/photo.jpg" alt="A sample photo" />);
    const el = document.querySelector("s-image");
    expect(el).not.toBeNull();
    expect(el).toHaveAttribute("src", "https://example.com/photo.jpg");
    expect(el).toHaveAttribute("alt", "A sample photo");
  });

  it("supports legacy source prop as alias for src", () => {
    render(<Image source="https://example.com/legacy.jpg" alt="Legacy photo" />);
    const el = document.querySelector("s-image");
    expect(el).toHaveAttribute("src", "https://example.com/legacy.jpg");
  });

  it("binds onLoad event handler", () => {
    const onLoad = vi.fn();
    render(<Image src="https://example.com/photo.jpg" alt="Photo" onLoad={onLoad} />);
    const el = document.querySelector("s-image")!;

    fireEvent(el, new CustomEvent("load", { bubbles: true }));
    expect(onLoad).toHaveBeenCalledTimes(1);
  });
});

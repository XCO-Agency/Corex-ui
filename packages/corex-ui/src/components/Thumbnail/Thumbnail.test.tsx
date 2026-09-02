import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { Thumbnail } from "./Thumbnail";

describe("Thumbnail", () => {
  it("renders an s-thumbnail with source/alt", () => {
    render(<Thumbnail source="https://example.com/img.png" alt="Product photo" />);
    const el = document.querySelector("s-thumbnail");
    expect(el).toHaveAttribute("source", "https://example.com/img.png");
    expect(el).toHaveAttribute("alt", "Product photo");
  });
});

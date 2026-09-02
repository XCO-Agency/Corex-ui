import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { Avatar } from "./Avatar";

describe("Avatar", () => {
  it("renders an s-avatar with name/initials", () => {
    render(<Avatar name="Ada Lovelace" initials="AL" />);
    const el = document.querySelector("s-avatar");
    expect(el).toHaveAttribute("name", "Ada Lovelace");
    expect(el).toHaveAttribute("initials", "AL");
  });
});

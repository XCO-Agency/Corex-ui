import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { Icon } from "./Icon";

describe("Icon", () => {
  it("maps `source` to the `type` attribute", () => {
    render(<Icon source="save" accessibilityLabel="Save" />);
    const el = document.querySelector("s-icon");
    expect(el).not.toBeNull();
    expect(el).toHaveAttribute("type", "save");
  });
});

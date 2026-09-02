import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { Divider } from "./Divider";

describe("Divider", () => {
  it("renders an s-divider", () => {
    render(<Divider id="section-divider" />);
    expect(document.querySelector("s-divider#section-divider")).not.toBeNull();
  });
});

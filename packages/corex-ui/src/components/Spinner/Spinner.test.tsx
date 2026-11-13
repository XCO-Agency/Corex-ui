import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { Spinner } from "./Spinner";

describe("Spinner", () => {
  it("renders an s-spinner with a size attribute", () => {
    render(<Spinner size="large" accessibilityLabel="Loading" />);
    const el = document.querySelector("s-spinner");
    expect(el).not.toBeNull();
    expect(el).toHaveAttribute("size", "large");
    expect(el).toHaveAttribute("accessibilitylabel", "Loading");
  });

  it("names an unlabeled spinner Loading", () => {
    render(<Spinner />);
    expect(document.querySelector("s-spinner")).toHaveAttribute(
      "accessibilitylabel",
      "Loading",
    );
  });
});

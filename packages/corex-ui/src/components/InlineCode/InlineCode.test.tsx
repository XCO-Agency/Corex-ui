import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { InlineCode } from "./InlineCode";

describe("InlineCode", () => {
  it("renders a code element on a monospace face", () => {
    const { container } = render(<InlineCode>npm run dev</InlineCode>);
    const code = container.querySelector("code")!;

    expect(code).toHaveTextContent("npm run dev");
    expect(code.style.fontFamily).toContain("--p-font-family-mono");
  });

  it("lets a caller override the style", () => {
    const { container } = render(
      <InlineCode style={{ whiteSpace: "normal" }}>wraps</InlineCode>,
    );

    expect(container.querySelector("code")).toHaveStyle({ whiteSpace: "normal" });
  });
});

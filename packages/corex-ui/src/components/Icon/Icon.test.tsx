import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { Icon } from "./Icon";

describe("Icon", () => {
  it("maps `source` to the `type` attribute", () => {
    render(<Icon type="save" accessibilityLabel="Save" />);
    const el = document.querySelector("s-icon");
    expect(el).not.toBeNull();
    expect(el).toHaveAttribute("type", "save");
  });

  it("passes tone='white' directly to s-icon and wraps with display contents", () => {
    const { container } = render(<Icon type="save" tone="white" />);
    const el = document.querySelector("s-icon");
    expect(el).not.toBeNull();
    expect(el).toHaveAttribute("tone", "white");

    const wrapper = container.querySelector("div");
    expect(wrapper).toHaveStyle({ display: "contents" });
  });


  it("applies white style to custom React SVG component when tone='white'", () => {
    const CustomSvg = () => <svg data-testid="custom-svg" />;
    const { getByRole } = render(
      <Icon source={CustomSvg} tone="white" accessibilityLabel="Custom" />,
    );
    const wrapper = getByRole("img");
    expect(wrapper).toHaveStyle({ color: "#fff" });
  });
});



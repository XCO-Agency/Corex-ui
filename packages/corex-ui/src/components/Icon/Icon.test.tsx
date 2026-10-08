import type * as React from "react";
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
    expect(el).toHaveAttribute("tone", "auto");

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

  it("sizes a function `source` and paints it with currentColor", () => {
    const PolarisLikeIcon = (props: React.SVGProps<SVGSVGElement>) => (
      <svg data-testid="svg" viewBox="0 0 20 20" {...props} />
    );
    const { getByTestId } = render(<Icon source={PolarisLikeIcon} />);
    const svg = getByTestId("svg");

    expect(svg).toHaveAttribute("width", "20");
    expect(svg).toHaveAttribute("height", "20");
    expect(svg).toHaveAttribute("fill", "currentColor");
  });

  it("uses the small pixel size for size='small'", () => {
    const PolarisLikeIcon = (props: React.SVGProps<SVGSVGElement>) => (
      <svg data-testid="svg" viewBox="0 0 20 20" {...props} />
    );
    const { getByTestId } = render(<Icon source={PolarisLikeIcon} size="small" />);
    const svg = getByTestId("svg");

    expect(svg).toHaveAttribute("width", "16");
    expect(svg).toHaveAttribute("height", "16");
  });

  it("hides a decorative function `source` from assistive tech", () => {
    const PolarisLikeIcon = (props: React.SVGProps<SVGSVGElement>) => (
      <svg data-testid="svg" viewBox="0 0 20 20" {...props} />
    );
    const { getByTestId } = render(<Icon source={PolarisLikeIcon} />);
    const svg = getByTestId("svg");

    expect(svg).toHaveAttribute("aria-hidden", "true");
    expect(svg).toHaveAttribute("focusable", "false");
  });

  it("keeps a labelled function `source` exposed, with the label on the wrapper", () => {
    const PolarisLikeIcon = (props: React.SVGProps<SVGSVGElement>) => (
      <svg data-testid="svg" viewBox="0 0 20 20" {...props} />
    );
    const { getByRole, getByTestId } = render(
      <Icon source={PolarisLikeIcon} accessibilityLabel="Search" />,
    );

    expect(getByRole("img")).toHaveAttribute("aria-label", "Search");
    expect(getByTestId("svg")).not.toHaveAttribute("aria-hidden");
  });

  it("forwards `size` to s-icon for a string source", () => {
    render(<Icon type="save" size="small" />);
    expect(document.querySelector("s-icon")).toHaveAttribute("size", "small");
  });
});

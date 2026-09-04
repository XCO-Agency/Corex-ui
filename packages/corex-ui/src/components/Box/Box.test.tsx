import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { Box } from "./Box";

describe("Box", () => {
  it("renders an s-box with layout attributes", () => {
    render(
      <Box
        padding="base"
        background="subdued"
        borderWidth="small-100"
        borderColor="base"
        borderRadius="base"
        display="auto"
        overflow="hidden"
      >
        Content
      </Box>,
    );
    const el = screen.getByText("Content");
    expect(el.tagName.toLowerCase()).toBe("s-box");
    expect(el).toHaveAttribute("padding", "base");
    expect(el).toHaveAttribute("background", "subdued");
    expect(el).toHaveAttribute("borderwidth", "small-100");
    expect(el).toHaveAttribute("bordercolor", "base");
    expect(el).toHaveAttribute("borderradius", "base");
    expect(el).toHaveAttribute("display", "auto");
    expect(el).toHaveAttribute("overflow", "hidden");
  });

  it("translates legacy visuallyHidden to accessibilityVisibility='exclusive'", () => {
    render(<Box visuallyHidden>Screen reader content</Box>);
    const el = screen.getByText("Screen reader content");
    expect(el).toHaveAttribute("accessibilityvisibility", "exclusive");
  });

  it("translates legacy width and height to inlineSize and blockSize", () => {
    render(
      <Box width="200px" height="100px" minWidth="50px" maxHeight="300px">
        Sized box
      </Box>,
    );
    const el = screen.getByText("Sized box");
    expect(el).toHaveAttribute("inlinesize", "200px");
    expect(el).toHaveAttribute("blocksize", "100px");
    expect(el).toHaveAttribute("mininlinesize", "50px");
    expect(el).toHaveAttribute("maxblocksize", "300px");
  });

  it("merges legacy styling props into inline style", () => {
    render(
      <Box
        position="relative"
        zIndex={10}
        opacity="0.8"
        shadow="0 2px 4px rgba(0,0,0,0.1)"
        color="#333"
        style={{ margin: "10px" }}
      >
        Styled box
      </Box>,
    );
    const el = screen.getByText("Styled box");
    expect(el.style.position).toBe("relative");
    expect(el.style.zIndex).toBe("10");
    expect(el.style.opacity).toBe("0.8");
    expect(el.style.boxShadow).toBe("0 2px 4px rgba(0,0,0,0.1)");
    expect(el.style.color).toBe("rgb(51, 51, 51)");
    expect(el.style.margin).toBe("10px");
  });

  it("handles printHidden by adding print:hidden class", () => {
    render(
      <Box printHidden className="custom-box">
        Print hidden box
      </Box>,
    );
    const el = screen.getByText("Print hidden box");
    expect(el).toHaveClass("custom-box");
    expect(el).toHaveClass("print:hidden");
  });

  it("supports legacy as prop gracefully", () => {
    render(<Box as="span">Span Box</Box>);
    const el = screen.getByText("Span Box");
    expect(el.tagName.toLowerCase()).toBe("s-box");
  });

  it("translates legacy numeric padding tokens to Polaris web-component tokens", () => {
    render(
      <Box padding="200" data-testid="padded-box">
        Padded Box
      </Box>,
    );
    const el = screen.getByTestId("padded-box");
    expect(el).toHaveAttribute("padding", "small-200");
  });

  it("translates multi-value shorthand padding", () => {
    render(
      <Box padding="200 400" data-testid="shorthand-box">
        Shorthand Box
      </Box>,
    );
    const el = screen.getByTestId("shorthand-box");
    expect(el).toHaveAttribute("padding", "small-200 base");
  });

  it("translates directional padding props and kebab-cases attributes", () => {
    render(
      <Box
        paddingBlock="400"
        paddingInline="200"
        paddingBlockStart="100"
        paddingInlineEnd="050"
        data-testid="directional-box"
      >
        Directional Box
      </Box>,
    );
    const el = screen.getByTestId("directional-box");
    expect(el).toHaveAttribute("padding-block", "base");
    expect(el).toHaveAttribute("padding-inline", "small-200");
    expect(el).toHaveAttribute("padding-block-start", "small-300");
    expect(el).toHaveAttribute("padding-inline-end", "small-400");
  });

  it("translates legacy background and border tokens", () => {
    render(
      <Box
        background="bg-surface"
        borderColor="border"
        borderRadius="full"
        borderWidth="100"
        data-testid="styled-legacy-box"
      >
        Legacy Styled Box
      </Box>,
    );
    const el = screen.getByTestId("styled-legacy-box");
    expect(el).toHaveAttribute("background", "base");
    expect(el).toHaveAttribute("border-color", "base");
    expect(el).toHaveAttribute("border-radius", "max");
    expect(el).toHaveAttribute("border-width", "base");
  });
});

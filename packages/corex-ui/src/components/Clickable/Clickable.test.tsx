import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { Clickable } from "./Clickable";

describe("Clickable", () => {
  it("renders s-clickable custom element with children", () => {
    render(<Clickable>Clickable Content</Clickable>);
    const el = screen.getByText("Clickable Content");
    expect(el.tagName.toLowerCase()).toBe("s-clickable");
  });

  it("maps external to target and rel", () => {
    render(
      <Clickable href="https://example.com/action" external>
        External Link
      </Clickable>,
    );
    const el = screen.getByText("External Link");
    expect(el).toHaveAttribute("href", "https://example.com/action");
    expect(el).toHaveAttribute("target", "_blank");
    expect(el).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("supports explicit href, target, and download props", () => {
    render(
      <Clickable href="/export.csv" target="_self" download="report.csv" type="button">
        Download Report
      </Clickable>,
    );
    const el = screen.getByText("Download Report");
    expect(el).toHaveAttribute("href", "/export.csv");
    expect(el).toHaveAttribute("target", "_self");
    expect(el).toHaveAttribute("download", "report.csv");
    expect(el).toHaveAttribute("type", "button");
  });

  it("binds onClick as a native click event listener", () => {
    const onClick = vi.fn();
    render(<Clickable onClick={onClick}>Trigger Action</Clickable>);
    const el = screen.getByText("Trigger Action");
    el.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("supports onblur and onfocus event listeners", () => {
    const onBlur = vi.fn();
    const onFocus = vi.fn();
    render(
      <Clickable onBlur={onBlur} onFocus={onFocus}>
        Focusable Action
      </Clickable>,
    );
    const el = screen.getByText("Focusable Action");
    el.dispatchEvent(new FocusEvent("focus"));
    expect(onFocus).toHaveBeenCalledTimes(1);
    el.dispatchEvent(new FocusEvent("blur"));
    expect(onBlur).toHaveBeenCalledTimes(1);
  });

  it("supports disabled and loading props", () => {
    render(
      <Clickable disabled loading>
        Disabled Loading Action
      </Clickable>,
    );
    const el = screen.getByText("Disabled Loading Action");
    expect((el as HTMLButtonElement).disabled).toBe(true);
    expect((el as unknown as { loading: boolean }).loading).toBe(true);
  });

  it("passes BoxProps to the underlying custom element", () => {
    render(
      <Clickable
        background="subdued"
        borderWidth="base"
        borderStyle="solid"
        borderColor="base"
        borderRadius="base"
        padding="base"
        display="auto"
        overflow="hidden"
        blockSize="40px"
        inlineSize="120px"
        accessibilityRole="generic"
      >
        Box Styled Action
      </Clickable>,
    );
    const el = screen.getByText("Box Styled Action");
    expect(el).toHaveAttribute("background", "subdued");
    expect(el).toHaveAttribute("borderwidth", "base");
    expect(el).toHaveAttribute("borderstyle", "solid");
    expect(el).toHaveAttribute("bordercolor", "base");
    expect(el).toHaveAttribute("borderradius", "base");
    expect(el).toHaveAttribute("padding", "base");
    expect(el).toHaveAttribute("display", "auto");
    expect(el).toHaveAttribute("overflow", "hidden");
    expect(el).toHaveAttribute("blocksize", "40px");
    expect(el).toHaveAttribute("inlinesize", "120px");
    expect(el).toHaveAttribute("accessibilityrole", "generic");
  });

  it("supports accessibilityLabel and invoker commands", () => {
    render(
      <Clickable
        accessibilityLabel="Perform specialized action"
        command="--show"
        commandFor="custom-modal"
        interestFor="custom-popover"
        lang="en"
      >
        Command Button
      </Clickable>,
    );
    const el = screen.getByText("Command Button");
    expect(el).toHaveAttribute("accessibilitylabel", "Perform specialized action");
    expect(el).toHaveAttribute("command", "--show");
    expect(el).toHaveAttribute("commandfor", "custom-modal");
    expect(el).toHaveAttribute("interestfor", "custom-popover");
    expect(el).toHaveAttribute("lang", "en");
  });
});

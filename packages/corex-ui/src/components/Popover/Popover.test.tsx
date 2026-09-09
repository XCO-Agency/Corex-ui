import { describe, expect, it, vi } from "vitest";
import { render } from "@testing-library/react";
import { Popover, usePopover } from "./Popover";
import { Button } from "../Button";

describe("Popover", () => {
  it("renders compound Popover.Trigger and Popover.Content bound together", () => {
    render(
      <Popover>
        <Popover.Trigger>
          <Button icon="menu-horizontal">Options</Button>
        </Popover.Trigger>
        <Popover.Content>
          <div>Popover Body</div>
        </Popover.Content>
      </Popover>,
    );

    const triggerEl = document.querySelector("s-button");
    const popoverEl = document.querySelector("s-popover");

    expect(triggerEl).toBeInTheDocument();
    expect(popoverEl).toBeInTheDocument();

    const popoverId = popoverEl?.getAttribute("id");
    expect(popoverId).toBeTruthy();
    expect(triggerEl).toHaveAttribute("commandfor", popoverId);
  });

  it("uses provided id when specified", () => {
    render(
      <Popover id="custom-popover-id">
        <Popover.Trigger>
          <Button>Click</Button>
        </Popover.Trigger>
        <Popover.Content>
          <div>Custom content</div>
        </Popover.Content>
      </Popover>,
    );

    const triggerEl = document.querySelector("s-button");
    const popoverEl = document.querySelector("s-popover");

    expect(popoverEl).toHaveAttribute("id", "custom-popover-id");
    expect(triggerEl).toHaveAttribute("commandfor", "custom-popover-id");
  });

  it("throws when usePopover is called outside of Popover provider", () => {
    const TestComponent = () => {
      usePopover();
      return null;
    };

    expect(() => render(<TestComponent />)).toThrow(
      "Popover compound components must be used within a <Popover />",
    );
  });

  it("provides close action via usePopover that triggers hideOverlay on s-popover", () => {
    let capturedClose: (() => void) | null = null;

    const Child = () => {
      const { close } = usePopover();
      capturedClose = close;
      return <button onClick={close}>Close Popover</button>;
    };

    render(
      <Popover id="test-popover">
        <Popover.Trigger>
          <Button>Toggle</Button>
        </Popover.Trigger>
        <Popover.Content>
          <Child />
        </Popover.Content>
      </Popover>,
    );

    const popoverEl = document.querySelector("s-popover") as HTMLElement;
    expect(popoverEl).toBeInTheDocument();

    const hideOverlaySpy = vi.spyOn(popoverEl as any, "hideOverlay");

    expect(capturedClose).toBeTypeOf("function");
    capturedClose!();

    expect(hideOverlaySpy).toHaveBeenCalledTimes(1);
  });
});

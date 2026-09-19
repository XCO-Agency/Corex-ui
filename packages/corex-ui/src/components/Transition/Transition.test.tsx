import { createRef } from "react";
import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { render, screen, act } from "@testing-library/react";
import { Transition } from "./Transition";

describe("Transition", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("renders children and forwards ref to outer element", () => {
    const ref = createRef<HTMLElement>();
    render(
      <Transition ref={ref} animate="fade-up">
        <span>Content</span>
      </Transition>,
    );

    expect(screen.getByText("Content")).toBeInTheDocument();
    expect(ref.current).toBeInstanceOf(HTMLElement);
  });

  it("triggers enter animation and calls onEnter / onEntered", async () => {
    const onEnter = vi.fn();
    const onEntered = vi.fn();

    const { container } = render(
      <Transition
        animate="fade-up"
        duration={200}
        onEnter={onEnter}
        onEntered={onEntered}
      >
        <span>Animated Content</span>
      </Transition>,
    );

    expect(onEnter).toHaveBeenCalled();

    // Trigger double rAF
    act(() => {
      vi.advanceTimersByTime(16);
      vi.advanceTimersByTime(16);
    });

    // Advance through duration
    act(() => {
      vi.advanceTimersByTime(200);
    });

    expect(onEntered).toHaveBeenCalled();
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.style.opacity).toBe("1");
  });

  it("supports leaving prop for stage / wizard transitions", () => {
    const onExit = vi.fn();
    const onExited = vi.fn();

    const { rerender, container } = render(
      <Transition
        animate="fade-up"
        leaving={false}
        duration={150}
        onExit={onExit}
        onExited={onExited}
      >
        <span>Wizard Step</span>
      </Transition>,
    );

    // Now step becomes leaving
    rerender(
      <Transition
        animate="fade-up"
        leaving={true}
        duration={150}
        onExit={onExit}
        onExited={onExited}
      >
        <span>Wizard Step</span>
      </Transition>,
    );

    expect(onExit).toHaveBeenCalled();

    act(() => {
      vi.advanceTimersByTime(150);
    });

    expect(onExited).toHaveBeenCalled();
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.style.display).toBe("none");
  });

  it("supports controlled show toggling", () => {
    const onExit = vi.fn();
    const onExited = vi.fn();

    const { rerender, container } = render(
      <Transition
        animate="scale"
        show={true}
        duration={100}
        onExit={onExit}
        onExited={onExited}
      >
        <span>Toggle Content</span>
      </Transition>,
    );

    rerender(
      <Transition
        animate="scale"
        show={false}
        duration={100}
        onExit={onExit}
        onExited={onExited}
      >
        <span>Toggle Content</span>
      </Transition>,
    );

    expect(onExit).toHaveBeenCalled();

    act(() => {
      vi.advanceTimersByTime(100);
    });

    expect(onExited).toHaveBeenCalled();
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.style.display).toBe("none");

    // Re-enter: toggle show back to true
    const onEnter = vi.fn();
    const onEntered = vi.fn();
    rerender(
      <Transition
        animate="scale"
        show={true}
        duration={100}
        onEnter={onEnter}
        onEntered={onEntered}
      >
        <span>Toggle Content</span>
      </Transition>,
    );

    // Should immediately unhide display and start at enterFrom
    expect(wrapper.style.display).not.toBe("none");
    expect(onEnter).toHaveBeenCalled();

    // Trigger double rAF to complete transition into enterTo
    act(() => {
      vi.advanceTimersByTime(32);
      vi.advanceTimersByTime(100);
    });

    expect(onEntered).toHaveBeenCalled();
    expect(wrapper.style.transform).toBe("scale(1)");
    expect(wrapper.style.opacity).toBe("1");
  });

  it("applies layout properties like inlineSize, display, and alignItems", () => {
    const { container } = render(
      <Transition
        animate="fade-up"
        inlineSize="100%"
        display="flex"
        alignItems="center"
        flexDirection="column"
      >
        <span>Layout Box</span>
      </Transition>,
    );

    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.style.inlineSize).toBe("100%");
    expect(wrapper.style.display).toBe("flex");
    expect(wrapper.style.alignItems).toBe("center");
    expect(wrapper.style.flexDirection).toBe("column");
  });
});

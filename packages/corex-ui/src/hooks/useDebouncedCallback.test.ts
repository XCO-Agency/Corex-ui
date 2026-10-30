import { describe, expect, it, vi } from "vitest";
import { act, renderHook } from "@testing-library/react";
import { useDebouncedCallback } from "./useDebounce";

describe("useDebouncedCallback", () => {
  it("invokes only the latest call after the delay", () => {
    vi.useFakeTimers();
    const fn = vi.fn();

    const { result } = renderHook(() => useDebouncedCallback(fn, 200));

    act(() => {
      result.current("a");
      result.current("b");
      result.current("c");
    });

    expect(fn).not.toHaveBeenCalled();

    act(() => {
      vi.advanceTimersByTime(200);
    });

    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenCalledWith("c");

    vi.useRealTimers();
  });

  it("restarts the delay when it is called again", () => {
    vi.useFakeTimers();
    const fn = vi.fn();
    const { result } = renderHook(() => useDebouncedCallback(fn, 200));

    act(() => {
      result.current("a");
    });
    act(() => {
      vi.advanceTimersByTime(150);
    });
    act(() => {
      result.current("b");
    });
    act(() => {
      vi.advanceTimersByTime(150);
    });

    expect(fn).not.toHaveBeenCalled();

    act(() => {
      vi.advanceTimersByTime(50);
    });

    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenCalledWith("b");

    vi.useRealTimers();
  });

  it("drops a pending call when the hook unmounts", () => {
    vi.useFakeTimers();
    const fn = vi.fn();
    const { result, unmount } = renderHook(() => useDebouncedCallback(fn, 200));

    act(() => {
      result.current("a");
    });
    unmount();
    act(() => {
      vi.advanceTimersByTime(200);
    });

    expect(fn).not.toHaveBeenCalled();

    vi.useRealTimers();
  });

  it("calls the latest callback rather than the one from the first render", () => {
    vi.useFakeTimers();
    const first = vi.fn();
    const second = vi.fn();
    const { result, rerender } = renderHook(
      ({ callback }) => useDebouncedCallback(callback, 200),
      {
        initialProps: { callback: first },
      },
    );

    rerender({ callback: second });

    act(() => {
      result.current("x");
    });
    act(() => {
      vi.advanceTimersByTime(200);
    });

    expect(first).not.toHaveBeenCalled();
    expect(second).toHaveBeenCalledTimes(1);
    expect(second).toHaveBeenCalledWith("x");

    vi.useRealTimers();
  });
});

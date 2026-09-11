import { describe, expect, it, vi } from "vitest";
import { act, renderHook } from "@testing-library/react";
import { useDebounce, useDebouncedCallback } from "./useDebounce";

describe("useDebounce", () => {
  it("returns initial value immediately and debounces updates", () => {
    vi.useFakeTimers();

    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: "hello", delay: 300 } },
    );

    expect(result.current).toBe("hello");

    rerender({ value: "world", delay: 300 });
    // Should still be old value before delay
    expect(result.current).toBe("hello");

    act(() => {
      vi.advanceTimersByTime(299);
    });
    expect(result.current).toBe("hello");

    act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(result.current).toBe("world");

    vi.useRealTimers();
  });
});

describe("useDebouncedCallback", () => {
  it("debounces function calls", () => {
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
});

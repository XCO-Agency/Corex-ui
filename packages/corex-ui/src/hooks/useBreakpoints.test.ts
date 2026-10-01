import { describe, expect, it } from "vitest";
import { renderHook } from "@testing-library/react";
import { useBreakpoints } from "./useBreakpoints";

describe("useBreakpoints", () => {
  it("reports the window's breakpoint, up and down", () => {
    // jsdom reports a 1024px window, which is Polaris's `md`.
    const { result } = renderHook(() => useBreakpoints());

    expect(result.current.smUp).toBe(true);
    expect(result.current.mdUp).toBe(true);
    expect(result.current.lgUp).toBe(false);
    expect(result.current.lgDown).toBe(true);
    expect(result.current.mdDown).toBe(false);
  });

  it("answers as a phone once the window is narrow", () => {
    const original = window.innerWidth;
    Object.defineProperty(window, "innerWidth", { value: 380, configurable: true });

    const { result } = renderHook(() => useBreakpoints());

    expect(result.current.smUp).toBe(false);
    expect(result.current.smDown).toBe(true);
    expect(result.current.mdDown).toBe(true);

    Object.defineProperty(window, "innerWidth", {
      value: original,
      configurable: true,
    });
  });
});

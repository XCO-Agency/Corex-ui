import { describe, it, expect, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import {
  useDimension,
  getBreakpointFromWidth,
  resolveResponsiveValue,
} from "./useDimension";

describe("useDimension", () => {
  it("computes correct breakpoints from width", () => {
    expect(getBreakpointFromWidth(350)).toBe("xs");
    expect(getBreakpointFromWidth(489)).toBe("xs");
    expect(getBreakpointFromWidth(490)).toBe("sm");
    expect(getBreakpointFromWidth(767)).toBe("sm");
    expect(getBreakpointFromWidth(768)).toBe("md");
    expect(getBreakpointFromWidth(1039)).toBe("md");
    expect(getBreakpointFromWidth(1040)).toBe("lg");
    expect(getBreakpointFromWidth(1440)).toBe("lg");
  });

  it("resolves responsive values with cascade", () => {
    const config = { xs: 1, sm: 2, md: 3, lg: 4 };
    expect(resolveResponsiveValue(config, "lg")).toBe(4);
    expect(resolveResponsiveValue(config, "md")).toBe(3);
    expect(resolveResponsiveValue(config, "sm")).toBe(2);
    expect(resolveResponsiveValue(config, "xs")).toBe(1);

    const partialConfig = { xs: 1, lg: 4 };
    expect(resolveResponsiveValue(partialConfig, "lg")).toBe(4);
    expect(resolveResponsiveValue(partialConfig, "md")).toBe(1);
    expect(resolveResponsiveValue(partialConfig, "sm")).toBe(1);
    expect(resolveResponsiveValue(partialConfig, "xs")).toBe(1);

    expect(resolveResponsiveValue(3, "lg")).toBe(3);
    expect(resolveResponsiveValue(undefined, "lg", 1)).toBe(1);
  });

  it("returns window dimensions and responds to resize", () => {
    vi.stubGlobal("innerWidth", 1200);
    vi.stubGlobal("innerHeight", 800);

    const { result } = renderHook(() => useDimension());

    expect(result.current.width).toBe(1200);
    expect(result.current.breakpoint).toBe("lg");
    expect(result.current.isLg).toBe(true);
    expect(result.current.isMd).toBe(false);
    expect(result.current.isSm).toBe(false);
    expect(result.current.isXs).toBe(false);

    act(() => {
      vi.stubGlobal("innerWidth", 800);
      window.dispatchEvent(new Event("resize"));
    });

    expect(result.current.width).toBe(800);
    expect(result.current.breakpoint).toBe("md");
    expect(result.current.isMd).toBe(true);

    act(() => {
      vi.stubGlobal("innerWidth", 600);
      window.dispatchEvent(new Event("resize"));
    });

    expect(result.current.width).toBe(600);
    expect(result.current.breakpoint).toBe("sm");
    expect(result.current.isSm).toBe(true);

    act(() => {
      vi.stubGlobal("innerWidth", 360);
      window.dispatchEvent(new Event("resize"));
    });

    expect(result.current.width).toBe(360);
    expect(result.current.breakpoint).toBe("xs");
    expect(result.current.isXs).toBe(true);
  });
});

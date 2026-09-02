import { afterEach, describe, expect, it, vi } from "vitest";
import { renderHook } from "@testing-library/react";
import { useToast } from "./useToast";

describe("useToast", () => {
  afterEach(() => {
    delete (window as { shopify?: unknown }).shopify;
  });

  it("calls window.shopify.toast.show when available", () => {
    const show = vi.fn();
    window.shopify = { toast: { show }, saveBar: { show: vi.fn(), hide: vi.fn() } };

    const { result } = renderHook(() => useToast());
    result.current.show("Saved", { isError: false });

    expect(show).toHaveBeenCalledWith("Saved", { isError: false });
  });

  it("no-ops without throwing when window.shopify is unavailable", () => {
    const { result } = renderHook(() => useToast());
    expect(() => result.current.show("Saved")).not.toThrow();
  });
});

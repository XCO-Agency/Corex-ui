import { afterEach, describe, expect, it, vi } from "vitest";
import { renderHook } from "@testing-library/react";
import { useSaveBar } from "./useSaveBar";

describe("useSaveBar", () => {
  afterEach(() => {
    delete (window as { shopify?: unknown }).shopify;
  });

  it("calls window.shopify.saveBar.show/hide when available", () => {
    const show = vi.fn();
    const hide = vi.fn();
    window.shopify = { toast: { show: vi.fn() }, saveBar: { show, hide } };

    const { result } = renderHook(() => useSaveBar());
    result.current.show("modal-save-bar");
    result.current.hide("modal-save-bar");

    expect(show).toHaveBeenCalledWith("modal-save-bar");
    expect(hide).toHaveBeenCalledWith("modal-save-bar");
  });

  it("no-ops without throwing when window.shopify is unavailable", () => {
    const { result } = renderHook(() => useSaveBar());
    expect(() => result.current.show("modal-save-bar")).not.toThrow();
    expect(() => result.current.hide("modal-save-bar")).not.toThrow();
  });
});

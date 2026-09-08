import { afterEach, describe, expect, it, vi } from "vitest";
import { renderHook } from "@testing-library/react";
import { useSaveBar } from "./useSaveBar";

describe("useSaveBar", () => {
  afterEach(() => {
    delete (window as { shopify?: unknown }).shopify;
  });

  it("calls window.shopify.saveBar.show/hide/toggle/leaveConfirmation when available", async () => {
    const show = vi.fn();
    const hide = vi.fn();
    const toggle = vi.fn();
    const leaveConfirmation = vi.fn().mockResolvedValue(undefined);
    window.shopify = { toast: { show: vi.fn() }, saveBar: { show, hide, toggle, leaveConfirmation } } as any;

    const { result } = renderHook(() => useSaveBar());
    result.current.show("modal-save-bar");
    result.current.hide("modal-save-bar");
    result.current.toggle("modal-save-bar");
    await result.current.leaveConfirmation();

    expect(show).toHaveBeenCalledWith("modal-save-bar");
    expect(hide).toHaveBeenCalledWith("modal-save-bar");
    expect(toggle).toHaveBeenCalledWith("modal-save-bar");
    expect(leaveConfirmation).toHaveBeenCalled();
  });

  it("defaults to 'corex-ui-save-bar' when id is omitted in show/hide/toggle", () => {
    const show = vi.fn();
    const hide = vi.fn();
    const toggle = vi.fn();
    window.shopify = { toast: { show: vi.fn() }, saveBar: { show, hide, toggle } } as any;

    const { result } = renderHook(() => useSaveBar());
    result.current.show();
    result.current.hide();
    result.current.toggle();

    expect(show).toHaveBeenCalledWith("corex-ui-save-bar");
    expect(hide).toHaveBeenCalledWith("corex-ui-save-bar");
    expect(toggle).toHaveBeenCalledWith("corex-ui-save-bar");
  });

  it("no-ops without throwing when window.shopify is unavailable", async () => {
    const { result } = renderHook(() => useSaveBar());
    expect(() => result.current.show("modal-save-bar")).not.toThrow();
    expect(() => result.current.hide("modal-save-bar")).not.toThrow();
    expect(() => result.current.toggle("modal-save-bar")).not.toThrow();
    await expect(result.current.leaveConfirmation()).resolves.toBeUndefined();
  });
});

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, renderHook } from "@testing-library/react";
import { useAppWindowSaveBar } from "./useAppWindowSaveBar";

describe("useAppWindowSaveBar", () => {
  let parentPostMessageMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    parentPostMessageMock = vi.fn();
    // Simulate running inside an iframe: window.parent !== window
    Object.defineProperty(window, "parent", {
      value: { postMessage: parentPostMessageMock },
      configurable: true,
      writable: true,
    });
  });

  afterEach(() => {
    delete (window as { shopify?: unknown }).shopify;
    Object.defineProperty(window, "parent", {
      value: window,
      configurable: true,
      writable: true,
    });
  });

  it("calls shopify.saveBar.show/hide and posts sync message to parent", () => {
    const show = vi.fn();
    const hide = vi.fn();
    window.shopify = { toast: { show: vi.fn() }, saveBar: { show, hide } } as any;

    const { rerender, unmount } = renderHook(
      ({ open }) =>
        useAppWindowSaveBar({
          windowId: "custom-window",
          open,
          loading: false,
        }),
      { initialProps: { open: false } },
    );

    expect(hide).toHaveBeenCalledWith("custom-window-save-bar");
    expect(parentPostMessageMock).toHaveBeenCalledWith(
      expect.objectContaining({
        type: "COREX_APP_WINDOW_SAVE_BAR_SYNC",
        windowId: "custom-window",
        open: false,
      }),
      "*",
    );

    rerender({ open: true });
    expect(show).toHaveBeenCalledWith("custom-window-save-bar");
    expect(parentPostMessageMock).toHaveBeenCalledWith(
      expect.objectContaining({
        type: "COREX_APP_WINDOW_SAVE_BAR_SYNC",
        windowId: "custom-window",
        open: true,
      }),
      "*",
    );

    unmount();
    expect(hide).toHaveBeenCalledWith("custom-window-save-bar");
  });

  it("invokes onSave and onDiscard when receiving action message from parent", async () => {
    const onSave = vi.fn();
    const onDiscard = vi.fn();

    renderHook(() =>
      useAppWindowSaveBar({
        windowId: "editor-win",
        onSave,
        onDiscard,
      }),
    );

    await act(async () => {
      window.dispatchEvent(
        new MessageEvent("message", {
          data: {
            type: "COREX_APP_WINDOW_SAVE_BAR_ACTION",
            action: "save",
            windowId: "editor-win",
          },
        }),
      );
    });
    expect(onSave).toHaveBeenCalledTimes(1);

    await act(async () => {
      window.dispatchEvent(
        new MessageEvent("message", {
          data: {
            type: "COREX_APP_WINDOW_SAVE_BAR_ACTION",
            action: "discard",
            windowId: "editor-win",
          },
        }),
      );
    });
    expect(onDiscard).toHaveBeenCalledTimes(1);
  });

  it("exposes imperative show/hide/leaveConfirmation methods", async () => {
    const show = vi.fn();
    const hide = vi.fn();
    const leaveConfirmation = vi.fn().mockResolvedValue(undefined);
    window.shopify = { toast: { show: vi.fn() }, saveBar: { show, hide, leaveConfirmation } } as any;

    const { result } = renderHook(() =>
      useAppWindowSaveBar({
        windowId: "my-win",
      }),
    );

    result.current.show();
    result.current.hide();
    await result.current.leaveConfirmation();

    expect(show).toHaveBeenCalledWith("my-win-save-bar");
    expect(hide).toHaveBeenCalledWith("my-win-save-bar");
    expect(leaveConfirmation).toHaveBeenCalled();
  });
});

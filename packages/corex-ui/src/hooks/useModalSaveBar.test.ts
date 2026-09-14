import { describe, expect, it, vi } from "vitest";
import { renderHook } from "@testing-library/react";
import { useModalSaveBar } from "./useModalSaveBar";

describe("useModalSaveBar", () => {
  it("calls shopify.saveBar.show when open is true", () => {
    const showSpy = vi.fn();
    const hideSpy = vi.fn();
    (window as any).shopify = {
      saveBar: {
        show: showSpy,
        hide: hideSpy,
      },
    };

    renderHook(() =>
      useModalSaveBar({
        modalId: "test-modal",
        open: true,
      }),
    );

    expect(showSpy).toHaveBeenCalledWith("test-modal-save-bar");
  });

  it("calls shopify.saveBar.hide on unmount", () => {
    const showSpy = vi.fn();
    const hideSpy = vi.fn();
    (window as any).shopify = {
      saveBar: {
        show: showSpy,
        hide: hideSpy,
      },
    };

    const { unmount } = renderHook(() =>
      useModalSaveBar({
        modalId: "unmount-modal",
        open: true,
      }),
    );

    unmount();
    expect(hideSpy).toHaveBeenCalledWith("unmount-modal-save-bar");
  });

  it("triggers onSave when receiving COREX_MODAL_SAVE_BAR_ACTION save message", async () => {
    const onSave = vi.fn();
    renderHook(() =>
      useModalSaveBar({
        modalId: "action-modal",
        open: true,
        onSave,
      }),
    );

    window.postMessage(
      {
        type: "COREX_MODAL_SAVE_BAR_ACTION",
        action: "save",
        modalId: "action-modal",
      },
      "*",
    );

    await vi.waitFor(() => {
      expect(onSave).toHaveBeenCalledTimes(1);
    });
  });

  it("triggers onDiscard when receiving claimify-modal-discard message", async () => {
    const onDiscard = vi.fn();
    renderHook(() =>
      useModalSaveBar({
        modalId: "claimify-modal",
        open: true,
        onDiscard,
      }),
    );

    window.postMessage(
      {
        type: "claimify-modal-discard",
      },
      "*",
    );

    await vi.waitFor(() => {
      expect(onDiscard).toHaveBeenCalledTimes(1);
    });
  });

  it("resolves leaveConfirmation via shopify.saveBar", async () => {
    const leaveConfirmationSpy = vi.fn().mockResolvedValue(undefined);
    (window as any).shopify = {
      saveBar: {
        leaveConfirmation: leaveConfirmationSpy,
      },
    };

    const { result } = renderHook(() =>
      useModalSaveBar({ modalId: "leave-modal" }),
    );

    await result.current.leaveConfirmation();
    expect(leaveConfirmationSpy).toHaveBeenCalledTimes(1);
  });
});

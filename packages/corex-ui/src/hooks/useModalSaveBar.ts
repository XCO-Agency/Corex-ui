import { useEffect, useMemo, useRef } from "react";
import { devWarning } from "../utils/devWarning";

function getBrowserBroadcastChannel(name: string): BroadcastChannel | null {
  if (
    typeof window !== "undefined" &&
    typeof window.BroadcastChannel === "function" &&
    (typeof process === "undefined" || !process.versions?.node)
  ) {
    try {
      return new window.BroadcastChannel(name);
    } catch {
      return null;
    }
  }
  return null;
}

export type UseModalSaveBarOptionsType = {
  /**
   * Modal ID matching the host Modal `id`.
   * Defaults to "corex-modal".
   */
  modalId?: string;
  /**
   * Custom SaveBar ID if customized on the host Modal.
   * Defaults to `${modalId}-save-bar`.
   */
  saveBarId?: string;
  /**
   * BroadcastChannel channel name used to handshake with the host page.
   * Defaults to `corex-modal-${modalId}`.
   */
  channel?: string;
  /**
   * Whether the save bar should be open/visible (driven by dirty state).
   */
  open?: boolean;
  /**
   * Whether the Save button is in loading state.
   */
  loading?: boolean;
  /**
   * Whether Save and Discard buttons are disabled.
   */
  disabled?: boolean;
  /**
   * Custom label for the Save button.
   */
  saveText?: string;
  /**
   * Custom label for the Discard button.
   */
  discardText?: string;
  /**
   * Callback fired when the merchant clicks Save on the host save bar.
   */
  onSave?: () => void | Promise<void>;
  /**
   * Callback fired when the merchant clicks Discard on the host save bar.
   */
  onDiscard?: () => void | Promise<void>;
};

export type UseModalSaveBarResultType = {
  show: () => void;
  hide: () => void;
  leaveConfirmation: () => Promise<void>;
};

/**
 * Hook to be used inside an iframe page loaded via `<Modal variant="max" src="..." />`.
 *
 * Automatically:
 * 1. Synchronizes `open`, `loading`, and `disabled` dirty states to the host `<Modal>`
 *    via BroadcastChannel and postMessage.
 * 2. Listens for host Save and Discard triggers and invokes local `onSave` / `onDiscard`.
 * 3. Provides `leaveConfirmation()` to guard programmatic close or route transitions.
 * 4. Hides and cleans up the save bar upon unmounting.
 */
export function useModalSaveBar(
  options: UseModalSaveBarOptionsType = {},
): UseModalSaveBarResultType {
  const {
    modalId = "corex-modal",
    saveBarId,
    channel,
    open,
    loading,
    disabled,
    saveText,
    discardText,
    onSave,
    onDiscard,
  } = options;

  const resolvedSaveBarId = saveBarId ?? `${modalId}-save-bar`;
  const resolvedChannelName = channel ?? `corex-modal-${modalId}`;

  const onSaveRef = useRef(onSave);
  const onDiscardRef = useRef(onDiscard);

  useEffect(() => {
    onSaveRef.current = onSave;
  }, [onSave]);

  useEffect(() => {
    onDiscardRef.current = onDiscard;
  }, [onDiscard]);

  // Synchronize state with Shopify App Bridge and host window
  useEffect(() => {
    if (open !== undefined) {
      const shopify =
        typeof window !== "undefined" ? (window as any).shopify : undefined;
      if (typeof shopify?.saveBar?.show === "function" && typeof shopify?.saveBar?.hide === "function") {
        if (open) {
          shopify.saveBar.show(resolvedSaveBarId);
        } else {
          shopify.saveBar.hide(resolvedSaveBarId);
        }
      }
    }

    const syncPayload = {
      type: "COREX_MODAL_SAVE_BAR_SYNC",
      modalId,
      open,
      loading,
      disabled,
      saveText,
      discardText,
    };

    const claimifyPayload = {
      type: "claimify-save-state",
      visible: Boolean(open),
      disabled: Boolean(disabled),
      saving: Boolean(loading),
    };

    // 1. BroadcastChannel (reaches host window across same-origin frames)
    const bc = getBrowserBroadcastChannel(resolvedChannelName);
    if (bc) {
      try {
        bc.postMessage(syncPayload);
        bc.postMessage(claimifyPayload);
        bc.close();
      } catch {
        // ignore
      }
    }

    // 2. PostMessage to parent
    if (
      typeof window !== "undefined" &&
      window.parent &&
      window.parent !== window
    ) {
      window.parent.postMessage(syncPayload, "*");
      window.parent.postMessage(claimifyPayload, "*");
    }

    // 3. PostMessage to self (for tests and single-window setups)
    if (typeof window !== "undefined") {
      window.postMessage(syncPayload, "*");
      window.postMessage(claimifyPayload, "*");
    }
  }, [
    open,
    loading,
    disabled,
    saveText,
    discardText,
    modalId,
    resolvedSaveBarId,
    resolvedChannelName,
  ]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      const shopify =
        typeof window !== "undefined" ? (window as any).shopify : undefined;
      if (typeof shopify?.saveBar?.hide === "function") {
        shopify.saveBar.hide(resolvedSaveBarId);
      }

      const cleanupPayload = {
        type: "COREX_MODAL_SAVE_BAR_SYNC",
        modalId,
        open: false,
      };
      const claimifyCleanup = {
        type: "claimify-save-state",
        visible: false,
        disabled: false,
        saving: false,
      };

      const cleanupBc = getBrowserBroadcastChannel(resolvedChannelName);
      if (cleanupBc) {
        try {
          cleanupBc.postMessage(cleanupPayload);
          cleanupBc.postMessage(claimifyCleanup);
          cleanupBc.close();
        } catch {
          // ignore
        }
      }

      if (
        typeof window !== "undefined" &&
        window.parent &&
        window.parent !== window
      ) {
        window.parent.postMessage(cleanupPayload, "*");
        window.parent.postMessage(claimifyCleanup, "*");
      }
    };
  }, [resolvedSaveBarId, modalId, resolvedChannelName]);

  // Listen for Save and Discard action messages from host window
  useEffect(() => {
    const handleActionData = async (data: any) => {
      if (!data || typeof data !== "object") return;

      const isStandardAction =
        data.type === "COREX_MODAL_SAVE_BAR_ACTION" &&
        (!data.modalId || data.modalId === modalId);

      if (isStandardAction) {
        if (data.action === "save") {
          await onSaveRef.current?.();
        } else if (data.action === "discard") {
          await onDiscardRef.current?.();
        }
      }

      // Claimify / raw actions
      if (data.type === "claimify-modal-save") {
        await onSaveRef.current?.();
      } else if (data.type === "claimify-modal-discard") {
        await onDiscardRef.current?.();
      }
    };

    const bc = getBrowserBroadcastChannel(resolvedChannelName);
    if (bc) {
      bc.onmessage = (event) => handleActionData(event.data);
    }

    const handleWindowMessage = (event: MessageEvent) => {
      handleActionData(event.data);
    };

    window.addEventListener("message", handleWindowMessage);
    return () => {
      bc?.close();
      window.removeEventListener("message", handleWindowMessage);
    };
  }, [modalId, resolvedChannelName]);

  return useMemo(
    () => ({
      show() {
        const shopify =
          typeof window !== "undefined" ? (window as any).shopify : undefined;
        if (shopify?.saveBar?.show) {
          return shopify.saveBar.show(resolvedSaveBarId);
        }
        devWarning(
          "useModalSaveBar",
          "window.shopify is not available — the save bar only works inside a real embedded Shopify admin session.",
        );
      },
      hide() {
        const shopify =
          typeof window !== "undefined" ? (window as any).shopify : undefined;
        if (shopify?.saveBar?.hide) {
          return shopify.saveBar.hide(resolvedSaveBarId);
        }
        devWarning(
          "useModalSaveBar",
          "window.shopify is not available — the save bar only works inside a real embedded Shopify admin session.",
        );
      },
      async leaveConfirmation() {
        const shopify =
          typeof window !== "undefined" ? (window as any).shopify : undefined;
        if (shopify?.saveBar?.leaveConfirmation) {
          return shopify.saveBar.leaveConfirmation();
        }
        return Promise.resolve();
      },
    }),
    [resolvedSaveBarId],
  );
}

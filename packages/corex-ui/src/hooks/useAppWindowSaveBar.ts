import { useEffect, useMemo, useRef } from "react";
import { devWarning } from "../utils/devWarning";

const CHANNEL_NAME = "corex-app-window-save-bar";

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

export type UseAppWindowSaveBarOptionsType = {
  /**
   * Window ID matching the parent AppWindow `id`.
   * Defaults to "corex-app-window".
   */
  windowId?: string;
  /**
   * Custom SaveBar ID if customized on the parent AppWindow.
   * Defaults to `${windowId}-save-bar`.
   */
  saveBarId?: string;
  /**
   * Whether the save bar should be open/visible (e.g. `isDirty`).
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

export type UseAppWindowSaveBarResultType = {
  show: () => void;
  hide: () => void;
  leaveConfirmation: () => Promise<void>;
};

/**
 * Hook to be used inside an iframe page opened via `<AppWindow saveBar />`.
 *
 * Automatically:
 * 1. Shows/hides the host SaveBar via `shopify.saveBar.show(saveBarId)` / `.hide(...)`.
 * 2. Syncs `open`, `loading`, and `disabled` states to the parent `<AppWindow>` via BroadcastChannel & postMessage.
 * 3. Listens for Save and Discard button clicks from the parent and triggers local `onSave` / `onDiscard`.
 * 4. Hides the save bar upon unmounting.
 */
export function useAppWindowSaveBar(
  options: UseAppWindowSaveBarOptionsType = {},
): UseAppWindowSaveBarResultType {
  const {
    windowId = "corex-app-window",
    saveBarId,
    open,
    loading,
    disabled,
    saveText,
    discardText,
    onSave,
    onDiscard,
  } = options;

  const resolvedSaveBarId = saveBarId ?? `${windowId}-save-bar`;

  const onSaveRef = useRef(onSave);
  const onDiscardRef = useRef(onDiscard);

  useEffect(() => {
    onSaveRef.current = onSave;
  }, [onSave]);

  useEffect(() => {
    onDiscardRef.current = onDiscard;
  }, [onDiscard]);

  // Synchronize state with Shopify App Bridge and parent window
  useEffect(() => {
    if (open !== undefined) {
      const shopify =
        typeof window !== "undefined" ? (window as any).shopify : undefined;
      if (shopify?.saveBar) {
        if (open) {
          shopify.saveBar.show(resolvedSaveBarId);
        } else {
          shopify.saveBar.hide(resolvedSaveBarId);
        }
      }
    }

    const syncPayload = {
      type: "COREX_APP_WINDOW_SAVE_BAR_SYNC",
      windowId,
      open,
      loading,
      disabled,
      saveText,
      discardText,
    };

    // 1. BroadcastChannel (reaches parent page across same-origin frames)
    // 1. BroadcastChannel (reaches parent page across same-origin frames)
    const bc = getBrowserBroadcastChannel(CHANNEL_NAME);
    if (bc) {
      try {
        bc.postMessage(syncPayload);
        bc.close();
      } catch {
        // Ignore
      }
    }

    // 2. PostMessage to parent
    if (
      typeof window !== "undefined" &&
      window.parent &&
      window.parent !== window
    ) {
      window.parent.postMessage(syncPayload, "*");
    }

    // 3. PostMessage to self (for tests)
    if (typeof window !== "undefined") {
      window.postMessage(syncPayload, "*");
    }
  }, [
    open,
    loading,
    disabled,
    saveText,
    discardText,
    windowId,
    resolvedSaveBarId,
  ]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      const shopify =
        typeof window !== "undefined" ? (window as any).shopify : undefined;
      shopify?.saveBar?.hide(resolvedSaveBarId);

      const cleanupPayload = {
        type: "COREX_APP_WINDOW_SAVE_BAR_SYNC",
        windowId,
        open: false,
      };

      const cleanupBc = getBrowserBroadcastChannel(CHANNEL_NAME);
      if (cleanupBc) {
        try {
          cleanupBc.postMessage(cleanupPayload);
          cleanupBc.close();
        } catch {
          // Ignore
        }
      }

      if (
        typeof window !== "undefined" &&
        window.parent &&
        window.parent !== window
      ) {
        window.parent.postMessage(cleanupPayload, "*");
      }
    };
  }, [resolvedSaveBarId, windowId]);

  // Listen for Save and Discard action messages from parent window
  useEffect(() => {
    const handleActionData = async (data: any) => {
      if (
        data &&
        typeof data === "object" &&
        data.type === "COREX_APP_WINDOW_SAVE_BAR_ACTION" &&
        (!data.windowId || data.windowId === windowId)
      ) {
        if (data.action === "save") {
          await onSaveRef.current?.();
        } else if (data.action === "discard") {
          await onDiscardRef.current?.();
        }
      }
    };

    const bc = getBrowserBroadcastChannel(CHANNEL_NAME);
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
  }, [windowId]);

  return useMemo(
    () => ({
      show() {
        const shopify =
          typeof window !== "undefined" ? (window as any).shopify : undefined;
        if (shopify?.saveBar?.show) {
          return shopify.saveBar.show(resolvedSaveBarId);
        }
        devWarning(
          "useAppWindowSaveBar",
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
          "useAppWindowSaveBar",
          "window.shopify is not available — the save bar only works inside a real embedded Shopify admin session.",
        );
      },
      leaveConfirmation() {
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

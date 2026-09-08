import { forwardRef, useEffect, useMemo, useRef, useState } from "react";
import { createWebComponent } from "../../core/createWebComponent";
import { mergeRefs } from "../../core/mergeRefs";
import { SaveBar } from "../SaveBar";
import type { AppWindowPropsType, AppWindowSaveBarConfigType } from "./AppWindow.types";

type AppWindowElement = HTMLElementTagNameMap["s-app-window"];

const SAppWindow = createWebComponent<AppWindowElement>("s-app-window");

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

/**
 * App Bridge component (see `docs/app-bridge.md`), wraps `<s-app-window>`.
 *
 * When `saveBar` prop is provided, automatically renders a `<SaveBar>` on the host
 * window and establishes a bidirectional bridge with `useAppWindowSaveBar` in the child iframe:
 * - State changes (`open`, `loading`, `disabled`) from the child iframe sync to the host SaveBar.
 * - Save and Discard clicks in the host SaveBar are forwarded to the child iframe.
 */
export const AppWindow = forwardRef<AppWindowElement, AppWindowPropsType>(
  function AppWindow({ src, id, saveBar, ...rest }, forwardedRef) {
    const innerRef = useRef<AppWindowElement>(null);
    const mergedRef = useMemo(() => mergeRefs(innerRef, forwardedRef), [forwardedRef]);

    const saveBarConfig: AppWindowSaveBarConfigType | undefined =
      typeof saveBar === "object" && saveBar !== null ? saveBar : undefined;

    const saveBarId = id ? `${id}-save-bar` : "corex-app-window-save-bar";

    const [childState, setChildState] = useState<{
      open?: boolean;
      loading?: boolean;
      disabled?: boolean;
      saveText?: string;
      discardText?: string;
    }>({});

    // Listen for sync messages from the child iframe via BroadcastChannel and window message
    useEffect(() => {
      if (!saveBar) return;

      const handleSyncData = (data: any) => {
        if (
          data &&
          typeof data === "object" &&
          data.type === "COREX_APP_WINDOW_SAVE_BAR_SYNC" &&
          (!data.windowId || data.windowId === id || data.windowId === saveBarId)
        ) {
          setChildState({
            open: data.open,
            loading: data.loading,
            disabled: data.disabled,
            saveText: data.saveText,
            discardText: data.discardText,
          });
        }
      };

      const bc = getBrowserBroadcastChannel(CHANNEL_NAME);
      if (bc) {
        bc.onmessage = (event) => handleSyncData(event.data);
      }

      const handleMessage = (event: MessageEvent) => {
        handleSyncData(event.data);
      };

      window.addEventListener("message", handleMessage);
      return () => {
        bc?.close();
        window.removeEventListener("message", handleMessage);
      };
    }, [saveBar, id, saveBarId]);

    const sendActionToChild = (action: "save" | "discard") => {
      const message = {
        type: "COREX_APP_WINDOW_SAVE_BAR_ACTION",
        action,
        windowId: id ?? saveBarId,
      };

      // 1. BroadcastChannel (reaches sibling and nested iframes across same-origin)
      const bc = getBrowserBroadcastChannel(CHANNEL_NAME);
      if (bc) {
        try {
          bc.postMessage(message);
          bc.close();
        } catch {
          // Ignore
        }
      }

      // 2. Post to iframe inside s-app-window if accessible
      const node = innerRef.current;
      const iframe =
        node?.querySelector("iframe") ??
        (node?.shadowRoot?.querySelector("iframe") as HTMLIFrameElement | null);

      if (iframe?.contentWindow) {
        iframe.contentWindow.postMessage(message, "*");
      }

      // 3. Also broadcast to child frames for robust delivery
      if (typeof window !== "undefined" && window.frames) {
        for (let i = 0; i < window.frames.length; i++) {
          try {
            window.frames[i]?.postMessage(message, "*");
          } catch {
            // Ignore potential cross-origin frame access errors
          }
        }
      }

      // 4. Post to current window as well (covers test environments and single-window setups)
      if (typeof window !== "undefined") {
        window.postMessage(message, "*");
      }
    };

    const handleSave = () => {
      saveBarConfig?.onSave?.();
      sendActionToChild("save");
    };

    const handleDiscard = () => {
      saveBarConfig?.onDiscard?.();
      sendActionToChild("discard");
    };

    return (
      <>
        <SAppWindow ref={mergedRef} id={id} src={src} {...rest} />
        {Boolean(saveBar) && (
          <SaveBar
            id={saveBarId}
            open={childState.open}
            loading={childState.loading}
            disabled={childState.disabled}
            saveText={childState.saveText ?? saveBarConfig?.saveText ?? "Save"}
            discardText={
              childState.discardText ?? saveBarConfig?.discardText ?? "Discard"
            }
            discardConfirmation={true}
            onSave={handleSave}
            onDiscard={handleDiscard}
          />
        )}
      </>
    );
  },
);

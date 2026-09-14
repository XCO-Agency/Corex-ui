import {
  forwardRef,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import { createWebComponent } from "../../core/createWebComponent";
import { mergeRefs } from "../../core/mergeRefs";
import { useDomEvent } from "../../core/useDomEvent";
import { Button } from "../Button";
import { SaveBar } from "../SaveBar";
import { TitleBar } from "../TitleBar";
import type { ModalPropsType, ModalSaveBarConfigType } from "./Modal.types";

type ModalElement = HTMLElement;

const SModal = createWebComponent<ModalElement>("s-modal");
const UiModal = createWebComponent<ModalElement>("ui-modal");

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

function showModal(node: ModalElement | null, id: string) {
  if (node) {
    if (typeof (node as any).showOverlay === "function") {
      (node as any).showOverlay();
      return;
    }
    if (typeof (node as any).show === "function") {
      (node as any).show();
      return;
    }
  }
  if (typeof window !== "undefined" && (window as any).shopify?.modal?.show) {
    try {
      const res = (window as any).shopify.modal.show(id);
      if (res && typeof res.catch === "function") {
        res.catch(() => {});
      }
    } catch {
      // ignore
    }
  }
}

function hideModal(node: ModalElement | null, id: string) {
  if (node) {
    if (typeof (node as any).hideOverlay === "function") {
      (node as any).hideOverlay();
      return;
    }
    if (typeof (node as any).hide === "function") {
      (node as any).hide();
      return;
    }
  }
  if (typeof window !== "undefined" && (window as any).shopify?.modal?.hide) {
    try {
      const res = (window as any).shopify.modal.hide(id);
      if (res && typeof res.catch === "function") {
        res.catch(() => {});
      }
    } catch {
      // ignore
    }
  }
}

/**
 * Composed / imperative-bridge pattern: legacy `Modal` is fully controlled
 * via `open`/`onClose`, but `s-modal` and `ui-modal` expose imperative
 * methods and the Commands API instead of an `open` attribute.
 *
 * This wrapper:
 * 1. Intelligently selects `<ui-modal>` when `variant` (e.g. `"max"`) or `src`
 *    is provided, and `<s-modal>` for standard Polaris modals.
 * 2. Manages modal visibility by bridging declarative React `open` to both
 *    custom element instance methods and `window.shopify.modal` APIs.
 * 3. Assigns a unique DOM ID to ensure commands and App Bridge can target it.
 * 4. Listens for native `hide`, `afterhide`, and `close` events to notify `onClose` and `onHide`.
 * 5. Supports automated contextual SaveBar attachment and bidirectional synchronization
 *    via `saveBar` prop or manual direct child `<SaveBar>`.
 */
export const Modal = forwardRef<ModalElement, ModalPropsType>(function Modal(
  {
    children,
    open,
    onClose,
    onHide,
    title,
    primaryAction,
    secondaryActions,
    accessibilityLabel,
    id,
    variant,
    src,
    saveBar,
    channel,
    ...rest
  },
  forwardedRef,
) {
  const generatedId = useId();
  const modalId = id ?? `corex-modal-${generatedId.replace(/:/g, "")}`;
  const saveBarId = `${modalId}-save-bar`;

  const innerRef = useRef<ModalElement>(null);
  const nodeRef = useRef<ModalElement | null>(null);
  const isOpenRef = useRef(open);
  const wasOpenedRef = useRef(false);

  isOpenRef.current = open;

  const setNodeRef = useCallback((node: ModalElement | null) => {
    if (node) {
      nodeRef.current = node;
    }
  }, []);

  const saveBarConfig: ModalSaveBarConfigType | undefined =
    typeof saveBar === "object" && saveBar !== null ? saveBar : undefined;

  const resolvedChannelName =
    saveBarConfig?.channel ?? channel ?? `corex-modal-${modalId}`;

  const [childState, setChildState] = useState<{
    open?: boolean;
    loading?: boolean;
    disabled?: boolean;
    saveText?: string;
    discardText?: string;
  }>({});

  useEffect(() => {
    const node = innerRef.current ?? nodeRef.current;
    if (open) {
      wasOpenedRef.current = true;
      showModal(node, modalId);
    } else if (wasOpenedRef.current) {
      hideModal(node, modalId);
    }
  }, [open, modalId]);

  // Handle unmount: hide modal and saveBar if unmounting while open
  useEffect(() => {
    return () => {
      if (isOpenRef.current) {
        hideModal(nodeRef.current, modalId);
      }
      if (saveBar) {
        const shopify = typeof window !== "undefined" ? (window as any).shopify : undefined;
        shopify?.saveBar?.hide(saveBarId);
      }
    };
  }, [modalId, saveBar, saveBarId]);

  const handleDismiss = useCallback(() => {
    if (isOpenRef.current) {
      onHide?.();
      onClose();
    }
    if (saveBar) {
      setChildState((prev) => (prev.open ? { ...prev, open: false } : prev));
      const shopify = typeof window !== "undefined" ? (window as any).shopify : undefined;
      shopify?.saveBar?.hide(saveBarId);
    }
  }, [onHide, onClose, saveBar, saveBarId]);

  useDomEvent(innerRef, "hide", handleDismiss);
  useDomEvent(innerRef, "afterhide", handleDismiss);
  useDomEvent(innerRef, "close", handleDismiss);

  // Sync state with child iframe if saveBar is active
  useEffect(() => {
    if (!saveBar) return;

    const handleSyncData = (data: any) => {
      if (!data || typeof data !== "object") return;

      // Handle Corex standard sync payload
      if (
        data.type === "COREX_MODAL_SAVE_BAR_SYNC" &&
        (!data.modalId || data.modalId === modalId || data.modalId === saveBarId)
      ) {
        setChildState({
          open: data.open ?? data.visible,
          loading: data.loading ?? data.saving,
          disabled: data.disabled,
          saveText: data.saveText,
          discardText: data.discardText,
        });
      }

      // Handle raw claimify / custom save-state pattern
      if (data.type === "claimify-save-state") {
        setChildState({
          open: !!data.visible,
          loading: !!data.saving,
          disabled: !!data.disabled,
        });
      }
    };

    const bc = getBrowserBroadcastChannel(resolvedChannelName);
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
  }, [saveBar, modalId, saveBarId, resolvedChannelName]);

  const sendActionToChild = useCallback(
    (action: "save" | "discard") => {
      const standardMessage = {
        type: "COREX_MODAL_SAVE_BAR_ACTION",
        action,
        modalId,
      };
      const rawMessage = {
        type: action === "save" ? "claimify-modal-save" : "claimify-modal-discard",
      };

      const bc = getBrowserBroadcastChannel(resolvedChannelName);
      if (bc) {
        try {
          bc.postMessage(standardMessage);
          bc.postMessage(rawMessage);
          bc.close();
        } catch {
          // ignore
        }
      }

      const node = innerRef.current;
      const iframe =
        node?.querySelector("iframe") ??
        (node?.shadowRoot?.querySelector("iframe") as HTMLIFrameElement | null);

      if (iframe?.contentWindow) {
        iframe.contentWindow.postMessage(standardMessage, "*");
        iframe.contentWindow.postMessage(rawMessage, "*");
      }

      if (typeof window !== "undefined" && window.frames) {
        for (let i = 0; i < window.frames.length; i++) {
          try {
            window.frames[i]?.postMessage(standardMessage, "*");
            window.frames[i]?.postMessage(rawMessage, "*");
          } catch {
            // ignore
          }
        }
      }

      if (typeof window !== "undefined") {
        window.postMessage(standardMessage, "*");
        window.postMessage(rawMessage, "*");
      }
    },
    [modalId, resolvedChannelName],
  );

  const handleHostSave = useCallback(async () => {
    await saveBarConfig?.onSave?.();
    sendActionToChild("save");
  }, [saveBarConfig, sendActionToChild]);

  const handleHostDiscard = useCallback(async () => {
    await saveBarConfig?.onDiscard?.();
    sendActionToChild("discard");
  }, [saveBarConfig, sendActionToChild]);

  const mergedRef = useMemo(
    () => mergeRefs(innerRef, setNodeRef, forwardedRef),
    [forwardedRef, setNodeRef],
  );

  const resolvedAccessibilityLabel =
    accessibilityLabel ?? (typeof title === "string" ? title : "Modal");

  const isAppBridgeModal = Boolean(variant || src);

  const actionsContent = (
    <>
      {primaryAction && (
        <Button
          slot="primary-action"
          variant="primary"
          tone={primaryAction.destructive ? "critical" : undefined}
          disabled={primaryAction.disabled}
          loading={primaryAction.loading}
          commandFor={primaryAction.command ? modalId : undefined}
          command={primaryAction.command}
          onClick={primaryAction.onAction}
        >
          {primaryAction.content}
        </Button>
      )}
      {secondaryActions?.map((action, i) => (
        <Button
          key={i}
          slot="secondary-actions"
          variant="secondary"
          tone={action.destructive ? "critical" : undefined}
          disabled={action.disabled}
          loading={action.loading}
          commandFor={modalId}
          command={action.command ?? "--hide"}
          onClick={action.onAction}
        >
          {action.content}
        </Button>
      ))}
    </>
  );

  const automatedSaveBar = Boolean(saveBar) && (
    <SaveBar
      id={saveBarId}
      open={childState.open}
      loading={childState.loading}
      disabled={childState.disabled}
      saveText={childState.saveText ?? saveBarConfig?.saveText ?? ""}
      discardText={childState.discardText ?? saveBarConfig?.discardText ?? ""}
      discardConfirmation={saveBarConfig?.discardConfirmation ?? true}
      onSave={handleHostSave}
      onDiscard={handleHostDiscard}
    />
  );

  if (isAppBridgeModal) {
    return (
      <UiModal
        ref={mergedRef}
        id={modalId}
        variant={variant}
        src={src}
        accessibilityLabel={resolvedAccessibilityLabel}
        {...rest}
      >
        {typeof title === "string" && <TitleBar title={title} />}
        {automatedSaveBar}
        {children}
        {actionsContent}
      </UiModal>
    );
  }

  return (
    <SModal
      ref={mergedRef}
      id={modalId}
      heading={title}
      accessibilityLabel={resolvedAccessibilityLabel}
      {...rest}
    >
      {automatedSaveBar}
      {children}
      {actionsContent}
    </SModal>
  );
});


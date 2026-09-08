import { forwardRef, useCallback, useEffect, useId, useMemo, useRef } from "react";
import { createWebComponent } from "../../core/createWebComponent";
import { mergeRefs } from "../../core/mergeRefs";
import { useDomEvent } from "../../core/useDomEvent";
import { Button } from "../Button";
import type { ModalPropsType } from "./Modal.types";

type ModalElement = HTMLElementTagNameMap["s-modal"];

const SModal = createWebComponent<ModalElement>("s-modal");

function showModal(node: ModalElement | null, id: string) {
  if (node) {
    if (typeof node.showOverlay === "function") {
      node.showOverlay();
    } else if (typeof (node as any).show === "function") {
      (node as any).show();
    }
  }
  if (typeof window !== "undefined" && (window as any).shopify?.modal?.show) {
    (window as any).shopify.modal.show(id);
  }
}

function hideModal(node: ModalElement | null, id: string) {
  if (node) {
    if (typeof node.hideOverlay === "function") {
      node.hideOverlay();
    } else if (typeof (node as any).hide === "function") {
      (node as any).hide();
    }
  }
  if (typeof window !== "undefined" && (window as any).shopify?.modal?.hide) {
    (window as any).shopify.modal.hide(id);
  }
}

/**
 * Composed / imperative-bridge pattern: legacy `Modal` is fully controlled
 * via `open`/`onClose`, but `s-modal` exposes imperative `showOverlay()` /
 * `hideOverlay()` methods and the Commands API instead of an `open` attribute.
 *
 * This wrapper:
 * 1. Manages modal visibility by bridging declarative React `open` to both
 *    custom element instance methods and `window.shopify.modal` APIs.
 * 2. Assigns a unique DOM ID to ensure commands and App Bridge can target it.
 * 3. Binds `command="--hide"` and `commandFor={modalId}` to secondary actions so
 *    footer buttons (e.g. Cancel/Close) trigger native dismissal in Shopify admin.
 * 4. Ensures cleanup on unmount so overlays are not orphaned when parents unmount.
 * 5. Listens for native `hide` and `afterhide` events to notify `onClose`.
 */
export const Modal = forwardRef<ModalElement, ModalPropsType>(function Modal(
  {
    children,
    open,
    onClose,
    title,
    primaryAction,
    secondaryActions,
    accessibilityLabel,
    id,
    ...rest
  },
  forwardedRef,
) {
  const generatedId = useId();
  const modalId = id ?? `corex-modal-${generatedId.replace(/:/g, "")}`;

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

  useEffect(() => {
    const node = innerRef.current ?? nodeRef.current;
    if (open) {
      wasOpenedRef.current = true;
      showModal(node, modalId);
    } else if (wasOpenedRef.current) {
      hideModal(node, modalId);
    }
  }, [open, modalId]);

  // Handle unmount: if the component unmounts while open (e.g. conditional rendering),
  // hide the overlay so it doesn't get stuck in the Shopify admin shell.
  useEffect(() => {
    return () => {
      if (isOpenRef.current) {
        hideModal(nodeRef.current, modalId);
      }
    };
  }, [modalId]);

  const handleDismiss = useCallback(() => {
    if (isOpenRef.current) {
      onClose();
    }
  }, [onClose]);

  useDomEvent(innerRef, "hide", handleDismiss);
  useDomEvent(innerRef, "afterhide", handleDismiss);

  const mergedRef = useMemo(
    () => mergeRefs(innerRef, setNodeRef, forwardedRef),
    [forwardedRef, setNodeRef],
  );

  const resolvedAccessibilityLabel =
    accessibilityLabel ?? (typeof title === "string" ? title : "Modal");

  return (
    <SModal
      ref={mergedRef}
      id={modalId}
      heading={title}
      accessibilityLabel={resolvedAccessibilityLabel}
      {...rest}
    >
      {children}
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
    </SModal>
  );
});

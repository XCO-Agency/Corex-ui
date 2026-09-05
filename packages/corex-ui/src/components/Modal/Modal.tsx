import { forwardRef, useEffect, useRef } from "react";
import { createWebComponent } from "../../core/createWebComponent";
import { mergeRefs } from "../../core/mergeRefs";
import { useDomEvent } from "../../core/useDomEvent";
import { Button } from "../Button";
import type { ModalPropsType } from "./Modal.types";

type ModalElement = HTMLElementTagNameMap["s-modal"];

const SModal = createWebComponent<ModalElement>("s-modal");

/**
 * Composed / imperative-bridge pattern: legacy `Modal` is fully controlled
 * via `open`/`onClose`, but `s-modal` exposes imperative `show()` /
 * `hideOverlay()` methods instead of an `open` attribute. This wrapper
 * watches `open` in an effect and calls the matching method, and listens for
 * the element's native `close` event (user dismissal via Escape/backdrop) to
 * call `onClose` back — bridging declarative React state onto an imperative
 * DOM API in both directions.
 */
export const Modal = forwardRef<ModalElement, ModalPropsType>(function Modal(
  { children, open, onClose, title, primaryAction, secondaryActions, ...rest },
  forwardedRef,
) {
  const innerRef = useRef<ModalElement>(null);

  useEffect(() => {
    const node = innerRef.current;
    if (!node) return;
    if (open) {
      node.showOverlay?.();
    } else {
      node.hideOverlay?.();
    }
  }, [open]);

  useDomEvent(innerRef, "hide", () => onClose());

  return (
    <SModal ref={mergeRefs(innerRef, forwardedRef)} heading={title} {...rest}>
      {children}
      {primaryAction && (
        <Button
          slot="primary-action"
          variant="primary"
          tone={primaryAction.destructive ? "critical" : undefined}
          disabled={primaryAction.disabled}
          loading={primaryAction.loading}
          onClick={primaryAction.onAction}
        >
          {primaryAction.content}
        </Button>
      )}
      {secondaryActions?.map((action, i) => (
        <Button
          key={i}
          slot="secondary-actions"
          tone={action.destructive ? "critical" : undefined}
          disabled={action.disabled}
          loading={action.loading}
          onClick={action.onAction}
        >
          {action.content}
        </Button>
      ))}
    </SModal>
  );
});

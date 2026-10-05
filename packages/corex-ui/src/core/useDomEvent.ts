import { useRef } from "react";
import type { RefObject } from "react";
import type { DomEventHandler } from "./types";
import { useIsomorphicLayoutEffect } from "./useIsomorphicLayoutEffect";

/**
 * Binds a native DOM event listener to a ref'd element. The handler is kept
 * in a ref so the actual `addEventListener` subscription is created once per
 * (element, eventName) pair rather than on every render, avoiding stale
 * closures without needing to resubscribe when the caller passes a new
 * inline function each render.
 *
 * The listener is attached in a layout effect so it is in place before the
 * browser paints: a custom element that fires an event as soon as it upgrades
 * (an initial `change`, say) is not missed.
 *
 * The ref must point at an element that is rendered for the whole lifetime of
 * the calling component; the subscription is not moved if the node changes.
 */
export function useDomEvent<T extends Element>(
  ref: RefObject<T | null>,
  eventName: string | undefined,
  handler: DomEventHandler | undefined,
): void {
  const handlerRef = useRef(handler);
  handlerRef.current = handler;

  useIsomorphicLayoutEffect(() => {
    const node = ref.current;
    if (!node || !eventName) return;

    const listener = (event: Event) => {
      handlerRef.current?.(event);
    };

    node.addEventListener(eventName, listener);
    return () => node.removeEventListener(eventName, listener);
  }, [ref, eventName]);
}

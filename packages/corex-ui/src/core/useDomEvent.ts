import { useEffect, useRef } from "react";
import type { RefObject } from "react";
import type { DomEventHandler } from "./types";

/**
 * Binds a native DOM event listener to a ref'd element. The handler is kept
 * in a ref so the actual `addEventListener` subscription is created once per
 * (element, eventName) pair rather than on every render, avoiding stale
 * closures without needing to resubscribe when the caller passes a new
 * inline function each render.
 */
export function useDomEvent<T extends Element>(
  ref: RefObject<T | null>,
  eventName: string | undefined,
  handler: DomEventHandler | undefined,
): void {
  const handlerRef = useRef(handler);
  handlerRef.current = handler;

  useEffect(() => {
    const node = ref.current;
    if (!node || !eventName) return;

    const listener = (event: Event) => {
      handlerRef.current?.(event);
    };

    node.addEventListener(eventName, listener);
    return () => node.removeEventListener(eventName, listener);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref.current, eventName]);
}

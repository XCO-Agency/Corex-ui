import { useEffect, useRef } from "react";
import { useIsomorphicLayoutEffect } from "./useIsomorphicLayoutEffect";

const STYLE_ID = "cx-stack-scrollbar-styles";
const SCROLLING_CLASS = "cx-stack-scroll--scrolling";
/** How long the thumb stays visible after the last scroll event. */
const HIDE_DELAY_MS = 800;

export const STACK_SCROLL_CLASS = "cx-stack-scroll";
export const STACK_SCROLL_HIDDEN_CLASS = "cx-stack-scroll--hidden";

/**
 * 3px overlay-style thumb, transparent until the container scrolls.
 * Chromium and Safari use `::-webkit-scrollbar`, which Chromium ignores as soon
 * as the standard `scrollbar-width`/`scrollbar-color` are set, so those are
 * limited to Firefox (it cannot go thinner than `thin`).
 */
const STACK_SCROLLBAR_CSS = `
.${STACK_SCROLL_CLASS}::-webkit-scrollbar { width: 3px; height: 3px; }
.${STACK_SCROLL_CLASS}::-webkit-scrollbar-track,
.${STACK_SCROLL_CLASS}::-webkit-scrollbar-corner { background: transparent; }
.${STACK_SCROLL_CLASS}::-webkit-scrollbar-thumb {
  background: transparent;
  border-radius: 999px;
}
.${STACK_SCROLL_CLASS}.${SCROLLING_CLASS}::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.3);
}
@supports (-moz-appearance: none) {
  .${STACK_SCROLL_CLASS} {
    scrollbar-width: thin;
    scrollbar-color: transparent transparent;
  }
  .${STACK_SCROLL_CLASS}.${SCROLLING_CLASS} {
    scrollbar-color: rgba(0, 0, 0, 0.3) transparent;
  }
}
.${STACK_SCROLL_HIDDEN_CLASS} { scrollbar-width: none; }
.${STACK_SCROLL_HIDDEN_CLASS}::-webkit-scrollbar { display: none; }
`;

/**
 * Adds the shared stylesheet to the document the element actually lives in
 * (which differs from the global `document` inside iframes and portals), once.
 */
function ensureStyles(node: HTMLElement | null) {
  const doc = node?.ownerDocument;
  if (!doc || doc.getElementById(STYLE_ID)) return;
  const style = doc.createElement("style");
  style.id = STYLE_ID;
  style.textContent = STACK_SCROLLBAR_CSS;
  doc.head.appendChild(style);
}

/**
 * Gives a scrollable stack the minimalist scrollbar: the thumb only shows while
 * the user is scrolling. Does nothing unless `enabled` (i.e. an overflow prop
 * is set), so plain stacks pay no listener cost.
 */
export function useStackScrollbar(enabled: boolean) {
  const nodeRef = useRef<HTMLElement | null>(null);

  useIsomorphicLayoutEffect(() => {
    if (enabled) ensureStyles(nodeRef.current);
  }, [enabled]);

  useEffect(() => {
    const node = nodeRef.current;
    if (!enabled || !node) return;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const onScroll = () => {
      node.classList.add(SCROLLING_CLASS);
      clearTimeout(timer);
      timer = setTimeout(() => node.classList.remove(SCROLLING_CLASS), HIDE_DELAY_MS);
    };
    node.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      clearTimeout(timer);
      node.removeEventListener("scroll", onScroll);
      node.classList.remove(SCROLLING_CLASS);
    };
  }, [enabled]);

  return nodeRef;
}

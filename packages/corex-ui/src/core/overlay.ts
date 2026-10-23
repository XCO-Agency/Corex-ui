import { useEffect, useLayoutEffect, useRef, useState } from "react";
import type { RefObject } from "react";

/**
 * Dependency-free overlay primitives shared by Drawer and Command.Dialog:
 * enter/exit presence, a layer stack for Escape / outside press, focus
 * containment and scroll locking. Everything works against the document the
 * overlay lives in, so iframe-hosted overlays behave like top-level ones.
 */

const useClientLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

export type PresencePhaseType = "starting" | "open" | "ending";

/**
 * Keeps an overlay mounted through its exit transition and exposes the phase
 * as `data-starting-style` / `data-ending-style` hooks for CSS. The exit ends
 * on the node's `transitionend`, or after `fallbackMs` when nothing animates.
 */
export function usePresence(
  open: boolean,
  nodeRef: RefObject<HTMLElement | null>,
  options: { fallbackMs?: number; onExitComplete?: () => void } = {},
): { mounted: boolean; phase: PresencePhaseType } {
  const { fallbackMs = 500 } = options;
  const [mounted, setMounted] = useState(open);
  const [phase, setPhase] = useState<PresencePhaseType>(open ? "starting" : "ending");
  const onExitRef = useRef(options.onExitComplete);
  onExitRef.current = options.onExitComplete;

  useClientLayoutEffect(() => {
    if (open) {
      setMounted(true);
      setPhase("starting");
      // Two frames: the first paints the closed style, the second starts the transition.
      let second = 0;
      const first = requestAnimationFrame(() => {
        second = requestAnimationFrame(() => setPhase("open"));
      });
      return () => {
        cancelAnimationFrame(first);
        cancelAnimationFrame(second);
      };
    }
    if (!mounted) return undefined;
    setPhase("ending");
    const node = nodeRef.current;
    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      setMounted(false);
      onExitRef.current?.();
    };
    const handleEnd = (event: TransitionEvent) => {
      if (event.target === node) finish();
    };
    node?.addEventListener("transitionend", handleEnd);
    const timer = window.setTimeout(finish, fallbackMs);
    return () => {
      node?.removeEventListener("transitionend", handleEnd);
      window.clearTimeout(timer);
    };
    // `mounted` is read, not tracked: only `open` drives the lifecycle.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  return { mounted, phase };
}

/** `data-*` attributes for a presence phase. */
export function presenceAttributes(phase: PresencePhaseType) {
  return {
    "data-open": phase !== "ending" ? "" : undefined,
    "data-closed": phase === "ending" ? "" : undefined,
    "data-starting-style": phase === "starting" ? "" : undefined,
    "data-ending-style": phase === "ending" ? "" : undefined,
  };
}

// Open overlays, innermost last. Only the top layer reacts to Escape and outside presses.
const layers: string[] = [];

export function isTopLayer(id: string): boolean {
  return layers[layers.length - 1] === id;
}

/**
 * Registers an open overlay layer. Escape and presses outside `getInside()`
 * nodes call the handlers, but only while this layer is the topmost one, so
 * a nested drawer closes before its parent.
 */
export function useDismissableLayer(options: {
  id: string;
  active: boolean;
  doc: Document | null;
  getInside: () => Array<Element | null | undefined>;
  onEscape: (event: KeyboardEvent) => void;
  onOutsidePress?: (event: PointerEvent) => void;
}) {
  const optionsRef = useRef(options);
  optionsRef.current = options;
  const { id, active, doc } = options;

  useEffect(() => {
    if (!active || !doc) return undefined;
    layers.push(id);

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape" || event.defaultPrevented || !isTopLayer(id)) return;
      event.preventDefault();
      optionsRef.current.onEscape(event);
    };
    const handlePointerDown = (event: PointerEvent) => {
      const { onOutsidePress, getInside } = optionsRef.current;
      if (!onOutsidePress || !isTopLayer(id)) return;
      const target = event.target as Node | null;
      if (!target) return;
      // Composed path so presses inside web components' shadow trees count as inside.
      const path = typeof event.composedPath === "function" ? event.composedPath() : [target];
      const inside = getInside().some(
        (node) => node && (path.includes(node) || node.contains(target)),
      );
      if (!inside) onOutsidePress(event);
    };

    doc.addEventListener("keydown", handleKeyDown);
    doc.addEventListener("pointerdown", handlePointerDown, true);
    return () => {
      doc.removeEventListener("keydown", handleKeyDown);
      doc.removeEventListener("pointerdown", handlePointerDown, true);
      const index = layers.lastIndexOf(id);
      if (index !== -1) layers.splice(index, 1);
    };
  }, [id, active, doc]);
}

/**
 * Moves focus into `nodeRef` when activated and keeps it there: focus that
 * lands outside while this layer is on top is pulled back to the panel.
 * Focus returns to whatever was focused before, once deactivated.
 */
export function useFocusContainment(
  nodeRef: RefObject<HTMLElement | null>,
  options: {
    id: string;
    active: boolean;
    trap: boolean;
    /** `"panel"` focuses the panel itself; `"first-field"` the first text field (e.g. a search input). */
    initialFocus?: "panel" | "first-field";
  },
) {
  const { id, active, trap, initialFocus = "panel" } = options;

  useEffect(() => {
    const node = nodeRef.current;
    if (!active || !node) return undefined;
    const doc = node.ownerDocument;
    const previous = doc.activeElement as HTMLElement | null;

    if (!node.contains(doc.activeElement)) {
      const autofocus =
        node.querySelector<HTMLElement>("[autofocus], [data-autofocus]") ??
        (initialFocus === "first-field"
          ? node.querySelector<HTMLElement>("input:not([type=hidden]):not([disabled]), textarea:not([disabled])")
          : null);
      (autofocus ?? node).focus({ preventScroll: true });
    }

    const handleFocusIn = (event: FocusEvent) => {
      if (!trap || !isTopLayer(id)) return;
      const target = event.target as Node | null;
      if (target && !node.contains(target)) node.focus({ preventScroll: true });
    };
    doc.addEventListener("focusin", handleFocusIn);

    return () => {
      doc.removeEventListener("focusin", handleFocusIn);
      if (previous && previous.isConnected && typeof previous.focus === "function") {
        previous.focus({ preventScroll: true });
      }
    };
  }, [nodeRef, id, active, trap, initialFocus]);
}

const lockCounts = new WeakMap<Document, { count: number; overflow: string; paddingRight: string }>();

/** Locks page scroll on `doc` while active; nested locks are reference counted. */
export function useScrollLock(doc: Document | null, active: boolean) {
  useEffect(() => {
    if (!active || !doc) return undefined;
    const root = doc.documentElement;
    const body = doc.body;
    const existing = lockCounts.get(doc);
    if (existing) {
      existing.count += 1;
    } else {
      const view = doc.defaultView;
      const scrollbar = view ? view.innerWidth - root.clientWidth : 0;
      lockCounts.set(doc, { count: 1, overflow: root.style.overflow, paddingRight: body.style.paddingRight });
      root.style.overflow = "hidden";
      if (scrollbar > 0) body.style.paddingRight = `${scrollbar}px`;
    }
    return () => {
      const entry = lockCounts.get(doc);
      if (!entry) return;
      entry.count -= 1;
      if (entry.count > 0) return;
      root.style.overflow = entry.overflow;
      body.style.paddingRight = entry.paddingRight;
      lockCounts.delete(doc);
    };
  }, [doc, active]);
}

/** Controlled when `open` is defined, otherwise uncontrolled from `defaultOpen`. */
export function useOpenState<ReasonType extends string>(
  open: boolean | undefined,
  defaultOpen: boolean | undefined,
  onOpenChange: ((open: boolean, details: { reason: ReasonType }) => void) | undefined,
): [boolean, (next: boolean, reason: ReasonType) => void] {
  const [internal, setInternal] = useState(Boolean(defaultOpen));
  const controlled = open !== undefined;
  const value = controlled ? open : internal;
  const onChangeRef = useRef(onOpenChange);
  onChangeRef.current = onOpenChange;
  const controlledRef = useRef(controlled);
  controlledRef.current = controlled;
  const valueRef = useRef(value);
  valueRef.current = value;

  const setOpen = useRef((next: boolean, reason: ReasonType) => {
    if (next === valueRef.current) return;
    if (!controlledRef.current) setInternal(next);
    onChangeRef.current?.(next, { reason });
  }).current;

  return [value, setOpen];
}

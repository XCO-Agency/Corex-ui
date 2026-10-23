import {
  Children,
  createContext,
  isValidElement,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type ReactElement,
  type RefObject,
} from "react";
import { useIsomorphicLayoutEffect } from "../../core/useIsomorphicLayoutEffect";
import { useDismissableLayer } from "../../core/overlay";
import { createPortal } from "react-dom";

import { BlockStack } from "../BlockStack";
import { Button } from "../Button";
import { Card } from "../Card";
import { Divider } from "../Divider";
import { InlineStack } from "../InlineStack";
import { Text } from "../Text";
import {
  flexPopoverAnchorBox,
  flexPopoverHoverBridge,
  parseFlexPopoverPosition,
  placeFlexPopover,
  pointerInFlexPopoverBridge,
  toPopoverRect,
} from "./FlexPopover.placement";
import type {
  FlexPopoverComponentType,
  FlexPopoverCompoundPropsType,
  FlexPopoverContentPropsType,
  FlexPopoverPropsType,
  FlexPopoverRootPropsType,
  FlexPopoverTriggerPropsType,
} from "./FlexPopover.types";

/** Default gap (px) between the anchor and the popover. */
const DEFAULT_OFFSET = 8;
/** Minimum distance (px) kept between the popover and the viewport edges. */
const VIEWPORT_MARGIN = 12;
/** Wait before hover-close so the pointer can cross `offset`. */
const DEFAULT_CLOSE_DELAY = 150;
const STYLE_ELEMENT_ID = "corex-flex-popover-styles";
const SHADOW_STYLE_ATTR = "data-corex-flex-popover-styles";
/**
 * Critical resets use `!important` so host-site popover rules cannot add a
 * second border or padding layer. The sheet is installed in the same document
 * or existing shadow root as the trigger; FlexPopover never creates its own
 * shadow boundary.
 */
const POPOVER_CSS = `
.corex-native-popover {
  padding: 0 !important;
  margin: 0 !important;
  background: transparent !important;
  border: none !important;
  box-sizing: border-box !important;
  opacity: 0 !important;
  transform: translate(var(--corex-popover-enter-x, 0px), var(--corex-popover-enter-y, -4px)) scale(0.97) !important;
  transform-origin: var(--corex-popover-origin, left top) !important;
  transition:
    opacity 140ms ease,
    transform 140ms ease !important;
}

.corex-native-popover:popover-open,
.corex-native-popover.corex-native-popover-open {
  opacity: 1 !important;
  transform: translate(0) scale(1) !important;
}

.corex-native-popover.corex-native-popover--measure {
  transition: none !important;
  opacity: 0 !important;
  transform: none !important;
}

@starting-style {
  .corex-native-popover:popover-open {
    opacity: 0 !important;
    transform: translate(var(--corex-popover-enter-x, 0px), var(--corex-popover-enter-y, -4px)) scale(0.97) !important;
  }
}

@media (prefers-reduced-motion: reduce) {
  .corex-native-popover {
    transition: none !important;
  }
}
`;

type FlexPopoverMountTargetType = HTMLElement | ShadowRoot;

function isShadowRoot(node: Node, doc: Document): node is ShadowRoot {
  const ShadowRootConstructor = doc.defaultView?.ShadowRoot;
  return Boolean(ShadowRootConstructor && node instanceof ShadowRootConstructor);
}

function ensureFlexPopoverStyles(target: FlexPopoverMountTargetType, doc: Document) {
  const styleParent = isShadowRoot(target, doc) ? target : doc.head;
  const existing = isShadowRoot(target, doc)
    ? target.querySelector<HTMLStyleElement>(`style[${SHADOW_STYLE_ATTR}]`)
    : doc.getElementById(STYLE_ELEMENT_ID);

  if (existing) {
    if (existing.textContent !== POPOVER_CSS) existing.textContent = POPOVER_CSS;
    return;
  }

  const style = doc.createElement("style");
  if (isShadowRoot(target, doc)) style.setAttribute(SHADOW_STYLE_ATTR, "");
  else style.id = STYLE_ELEMENT_ID;
  style.textContent = POPOVER_CSS;
  styleParent.appendChild(style);
}

/**
 * A popover rendered inside another one's content, such as a submenu. It is portalled
 * out of the parent's DOM, so the parent registers it to treat the pointer and clicks
 * inside it as still inside the parent, and stays open while the child is in use.
 */
type FlexPopoverChild = {
  contains: (node: Node) => boolean;
  hovered: () => boolean;
};
const FlexPopoverNestContext = createContext<{
  register: (child: FlexPopoverChild) => () => void;
} | null>(null);

/** Frames to keep retrying placement while the anchor has no layout yet (~1s). */
const MAX_POSITION_FRAMES = 60;

/**
 * Controlled popover portalled into the trigger's existing root and shown with
 * `popover="manual"` (top layer, no native light-dismiss).
 *
 * A document-root trigger uses its owner document's body. A trigger already in
 * a shadow root keeps the panel in that root so CSS variables and ARIA ID
 * references remain scoped correctly. No extra shadow root is introduced.
 */
function FlexPopoverBase({
  anchorId,
  anchorRef,
  isOpen,
  onClose,
  onOpen,
  heading,
  closeAccessibilityLabel,
  noHeader,
  padding = "none",
  width,
  minWidth,
  maxHeight,
  offset = DEFAULT_OFFSET,
  position = "bottom-start",
  matchAnchorWidth = false,
  openOnHover = false,
  closeDelay = DEFAULT_CLOSE_DELAY,
  boundaryRef,
  boundarySelector,
  className = "",
  style: customStyle,
  zIndex = 999999,
  children,
}: FlexPopoverPropsType) {
  const layerId = `corex-flex-popover-${useId().replace(/:/g, "")}`;
  const markerRef = useRef<HTMLSpanElement | null>(null);
  const popoverRef = useRef<HTMLDivElement | null>(null);
  const initialPlacement = parseFlexPopoverPosition(position);
  const placedSideRef = useRef(initialPlacement.side);
  const [motion, setMotion] = useState(() => {
    const placed = placeFlexPopover({
      position,
      anchor: { top: 400, left: 400, right: 480, bottom: 440, width: 80, height: 40 },
      popoverWidth: 80,
      popoverHeight: 40,
      offset: DEFAULT_OFFSET,
      viewportWidth: 1200,
      viewportHeight: 900,
      margin: VIEWPORT_MARGIN,
    });
    return {
      transformOrigin: placed.transformOrigin,
      enterX: placed.enterX,
      enterY: placed.enterY,
    };
  });
  /**
   * Existing root used for the portal. Starts null so the first client render
   * matches the server (no portal); the layout effect resolves it before paint.
   */
  const [mountTarget, setMountTarget] = useState<FlexPopoverMountTargetType | null>(null);
  const [isPopoverSupported, setIsPopoverSupported] = useState(false);
  /**
   * Kept in React state. Writing `top` on the node and also setting the `inset`
   * shorthand from the style prop makes the next render clear the coordinates.
   */
  const [coords, setCoords] = useState<{ top: number; left: number } | null>(null);

  // Reuse the trigger's current root; do not create a second shadow boundary.
  useIsomorphicLayoutEffect(() => {
    const marker = markerRef.current;
    const doc = marker?.ownerDocument;
    if (!marker || !doc?.body) return;

    const root = marker.getRootNode();
    const target = isShadowRoot(root, doc) ? root : doc.body;
    ensureFlexPopoverStyles(target, doc);
    if (target !== mountTarget) setMountTarget(target);
    setIsPopoverSupported(
      typeof doc.defaultView?.HTMLElement.prototype.showPopover === "function",
    );
  }, [mountTarget]);

  const getAnchor = useCallback((): HTMLElement | null => {
    if (anchorRef?.current) return anchorRef.current;
    const marker = markerRef.current;
    if (!anchorId || !marker) return null;
    const root = marker.getRootNode();
    const scopedAnchor =
      "getElementById" in root
        ? (root as Document | ShadowRoot).getElementById(anchorId)
        : null;
    return scopedAnchor ?? marker.ownerDocument.getElementById(anchorId);
  }, [anchorId, anchorRef]);

  // Keep a stable ref so positioning/cleanup listeners don't churn on every render
  const getAnchorRef = useRef(getAnchor);
  getAnchorRef.current = getAnchor;

  // Reposition whenever opened or the anchor moves/resizes
  useIsomorphicLayoutEffect(() => {
    if (!isOpen) return;

    const ownerDocument = markerRef.current?.ownerDocument;
    const ownerWindow = ownerDocument?.defaultView;
    if (!ownerDocument || !ownerWindow) return;

    let retryFrame = 0;
    let frameId: number | null = null;

    const updatePosition = () => {
      const popover = popoverRef.current;
      const host = getAnchorRef.current();
      const anchor = host ? flexPopoverAnchorBox(host) : null;
      if (!popover || !anchor) {
        // Retry for a few frames while the popover and anchor are rendering/mounting
        if (retryFrame < MAX_POSITION_FRAMES) {
          retryFrame++;
          frameId = ownerWindow.requestAnimationFrame(updatePosition);
        }
        return;
      }

      // A closed popover is `display: none` until it is shown, so its box is
      // empty. Show it before measuring or the panel is placed with height 0.
      if (typeof popover.showPopover === "function") {
        try {
          if (!popover.matches(":popover-open")) popover.showPopover();
        } catch {
          // Ignored if already showing or the Popover API rejects the call.
        }
      }

      const anchorRect = anchor.getBoundingClientRect();
      if (anchorRect.width === 0 && anchorRect.height === 0) {
        if (retryFrame < MAX_POSITION_FRAMES) {
          retryFrame++;
          frameId = ownerWindow.requestAnimationFrame(updatePosition);
        }
        return;
      }

      const doc = anchor.ownerDocument;
      const win = doc.defaultView ?? ownerWindow;
      const viewportWidth = win.innerWidth;
      const viewportHeight = win.innerHeight;

      popover.style.width = matchAnchorWidth
        ? `${anchorRect.width}px`
        : (width ?? "auto");

      // `offset*` is the layout box. A closed popover is `display: none`, so force
      // a box for this read; getBoundingClientRect is only a fallback where layout
      // is mocked. Freeze the enter transform so scale(0.97) does not shrink the
      // measured size (that mis-clamp placed wide panels off-screen on open).
      const previousDisplay = popover.style.display;
      if (popover.offsetWidth === 0 || popover.offsetHeight === 0) {
        popover.style.display = "block";
      }
      popover.classList.add("corex-native-popover--measure");
      const popoverRect = popover.getBoundingClientRect();
      const popoverWidth = popover.offsetWidth || popoverRect.width;
      const popoverHeight = popover.offsetHeight || popoverRect.height;
      popover.classList.remove("corex-native-popover--measure");
      popover.style.display = previousDisplay;
      if (popoverWidth === 0 || popoverHeight === 0) {
        if (retryFrame < MAX_POSITION_FRAMES) {
          retryFrame++;
          frameId = ownerWindow.requestAnimationFrame(updatePosition);
        }
        return;
      }

      const rtl = win.getComputedStyle(anchor).direction === "rtl";
      const placement = placeFlexPopover({
        position,
        anchor: toPopoverRect(anchorRect),
        popoverWidth,
        popoverHeight,
        offset,
        viewportWidth,
        viewportHeight,
        margin: VIEWPORT_MARGIN,
        rtl,
      });

      placedSideRef.current = placement.side;
      setMotion((current) =>
        current.transformOrigin === placement.transformOrigin &&
        current.enterX === placement.enterX &&
        current.enterY === placement.enterY
          ? current
          : {
              transformOrigin: placement.transformOrigin,
              enterX: placement.enterX,
              enterY: placement.enterY,
            },
      );

      popover.style.visibility = "visible";
      setCoords((current) =>
        current && current.top === placement.top && current.left === placement.left
          ? current
          : { top: placement.top, left: placement.left },
      );
    };

    updatePosition();

    const anchorEl = getAnchorRef.current();
    const anchorBox = anchorEl ? flexPopoverAnchorBox(anchorEl) : null;
    const doc = anchorEl?.ownerDocument ?? ownerDocument;
    const win = doc.defaultView ?? ownerWindow;

    win.addEventListener("resize", updatePosition);
    win.addEventListener("scroll", updatePosition, true);

    let resizeObserver: ResizeObserver | null = null;
    const ResizeObserverConstructor = win.ResizeObserver;
    if (typeof ResizeObserverConstructor === "function") {
      resizeObserver = new ResizeObserverConstructor(updatePosition);
      if (anchorEl) resizeObserver.observe(anchorEl);
      if (anchorBox && anchorBox !== anchorEl) resizeObserver.observe(anchorBox);
      if (popoverRef.current) resizeObserver.observe(popoverRef.current);
    }

    return () => {
      if (frameId !== null) ownerWindow.cancelAnimationFrame(frameId);
      win.removeEventListener("resize", updatePosition);
      win.removeEventListener("scroll", updatePosition, true);
      resizeObserver?.disconnect();
    };
  }, [
    isOpen,
    offset,
    position,
    matchAnchorWidth,
    width,
    anchorId,
    anchorRef,
    mountTarget,
  ]);

  // Sync with browser's native Popover API (manual mode = top layer, no light dismiss)
  useIsomorphicLayoutEffect(() => {
    const popover = popoverRef.current;
    if (!popover || !isPopoverSupported) return;

    if (isOpen) {
      try {
        popover.showPopover();
      } catch {
        // Ignored if already showing
      }
    } else {
      try {
        popover.hidePopover();
      } catch {
        // Ignored if already hidden
      }
    }
  }, [isOpen, isPopoverSupported, mountTarget]);

  // Dismissal: Escape, or pointer-down outside popover, anchor and boundary.
  // The shared layer primitive ensures a nested popover closes before its parent.
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;
  const onOpenRef = useRef(onOpen);
  onOpenRef.current = onOpen;
  const isOpenRef = useRef(isOpen);
  isOpenRef.current = isOpen;
  const parentNest = useContext(FlexPopoverNestContext);
  const nestedRef = useRef(new Set<FlexPopoverChild>());
  const nest = useMemo(
    () => ({
      register: (child: FlexPopoverChild) => {
        nestedRef.current.add(child);
        return () => {
          nestedRef.current.delete(child);
        };
      },
    }),
    [],
  );
  const nestedContains = (node: Node) =>
    [...nestedRef.current].some((child) => child.contains(node));
  const nestedHovered = () => [...nestedRef.current].some((child) => child.hovered());
  const popoverContains = (node: Node | null | undefined) => {
    if (!node) return false;
    return Boolean(popoverRef.current?.contains(node) || nestedContains(node));
  };
  const pathHitsPopover = (event: Event) => {
    const path = typeof event.composedPath === "function" ? event.composedPath() : [];
    const panel = popoverRef.current;
    if (panel && path.includes(panel)) return true;
    return path.some(
      (entry) =>
        typeof (entry as Node | undefined)?.nodeType === "number" &&
        nestedContains(entry as Node),
    );
  };

  const dismissDocument = markerRef.current?.ownerDocument ?? null;
  const boundaryElements = () => {
    if (!boundarySelector || !dismissDocument) return [];
    try {
      const root = markerRef.current?.getRootNode();
      const fromDocument = Array.from(dismissDocument.querySelectorAll(boundarySelector));
      const queryRoot = root as ParentNode | undefined;
      const fromRoot =
        queryRoot && root !== dismissDocument && queryRoot.querySelectorAll
          ? Array.from(queryRoot.querySelectorAll(boundarySelector))
          : [];
      return [...fromDocument, ...fromRoot];
    } catch {
      return [];
    }
  };
  useDismissableLayer({
    id: layerId,
    active: isOpen && Boolean(mountTarget),
    doc: dismissDocument,
    getInside: () => [
      popoverRef.current,
      getAnchorRef.current(),
      boundaryRef?.current,
      ...boundaryElements(),
    ],
    onEscape: () => onCloseRef.current(),
    onOutsidePress: () => onCloseRef.current(),
  });
  /** Set while hover is bound: whether the pointer is on this popover, its anchor or the gap between. */
  const hoverProbeRef = useRef<() => boolean>(() => false);
  useEffect(
    () =>
      parentNest?.register({
        contains: (node) => popoverContains(node),
        hovered: () =>
          isOpenRef.current &&
          (!!popoverRef.current?.matches(":hover") ||
            hoverProbeRef.current() ||
            nestedHovered()),
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [parentNest],
  );
  /** Kept across the effect re-run when hover sets `isOpen`, so a leave into the gap is not dropped. */
  const hoverPointRef = useRef({ x: Number.NaN, y: Number.NaN });
  const hoverInsideRef = useRef({ anchor: false, popover: false });
  // Hover: open from the anchor, and delay close so the offset gap is not a leave.
  useEffect(() => {
    if (!openOnHover) return;

    const doc = markerRef.current?.ownerDocument ?? document;
    const win = doc.defaultView ?? window;
    // Touch screens have no hover gap to cross; a tap would open and then
    // schedule a close. Leave that path to click and keyboard dismissal.
    if (
      typeof win.matchMedia === "function" &&
      !win.matchMedia("(hover: hover)").matches
    ) {
      return;
    }

    let frameId: number | null = null;
    let attempts = 0;
    let closeTimer: ReturnType<typeof setTimeout> | null = null;
    let host: HTMLElement | null = null;
    /** Visible box. A `display: contents` host has no rect of its own. */
    let anchor: HTMLElement | null = null;
    let popover: HTMLElement | null = null;
    const hoverTargets: HTMLElement[] = [];
    const pointer = hoverPointRef.current;
    const inside = hoverInsideRef.current;

    const hitAnchor = (node: Node | null) =>
      !!node &&
      ((host != null && (host === node || host.contains(node))) ||
        (anchor != null && (anchor === node || anchor.contains(node))));

    const clearClose = () => {
      if (closeTimer !== null) {
        clearTimeout(closeTimer);
        closeTimer = null;
      }
    };

    const gapContainsPointer = () => {
      if (Number.isNaN(pointer.x) || !anchor) return false;
      const popoverEl = popoverRef.current;
      if (!popoverEl) return false;
      return pointerInFlexPopoverBridge(
        pointer.x,
        pointer.y,
        flexPopoverHoverBridge(
          placedSideRef.current,
          toPopoverRect(anchor.getBoundingClientRect()),
          toPopoverRect(popoverEl.getBoundingClientRect()),
        ),
      );
    };

    const stillHovering = () =>
      inside.anchor || inside.popover || gapContainsPointer() || nestedHovered();
    hoverProbeRef.current = () => inside.anchor || inside.popover || gapContainsPointer();

    const scheduleClose = () => {
      if (!isOpenRef.current || closeTimer !== null) return;
      closeTimer = setTimeout(() => {
        closeTimer = null;
        if (stillHovering()) return;
        onCloseRef.current();
      }, closeDelay);
    };

    const remember = (event: PointerEvent) => {
      pointer.x = event.clientX;
      pointer.y = event.clientY;
    };

    const onAnchorEnter = (event: PointerEvent) => {
      remember(event);
      inside.anchor = true;
      clearClose();
      onOpenRef.current?.();
    };

    const onAnchorLeave = (event: PointerEvent) => {
      remember(event);
      const next = event.relatedTarget as Node | null;
      if (hitAnchor(next)) {
        inside.anchor = true;
        clearClose();
        return;
      }
      inside.anchor = false;
      if (popoverContains(next)) {
        inside.popover = true;
        clearClose();
        return;
      }
      scheduleClose();
    };

    const onPopoverEnter = (event: PointerEvent) => {
      remember(event);
      inside.popover = true;
      clearClose();
    };

    const onPopoverLeave = (event: PointerEvent) => {
      remember(event);
      inside.popover = false;
      if (hitAnchor(event.relatedTarget as Node | null)) {
        inside.anchor = true;
        clearClose();
        return;
      }
      scheduleClose();
    };

    const onPointerMove = (event: PointerEvent) => {
      remember(event);
      // Re-read where the pointer is from what it is over, so a missed enter/leave
      // event cannot leave a popover believing it is still hovered.
      const target = event.target as Node | null;
      if (target && typeof target.nodeType === "number") {
        inside.anchor = hitAnchor(target);
        inside.popover = pathHitsPopover(event) || popoverContains(target);
      }
      if (!isOpenRef.current) return;
      if (stillHovering()) clearClose();
      else scheduleClose();
    };

    const bind = () => {
      host = getAnchorRef.current();
      anchor = host ? flexPopoverAnchorBox(host) : null;
      if (!host && attempts < MAX_POSITION_FRAMES) {
        attempts++;
        frameId = win.requestAnimationFrame(bind);
        return;
      }
      inside.anchor = !!host?.matches(":hover") || !!anchor?.matches(":hover");
      popover = popoverRef.current;
      inside.popover = !!popover?.matches(":hover");
      for (const node of [host, anchor]) {
        if (!node || hoverTargets.includes(node)) continue;
        hoverTargets.push(node);
        node.addEventListener("pointerenter", onAnchorEnter);
        node.addEventListener("pointerleave", onAnchorLeave);
      }
      popover?.addEventListener("pointerenter", onPopoverEnter);
      popover?.addEventListener("pointerleave", onPopoverLeave);
      if (isOpenRef.current) win.addEventListener("pointermove", onPointerMove);
      // A leave that landed before `isOpen` committed is still in `pointer`.
      if (isOpenRef.current && !Number.isNaN(pointer.x) && !stillHovering()) {
        scheduleClose();
      }
    };

    bind();

    return () => {
      hoverProbeRef.current = () => false;
      if (frameId !== null) win.cancelAnimationFrame(frameId);
      clearClose();
      for (const node of hoverTargets) {
        node.removeEventListener("pointerenter", onAnchorEnter);
        node.removeEventListener("pointerleave", onAnchorLeave);
      }
      popover?.removeEventListener("pointerenter", onPopoverEnter);
      popover?.removeEventListener("pointerleave", onPopoverLeave);
      win.removeEventListener("pointermove", onPointerMove);
    };
  }, [openOnHover, closeDelay, isOpen, mountTarget, anchorId]);

  const popoverElement = (
    <div
      ref={popoverRef}
      {...({ popover: "manual" } as Record<string, string>)}
      role="dialog"
      className={`corex-native-popover ${isOpen ? "corex-native-popover-open" : ""} ${className}`}
      style={{
        ...customStyle,
        position: "fixed",
        margin: 0,
        padding: 0,
        border: 0,
        background: "transparent",
        top: coords ? `${coords.top}px` : "auto",
        left: coords ? `${coords.left}px` : "auto",
        right: "auto",
        bottom: "auto",
        width: width ?? "auto",
        minWidth: minWidth ?? undefined,
        maxWidth: `calc(100vw - ${VIEWPORT_MARGIN * 2}px)`,
        boxSizing: "border-box",
        zIndex,
        overflow: "unset",
        pointerEvents: isOpen ? "auto" : "none",
        visibility: isOpen ? "visible" : "hidden",
        ...({
          "--corex-popover-enter-x": motion.enterX,
          "--corex-popover-enter-y": motion.enterY,
          "--corex-popover-origin": motion.transformOrigin,
        } as CSSProperties),
        ...(!isPopoverSupported ? { display: isOpen ? "block" : "none" } : {}),
      }}
    >
      <Card padding="none" gap="none">
        {isOpen ? (
          <>
            {!noHeader && heading != null && heading !== false && (
              <>
                <InlineStack
                  alignItems="center"
                  justifyContent="space-between"
                  padding="small-200"
                  gap="small-200"
                >
                  {typeof heading === "string" ? (
                    <Text variant="small" heading>
                      {heading}
                    </Text>
                  ) : (
                    heading
                  )}
                  <Button
                    icon="x"
                    variant="tertiary"
                    type="button"
                    accessibilityLabel={
                      closeAccessibilityLabel ??
                      (typeof heading === "string" ? `Close ${heading}` : "Close popover")
                    }
                    onClick={(event) => {
                      event.preventDefault();
                      event.stopPropagation();
                      onCloseRef.current();
                    }}
                  />
                </InlineStack>
                <Divider />
              </>
            )}
            <BlockStack
              maxBlockSize={maxHeight ?? "320px"}
              padding={padding}
              overflow={maxHeight === "none" || maxHeight === "auto" ? "visible" : "auto"}
            >
              <FlexPopoverNestContext.Provider value={nest}>
                {children}
              </FlexPopoverNestContext.Provider>
            </BlockStack>
          </>
        ) : null}
      </Card>
    </div>
  );

  return (
    <>
      <span ref={markerRef} hidden aria-hidden="true" />
      {mountTarget ? createPortal(popoverElement, mountTarget) : null}
    </>
  );
}

type FlexPopoverContextType = {
  isOpen: boolean;
  setOpen: (next: boolean) => void;
  triggerRef: RefObject<HTMLSpanElement>;
  settings: Pick<
    FlexPopoverCompoundPropsType,
    | "offset"
    | "position"
    | "matchAnchorWidth"
    | "openOnHover"
    | "closeDelay"
    | "boundaryRef"
    | "boundarySelector"
  >;
};

const FlexPopoverContext = createContext<FlexPopoverContextType | null>(null);

function useFlexPopoverContext(part: string): FlexPopoverContextType {
  const context = useContext(FlexPopoverContext);
  if (!context) throw new Error(`${part} must be rendered inside <FlexPopover>`);
  return context;
}

function FlexPopoverCompound({
  children,
  isOpen: isOpenProp,
  defaultOpen = false,
  onOpen,
  onClose,
  offset,
  position,
  matchAnchorWidth,
  openOnHover,
  closeDelay,
  boundaryRef,
  boundarySelector,
}: FlexPopoverCompoundPropsType): ReactElement {
  const triggerRef = useRef<HTMLSpanElement | null>(null);
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const isOpen = isOpenProp ?? internalOpen;

  const callbacks = useRef({ onOpen, onClose, controlled: isOpenProp !== undefined });
  callbacks.current = { onOpen, onClose, controlled: isOpenProp !== undefined };

  const setOpen = useCallback((next: boolean) => {
    if (!callbacks.current.controlled) setInternalOpen(next);
    if (next) callbacks.current.onOpen?.();
    else callbacks.current.onClose?.();
  }, []);

  return (
    <FlexPopoverContext.Provider
      value={{
        isOpen,
        setOpen,
        triggerRef,
        settings: {
          offset,
          position,
          matchAnchorWidth,
          openOnHover,
          closeDelay,
          boundaryRef,
          boundarySelector,
        },
      }}
    >
      {children}
    </FlexPopoverContext.Provider>
  );
}

/**
 * The element the popover anchors to. Adds no box (`display: contents`), so the
 * layout of what it wraps is unchanged. Clicking it toggles the popover; with
 * `openOnHover` on the root, hovering it opens the popover.
 */
function FlexPopoverTrigger({ children }: FlexPopoverTriggerPropsType): ReactElement {
  const { isOpen, setOpen, triggerRef, settings } =
    useFlexPopoverContext("FlexPopover.Trigger");
  return (
    <span
      ref={triggerRef}
      style={{ display: "contents" }}
      onClick={() => setOpen(settings.openOnHover ? true : !isOpen)}
    >
      {typeof children === "function" ? children({ open: isOpen }) : children}
    </span>
  );
}
FlexPopoverTrigger.displayName = "FlexPopover.Trigger";

/** The floating panel, positioned against `FlexPopover.Trigger`. */
function FlexPopoverContent(props: FlexPopoverContentPropsType): ReactElement {
  const { isOpen, setOpen, triggerRef, settings } =
    useFlexPopoverContext("FlexPopover.Content");
  const { offset, position, matchAnchorWidth, closeDelay } = settings;
  const { onClose: onContentClose, ...panelProps } = props;
  return (
    <FlexPopoverBase
      {...panelProps}
      anchorRef={triggerRef}
      isOpen={isOpen}
      onOpen={() => setOpen(true)}
      onClose={() => {
        onContentClose?.();
        setOpen(false);
      }}
      openOnHover={settings.openOnHover}
      boundaryRef={settings.boundaryRef}
      boundarySelector={settings.boundarySelector}
      {...(offset !== undefined && { offset })}
      {...(position !== undefined && { position })}
      {...(matchAnchorWidth !== undefined && { matchAnchorWidth })}
      {...(closeDelay !== undefined && { closeDelay })}
    />
  );
}
FlexPopoverContent.displayName = "FlexPopover.Content";

function hasPart(children: ReactNode): boolean {
  return Children.toArray(children).some(
    (child) =>
      isValidElement(child) &&
      (child.type === FlexPopoverTrigger || child.type === FlexPopoverContent),
  );
}

function FlexPopoverRoot(props: FlexPopoverRootPropsType): ReactElement {
  // Classic API: the caller owns the anchor and the open state.
  const classic =
    !!props.anchorRef ||
    !!props.anchorId ||
    (props.isOpen !== undefined && !hasPart(props.children));
  return classic ? (
    <FlexPopoverBase {...(props as FlexPopoverPropsType)} />
  ) : (
    <FlexPopoverCompound {...(props as FlexPopoverCompoundPropsType)} />
  );
}

/**
 * Floating popover composed of `FlexPopover.Trigger` and `FlexPopover.Content`.
 *
 * ```tsx
 * <FlexPopover openOnHover position="top">
 *   <FlexPopover.Trigger>
 *     <Button>Hover me</Button>
 *   </FlexPopover.Trigger>
 *   <FlexPopover.Content heading="Details">
 *     <Text>Content</Text>
 *   </FlexPopover.Content>
 * </FlexPopover>
 * ```
 *
 * Backwards-compatible with the classic ref-based API (`anchorRef` / `anchorId` + `isOpen`).
 */
export const FlexPopover: FlexPopoverComponentType = Object.assign(FlexPopoverRoot, {
  Trigger: FlexPopoverTrigger,
  Content: FlexPopoverContent,
});

import {
  Children,
  createContext,
  isValidElement,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactElement,
  type RefObject,
} from "react";
import { useIsomorphicLayoutEffect } from "../../core/useIsomorphicLayoutEffect";
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
const POPOVER_CSS = `
.corex-native-popover {
  padding: 0;
  background: transparent !important;
  opacity: 0;
  border: none;
  transform: translate(var(--corex-popover-enter-x, 0px), var(--corex-popover-enter-y, -4px)) scale(0.97);
  transform-origin: var(--corex-popover-origin, left top);
  transition:
    opacity 140ms ease,
    transform 140ms ease;
}

.corex-native-popover:popover-open,
.corex-native-popover.corex-native-popover-open {
  opacity: 1;
  transform: translate(0) scale(1);
}

@starting-style {
  .corex-native-popover:popover-open {
    opacity: 0;
    transform: translate(var(--corex-popover-enter-x, 0px), var(--corex-popover-enter-y, -4px)) scale(0.97);
  }
}

@media (prefers-reduced-motion: reduce) {
  .corex-native-popover {
    transition: none;
  }
}
`;

/** Frames to keep retrying placement while the anchor has no layout yet (~1s). */
const MAX_POSITION_FRAMES = 60;

/**
 * Controlled popover portalled into the owner document's body and shown with
 * `popover="manual"` (top layer, no native light-dismiss).
 *
 * Avoids shadow DOM and iframe boundary clipping while ensuring smooth dismissal
 * on Escape or clicking outside the popover and its anchor. With `openOnHover`,
 * leaving is delayed so the offset gap between the anchor and the popover does
 * not dismiss it.
 */
function FlexPopoverBase({
  anchorId,
  anchorRef,
  isOpen,
  onClose,
  onOpen,
  heading = "Filters",
  closeAccessibilityLabel,
  noHeader,
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
   * Body of the document that owns the field. Starts null so the first client render
   * matches the server (no portal); the layout effect below resolves it before paint.
   */
  const [mountTarget, setMountTarget] = useState<HTMLElement | null>(null);
  /**
   * Kept in React state. Writing `top` on the node and also setting the `inset`
   * shorthand from the style prop makes the next render clear the coordinates.
   */
  const [coords, setCoords] = useState<{ top: number; left: number } | null>(null);

  const isPopoverSupported =
    typeof HTMLElement !== "undefined" &&
    typeof HTMLElement.prototype.showPopover === "function";

  // Resolve the owner document (e.g. an iframe) before the popover first renders
  useIsomorphicLayoutEffect(() => {
    const doc = markerRef.current?.ownerDocument;
    const body = doc?.body ?? null;
    if (body !== mountTarget) setMountTarget(body);

    // Shared popover styles, injected once per document. Refresh when the sheet changes.
    if (doc) {
      const existing = doc.getElementById(STYLE_ELEMENT_ID);
      if (existing) {
        if (existing.textContent !== POPOVER_CSS) existing.textContent = POPOVER_CSS;
      } else {
        const style = doc.createElement("style");
        style.id = STYLE_ELEMENT_ID;
        style.textContent = POPOVER_CSS;
        doc.head.appendChild(style);
      }
    }
  }, [mountTarget]);

  const getAnchor = useCallback((): HTMLElement | null => {
    return (
      anchorRef?.current ??
      (anchorId
        ? (markerRef.current?.ownerDocument.getElementById(anchorId) ?? null)
        : null)
    );
  }, [anchorId, anchorRef]);

  // Keep a stable ref so positioning/cleanup listeners don't churn on every render
  const getAnchorRef = useRef(getAnchor);
  getAnchorRef.current = getAnchor;

  // Reposition whenever opened or the anchor moves/resizes
  useIsomorphicLayoutEffect(() => {
    if (!isOpen) return;

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
          frameId = requestAnimationFrame(updatePosition);
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
          frameId = requestAnimationFrame(updatePosition);
        }
        return;
      }

      const doc = anchor.ownerDocument;
      const win = doc.defaultView ?? window;
      const viewportWidth = win.innerWidth;
      const viewportHeight = win.innerHeight;

      if (matchAnchorWidth) {
        popover.style.width = `${anchorRect.width}px`;
      }

      // `offset*` is the layout box. A closed popover is `display: none`, so force
      // a box for this read; getBoundingClientRect is only a fallback where layout
      // is mocked. The CSS enter transform must not shrink the measured size.
      if (popover.offsetWidth === 0 || popover.offsetHeight === 0) {
        popover.style.display = "block";
      }
      const popoverRect = popover.getBoundingClientRect();
      const popoverWidth = popover.offsetWidth || popoverRect.width;
      const popoverHeight = popover.offsetHeight || popoverRect.height;
      popover.style.display = "";
      if (popoverWidth === 0 || popoverHeight === 0) {
        if (retryFrame < MAX_POSITION_FRAMES) {
          retryFrame++;
          frameId = requestAnimationFrame(updatePosition);
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
    const doc = anchorEl?.ownerDocument ?? document;
    const win = doc.defaultView ?? window;

    win.addEventListener("resize", updatePosition);
    win.addEventListener("scroll", updatePosition, true);

    let resizeObserver: ResizeObserver | null = null;
    if (typeof ResizeObserver !== "undefined") {
      resizeObserver = new ResizeObserver(updatePosition);
      if (anchorEl) resizeObserver.observe(anchorEl);
      if (anchorBox && anchorBox !== anchorEl) resizeObserver.observe(anchorBox);
      if (popoverRef.current) resizeObserver.observe(popoverRef.current);
    }

    return () => {
      if (frameId !== null) cancelAnimationFrame(frameId);
      win.removeEventListener("resize", updatePosition);
      win.removeEventListener("scroll", updatePosition, true);
      resizeObserver?.disconnect();
    };
  }, [isOpen, offset, position, matchAnchorWidth, anchorId, anchorRef, mountTarget]);

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

  // Dismissal: Escape, or pointer-down outside popover, anchor and boundary
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;
  const onOpenRef = useRef(onOpen);
  onOpenRef.current = onOpen;
  const isOpenRef = useRef(isOpen);
  isOpenRef.current = isOpen;
  /** Kept across the effect re-run when hover sets `isOpen`, so a leave into the gap is not dropped. */
  const hoverPointRef = useRef({ x: Number.NaN, y: Number.NaN });
  const hoverInsideRef = useRef({ anchor: false, popover: false });
  useEffect(() => {
    if (!isOpen) return;

    const doc = markerRef.current?.ownerDocument ?? document;
    const win = doc.defaultView ?? window;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.stopPropagation();
        onCloseRef.current();
      }
    };

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target as Node | null;
      if (
        !target ||
        popoverRef.current?.contains(target) ||
        getAnchorRef.current()?.contains(target) ||
        boundaryRef?.current?.contains(target) ||
        (boundarySelector &&
          target instanceof Element &&
          target.closest(boundarySelector))
      ) {
        return;
      }
      onCloseRef.current();
    };

    win.addEventListener("keydown", handleKeyDown);
    // Deferred so the interaction that opened the popover doesn't immediately close it.
    const timer = setTimeout(() => {
      win.addEventListener("pointerdown", handlePointerDown, true);
    }, 10);

    return () => {
      win.removeEventListener("keydown", handleKeyDown);
      clearTimeout(timer);
      win.removeEventListener("pointerdown", handlePointerDown, true);
    };
  }, [isOpen, boundaryRef, boundarySelector, mountTarget]);

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

    const stillHovering = () => inside.anchor || inside.popover || gapContainsPointer();

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
      if (popoverRef.current?.contains(next)) {
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
      if (!isOpenRef.current) return;
      if (stillHovering()) clearClose();
      else scheduleClose();
    };

    const bind = () => {
      host = getAnchorRef.current();
      anchor = host ? flexPopoverAnchorBox(host) : null;
      if (!host && attempts < MAX_POSITION_FRAMES) {
        attempts++;
        frameId = requestAnimationFrame(bind);
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
      if (frameId !== null) cancelAnimationFrame(frameId);
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
        position: "fixed",
        margin: 0,
        top: coords ? `${coords.top}px` : "auto",
        left: coords ? `${coords.left}px` : "auto",
        right: "auto",
        bottom: "auto",
        width: width ?? "auto",
        minWidth: minWidth ?? undefined,
        maxHeight: maxHeight ?? "auto",
        boxSizing: "border-box",
        zIndex,
        overflow: "unset",
        visibility: isOpen ? "visible" : "hidden",
        ...({
          "--corex-popover-enter-x": motion.enterX,
          "--corex-popover-enter-y": motion.enterY,
          "--corex-popover-origin": motion.transformOrigin,
        } as CSSProperties),
        ...(!isPopoverSupported ? { display: isOpen ? "block" : "none" } : {}),
        ...customStyle,
      }}
    >
      <Card padding="none" gap="none">
        {isOpen ? (
          <>
            {!noHeader && (
              <>
                <InlineStack
                  alignItems="center"
                  justifyContent="space-between"
                  paddingInline="base small-300"
                  paddingBlock="small-300"
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
                    accessibilityLabel={
                      closeAccessibilityLabel ??
                      (heading === "Filters" ? "Close filters popup" : "Close popup")
                    }
                    onClick={(event) => {
                      event.stopPropagation();
                      onCloseRef.current();
                    }}
                  />
                </InlineStack>
                <Divider />
              </>
            )}
            <BlockStack
              maxBlockSize="320px"
              paddingInline="small-200"
              paddingBlock="small-300"
              overflow="auto"
            >
              {children}
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
      {children}
    </span>
  );
}
FlexPopoverTrigger.displayName = "FlexPopover.Trigger";

/** The floating panel, positioned against `FlexPopover.Trigger`. */
function FlexPopoverContent(props: FlexPopoverContentPropsType): ReactElement {
  const { isOpen, setOpen, triggerRef, settings } =
    useFlexPopoverContext("FlexPopover.Content");
  const { offset, position, matchAnchorWidth, closeDelay } = settings;
  return (
    <FlexPopoverBase
      {...props}
      anchorRef={triggerRef}
      isOpen={isOpen}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
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

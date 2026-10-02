import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

import { BlockStack } from "../BlockStack";
import { Button } from "../Button";
import { Card } from "../Card";
import { Divider } from "../Divider";
import { InlineStack } from "../InlineStack";
import { Text } from "../Text";
import type { FlexPopoverPropsType } from "./FlexPopover.types";

/** Default gap (px) between the anchor and the popover. */
const DEFAULT_OFFSET = 8;
/** Minimum distance (px) kept between the popover and the viewport edges. */
const VIEWPORT_MARGIN = 12;
const STYLE_ELEMENT_ID = "corex-flex-popover-styles";
const POPOVER_CSS = `
.corex-native-popover {
  padding: 0;
  border-radius: 16px;
  box-shadow:
    0 4px 8px rgba(0, 0, 0, 0.06),
    0 12px 30px rgba(0, 0, 0, 0.10);
  opacity: 0;
  transform: translateY(-4px) scale(0.97);
  transform-origin: top left;
  transition:
    opacity 140ms ease,
    transform 140ms ease;
}

.corex-native-popover:popover-open,
.corex-native-popover.corex-native-popover-open {
  opacity: 1;
  transform: translateY(0) scale(1);
}

@starting-style {
  .corex-native-popover:popover-open {
    opacity: 0;
    transform: translateY(-4px) scale(0.97);
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
 * on Escape or clicking outside the popover and its anchor.
 */
export function FlexPopover({
  anchorId,
  anchorRef,
  isOpen,
  onClose,
  noHeader,
  width,
  minWidth,
  maxHeight,
  offset = DEFAULT_OFFSET,
  matchAnchorWidth = false,
  boundaryRef,
  className = "",
  style: customStyle,
  zIndex = 999999,
  children,
}: FlexPopoverPropsType) {
  const markerRef = useRef<HTMLSpanElement | null>(null);
  const popoverRef = useRef<HTMLDivElement | null>(null);
  /** Body of the document that owns the field; null until the marker has mounted. */
  const [mountTarget, setMountTarget] = useState<HTMLElement | null>(null);

  const isPopoverSupported =
    typeof HTMLElement !== "undefined" &&
    typeof HTMLElement.prototype.showPopover === "function";

  // Resolve the owner document (e.g. an iframe) before the popover first renders
  useLayoutEffect(() => {
    const doc = markerRef.current?.ownerDocument;
    const body = doc?.body ?? null;
    if (body !== mountTarget) setMountTarget(body);

    // Shared popover styles, injected once per document.
    if (doc && !doc.getElementById(STYLE_ELEMENT_ID)) {
      const style = doc.createElement("style");
      style.id = STYLE_ELEMENT_ID;
      style.textContent = POPOVER_CSS;
      doc.head.appendChild(style);
    }
  }, [mountTarget]);

  const getAnchor = useCallback((): HTMLElement | null => {
    const el =
      anchorRef?.current ??
      (anchorId ? markerRef.current?.ownerDocument.getElementById(anchorId) : null);
    if (!el) return null;

    // Web-component hosts (e.g. `s-clickable`, `display: contents`) report an empty
    // box; measure a sized relative instead.
    const rect = el.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) {
      for (const candidate of [el.firstElementChild, el.parentElement]) {
        const candidateRect = candidate?.getBoundingClientRect();
        if (
          candidate &&
          candidateRect &&
          candidateRect.width > 0 &&
          candidateRect.height > 0
        ) {
          return candidate as HTMLElement;
        }
      }
    }
    return el;
  }, [anchorId, anchorRef]);

  // Keep a stable ref so positioning/cleanup listeners don't churn on every render
  const getAnchorRef = useRef(getAnchor);
  getAnchorRef.current = getAnchor;

  // Reposition whenever opened or the anchor moves/resizes
  useLayoutEffect(() => {
    if (!isOpen) return;

    let retryFrame = 0;
    let frameId: number | null = null;

    const updatePosition = () => {
      const popover = popoverRef.current;
      const anchor = getAnchorRef.current();
      if (!popover) return;

      if (!anchor) {
        // Retry for a few frames while the anchor is rendering/mounting
        if (retryFrame < MAX_POSITION_FRAMES) {
          retryFrame++;
          frameId = requestAnimationFrame(updatePosition);
        }
        return;
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

      // Read dimensions now that width has been applied
      const popoverRect = popover.getBoundingClientRect();
      const popoverWidth = popoverRect.width;
      const popoverHeight = popoverRect.height;

      // Vertical placement: place below by default; flip above if clipped
      const spaceBelow = viewportHeight - anchorRect.bottom - offset;
      const spaceAbove = anchorRect.top - offset;
      const fitsBelow = spaceBelow >= popoverHeight || spaceBelow >= spaceAbove;

      let top: number;
      if (fitsBelow) {
        top = anchorRect.bottom + offset;
      } else {
        top = Math.max(VIEWPORT_MARGIN, anchorRect.top - offset - popoverHeight);
      }

      // Horizontal placement: align left edges, clamp within viewport margins
      let left = anchorRect.left;
      if (left + popoverWidth > viewportWidth - VIEWPORT_MARGIN) {
        left = Math.max(VIEWPORT_MARGIN, viewportWidth - VIEWPORT_MARGIN - popoverWidth);
      }
      if (left < VIEWPORT_MARGIN) {
        left = VIEWPORT_MARGIN;
      }

      popover.style.top = `${Math.round(top)}px`;
      popover.style.left = `${Math.round(left)}px`;
      popover.style.visibility = "visible";
    };

    updatePosition();

    const anchorEl = getAnchorRef.current();
    const doc = anchorEl?.ownerDocument ?? document;
    const win = doc.defaultView ?? window;

    win.addEventListener("resize", updatePosition);
    win.addEventListener("scroll", updatePosition, true);

    let resizeObserver: ResizeObserver | null = null;
    if (typeof ResizeObserver !== "undefined") {
      resizeObserver = new ResizeObserver(updatePosition);
      if (anchorEl) resizeObserver.observe(anchorEl);
      if (popoverRef.current) resizeObserver.observe(popoverRef.current);
    }

    return () => {
      if (frameId !== null) cancelAnimationFrame(frameId);
      win.removeEventListener("resize", updatePosition);
      win.removeEventListener("scroll", updatePosition, true);
      resizeObserver?.disconnect();
    };
  }, [isOpen, offset, matchAnchorWidth, anchorId, anchorRef]);

  // Sync with browser's native Popover API (manual mode = top layer, no light dismiss)
  useLayoutEffect(() => {
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
  }, [isOpen, isPopoverSupported]);

  // Dismissal: Escape, or pointer-down outside popover, anchor and boundary
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

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
        boundaryRef?.current?.contains(target)
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
  }, [isOpen, boundaryRef, mountTarget]);

  const popoverElement = (
    <div
      ref={popoverRef}
      {...({ popover: "manual" } as Record<string, string>)}
      role="dialog"
      className={`corex-native-popover ${isOpen ? "corex-native-popover-open" : ""} ${className}`}
      style={{
        position: "fixed",
        inset: "unset",
        margin: 0,
        width: width ?? "auto",
        minWidth: minWidth ?? undefined,
        maxHeight: maxHeight ?? "auto",
        boxSizing: "border-box",
        zIndex,
        overflow: "clip",
        visibility: isOpen ? "visible" : "hidden",
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
                  <Text variant="small" heading>
                    Filters
                  </Text>
                  <Button
                    icon="x"
                    variant="tertiary"
                    accessibilityLabel="Close filters popup"
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

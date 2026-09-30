import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
  type RefObject,
} from "react";
import { createPortal } from "react-dom";

import { Box } from "../Box";

/** Gap (px) between the anchor and the popover. */
const OFFSET = 8;
/** Minimum distance (px) kept between the popover and the viewport edges. */
const VIEWPORT_MARGIN = 12;
const STYLE_ELEMENT_ID = "corex-filter-popover-styles";
const POPOVER_CSS = `
.corex-native-popover {
  padding: 0;
  border: 1px solid #e1e3e5;
  border-radius: 8px;
  background: #fff;
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

export type FilterPortalPopoverPropsType = {
  /** ID of the element the popover is positioned against (resolved in the owner document). */
  anchorId: string;
  isOpen: boolean;
  /** Fired on Escape or on pointer-down outside the popover, the anchor and `boundaryRef`. */
  onClose: () => void;
  width?: string;
  maxHeight?: string;
  /** Element whose clicks never dismiss the popover. */
  boundaryRef?: RefObject<HTMLElement | null>;
  children: ReactNode;
};

/**
 * Controlled popover used by the Filters search field.
 *
 * Portalled into the owner document's body and shown with `popover="manual"`
 * (top layer, no native light-dismiss), so focusing or clicking an interactive
 * anchor never races with the browser closing and re-opening it. Dismissal is
 * handled here instead: Escape, or pointer-down outside the popover, its anchor
 * and `boundaryRef`.
 */
export function FilterPortalPopover({
  anchorId,
  isOpen,
  onClose,
  width,
  maxHeight,
  boundaryRef,
  children,
}: FilterPortalPopoverPropsType) {
  const markerRef = useRef<HTMLSpanElement | null>(null);
  const popoverRef = useRef<HTMLDivElement | null>(null);
  /** Body of the document that owns the field; null until the marker has mounted. */
  const [mountTarget, setMountTarget] = useState<HTMLElement | null>(null);

  const isPopoverSupported =
    typeof HTMLElement !== "undefined" &&
    typeof HTMLElement.prototype.showPopover === "function";

  // Resolve the owner document (e.g. an iframe) before the popover first renders,
  // so it is never mounted into the wrong document and then moved.
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
    const el = markerRef.current?.ownerDocument.getElementById(anchorId);
    if (!el) return null;

    // Web-component hosts (e.g. `s-clickable`, `display: contents`) report an empty
    // box; measure a sized relative instead. No `instanceof HTMLElement` checks:
    // nodes inside an iframe come from another realm and would never match.
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
  }, [anchorId]);

  /** Places the popover under its anchor. Returns false while the anchor has no layout. */
  const updatePosition = useCallback((): boolean => {
    const anchor = getAnchor();
    const popover = popoverRef.current;
    if (!anchor || !popover) return false;

    const rect = anchor.getBoundingClientRect();
    if (rect.width === 0 && rect.height === 0) return false;

    const win = popover.ownerDocument.defaultView ?? window;
    const popoverWidth = popover.offsetWidth || parseInt(width ?? "", 10) || 260;
    const popoverHeight = popover.offsetHeight || parseInt(maxHeight ?? "", 10) || 200;

    // Keep within the viewport horizontally.
    let left = rect.left;
    if (left + popoverWidth > win.innerWidth - VIEWPORT_MARGIN) {
      left = win.innerWidth - popoverWidth - VIEWPORT_MARGIN;
    }
    left = Math.max(VIEWPORT_MARGIN, left);

    // Below the anchor; flip above when it would overflow the bottom.
    let top = rect.bottom + OFFSET;
    if (
      top + popoverHeight > win.innerHeight - VIEWPORT_MARGIN &&
      rect.top - OFFSET - popoverHeight > VIEWPORT_MARGIN
    ) {
      top = rect.top - OFFSET - popoverHeight;
    }

    popover.style.top = `${top}px`;
    popover.style.left = `${left}px`;
    popover.style.visibility = "visible";
    return true;
  }, [getAnchor, width, maxHeight]);

  // Show/hide in the top layer and position it. A freshly added anchor (e.g. a
  // pill picked from P1) may not have layout for a few frames while its web
  // components upgrade, so keep retrying until it can be measured.
  useEffect(() => {
    const popover = popoverRef.current;
    const win = mountTarget?.ownerDocument.defaultView;
    if (!popover || !win) return;

    if (!isOpen) {
      popover.style.visibility = "hidden";
      if (isPopoverSupported && popover.matches(":popover-open")) popover.hidePopover();
      return;
    }

    if (isPopoverSupported && !popover.matches(":popover-open")) popover.showPopover();

    let frames = 0;
    let raf = 0;
    const place = () => {
      const placed = updatePosition();
      // After a successful placement, re-measure once more for late layout shifts.
      if (frames++ < MAX_POSITION_FRAMES && (!placed || frames === 1)) {
        raf = win.requestAnimationFrame(place);
      }
    };
    place();
    return () => win.cancelAnimationFrame(raf);
  }, [isOpen, isPopoverSupported, updatePosition, mountTarget]);

  // Follow the anchor while scrolling (including inner scroll containers) and resizing.
  useEffect(() => {
    const win = mountTarget?.ownerDocument.defaultView;
    if (!isOpen || !win) return;
    const handleUpdate = () => {
      updatePosition();
    };
    win.addEventListener("resize", handleUpdate);
    win.addEventListener("scroll", handleUpdate, true);

    const observer =
      typeof ResizeObserver !== "undefined" ? new ResizeObserver(handleUpdate) : null;
    const anchor = getAnchor();
    for (const el of [anchor, anchor?.parentElement, popoverRef.current]) {
      if (el) observer?.observe(el);
    }

    return () => {
      win.removeEventListener("resize", handleUpdate);
      win.removeEventListener("scroll", handleUpdate, true);
      observer?.disconnect();
    };
  }, [isOpen, getAnchor, updatePosition, mountTarget]);

  // Escape and click-outside dismissal.
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;
  const getAnchorRef = useRef(getAnchor);
  getAnchorRef.current = getAnchor;

  useEffect(() => {
    const win = mountTarget?.ownerDocument.defaultView;
    if (!isOpen || !win) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
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
    // Deferred so the interaction that opened the popover doesn't close it.
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
      className={`corex-native-popover ${isOpen ? "corex-native-popover-open" : ""}`}
      style={{
        position: "fixed",
        inset: "unset",
        margin: 0,
        width: width ?? "auto",
        maxHeight: maxHeight ?? "auto",
        boxSizing: "border-box",
        zIndex: 999999,
        visibility: "hidden",
        ...(!isPopoverSupported ? { display: isOpen ? "block" : "none" } : {}),
      }}
    >
      <Box
        padding="none"
        style={{
          width: "100%",
          maxHeight,
          overflowY: maxHeight ? "auto" : undefined,
          boxSizing: "border-box",
        }}
      >
        {isOpen ? children : null}
      </Box>
    </div>
  );

  return (
    <>
      <span ref={markerRef} hidden aria-hidden="true" />
      {mountTarget ? createPortal(popoverElement, mountTarget) : null}
    </>
  );
}

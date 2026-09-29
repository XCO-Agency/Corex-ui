
import {
  cloneElement,
  forwardRef,
  useCallback,
  useEffect,
  useId,
  useImperativeHandle,
  useRef,
  useState,
  type CSSProperties,
  type ReactElement,
  type ReactNode,
  type RefObject,
} from "react";
import { createPortal } from "react-dom";

import { Box } from "../Box";
import type {
  PopoverHandleType,
  PopoverHandle,
  FilterPortalPopoverPropsType,
  FilterPopoverPropsType,
} from "./Filters.types";

export type {
  PopoverHandleType,
  PopoverHandle,
  FilterPortalPopoverPropsType,
  FilterPopoverPropsType,
};

export const FilterPortalPopover = forwardRef<
  PopoverHandleType,
  FilterPortalPopoverPropsType
>(function FilterPortalPopover(
  {
    anchorRef,
    anchorId,
    trigger,
    isOpen,
    onClose,
    onOpen,
    width,
    minWidth,
    maxHeight,
    offset = 8,
    className = "",
    style: customStyle,
    children,
    id,
  },
  forwardedRef,
) {
  const isControlled = isOpen !== undefined;
  const [open, setOpen] = useState(Boolean(isOpen));
  const isVisible = isControlled ? Boolean(isOpen) : open;

  const containerMarkerRef = useRef<HTMLSpanElement | null>(null);
  const popoverRef = useRef<HTMLDivElement | null>(null);
  const triggerRef = useRef<HTMLElement | null>(null);
  const [position, setPosition] = useState<{ top: number; left: number }>({
    top: 0,
    left: 0,
  });

  const generatedId = useId().replace(/:/g, "");
  const popoverId = id ?? `corex-filter-popover-${generatedId}`;

  const isPopoverSupported =
    typeof HTMLElement !== "undefined" &&
    typeof HTMLDivElement.prototype.showPopover === "function";

  const getOwnerDocument = useCallback((): Document => {
    if (containerMarkerRef.current?.ownerDocument) {
      return containerMarkerRef.current.ownerDocument;
    }
    if (triggerRef.current?.ownerDocument) {
      return triggerRef.current.ownerDocument;
    }
    if (typeof anchorRef === "object" && anchorRef && "current" in anchorRef && anchorRef.current?.ownerDocument) {
      return anchorRef.current.ownerDocument;
    }
    if (anchorRef instanceof HTMLElement && anchorRef.ownerDocument) {
      return anchorRef.ownerDocument;
    }
    if (typeof document !== "undefined") {
      return document;
    }
    return null as unknown as Document;
  }, [anchorRef]);

  const getOwnerWindow = useCallback((): Window => {
    const doc = getOwnerDocument();
    return doc?.defaultView ?? (typeof window !== "undefined" ? window : (null as unknown as Window));
  }, [getOwnerDocument]);

  const [mountTarget, setMountTarget] = useState<HTMLElement | null>(() => {
    if (typeof document !== "undefined") {
      return document.body;
    }
    return null;
  });

  useEffect(() => {
    const doc = getOwnerDocument();
    if (doc?.body && doc.body !== mountTarget) {
      setMountTarget(doc.body);
    }
  }, [getOwnerDocument, mountTarget]);

  const getAnchor = useCallback((): HTMLElement | null => {
    let el: HTMLElement | null = null;
    if (triggerRef.current) {
      el = triggerRef.current;
    } else if (anchorRef) {
      if (typeof anchorRef === "string") {
        const doc = getOwnerDocument();
        if (doc) {
          el = doc.getElementById(anchorRef);
        }
      } else if ("current" in anchorRef) {
        el = anchorRef.current;
      } else if (anchorRef instanceof HTMLElement) {
        el = anchorRef;
      }
    }
    if (!el && anchorId) {
      const doc = getOwnerDocument();
      if (doc) {
        el = doc.getElementById(anchorId);
      }
    }

    if (!el) return null;

    // Check for measurable dimensions; resolve wrapper if needed
    const rect = el.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) {
      if (el.firstElementChild instanceof HTMLElement) {
        const childRect = el.firstElementChild.getBoundingClientRect();
        if (childRect.width > 0 && childRect.height > 0) {
          return el.firstElementChild;
        }
      }
      if (el.parentElement) {
        const parentRect = el.parentElement.getBoundingClientRect();
        if (parentRect.width > 0 && parentRect.height > 0) {
          return el.parentElement;
        }
      }
    }
    return el;
  }, [anchorId, anchorRef, getOwnerDocument]);

  const updatePosition = useCallback(() => {
    const anchor = getAnchor();
    if (!anchor) {
      return false;
    }

    const rect = anchor.getBoundingClientRect();
    if (rect.width === 0 && rect.height === 0) {
      return false;
    }

    const win = getOwnerWindow();
    const popover = popoverRef.current;
    let left = rect.left;
    const viewportWidth = win?.innerWidth || 1024;
    const viewportHeight = win?.innerHeight || 768;
    const pWidth = popover?.offsetWidth || (width ? parseInt(width, 10) : 0) || 260;
    const pHeight = popover?.offsetHeight || (maxHeight ? parseInt(maxHeight, 10) : 0) || 200;

    // Keep within horizontal bounds
    if (left + pWidth > viewportWidth - 12) {
      left = Math.max(12, viewportWidth - pWidth - 12);
    }
    left = Math.max(12, left);

    // Vertical placement: default below anchor, flip above if overflowing bottom
    let top = rect.bottom + offset;
    if (top + pHeight > viewportHeight - 12 && rect.top - offset - pHeight > 12) {
      top = rect.top - offset - pHeight;
    }

    if (popover) {
      popover.style.top = `${top}px`;
      popover.style.left = `${left}px`;
      popover.style.visibility = "visible";
    }

    setPosition({
      top,
      left,
    });
    return true;
  }, [getAnchor, getOwnerWindow, offset, width, maxHeight]);

  const openPopover = useCallback(() => {
    const popover = popoverRef.current;
    if (!popover) return;

    updatePosition();

    if (isPopoverSupported) {
      try {
        if (!popover.matches(":popover-open")) {
          popover.showPopover();
        }
      } catch {
        // Fallback
      }
    }

    setOpen(true);
    onOpen?.();
  }, [isPopoverSupported, onOpen, updatePosition]);

  const closePopover = useCallback(() => {
    const popover = popoverRef.current;
    if (popover && isPopoverSupported) {
      try {
        if (popover.matches(":popover-open")) {
          popover.hidePopover();
        }
      } catch {
        // Fallback
      }
    }
    setOpen(false);
    onClose?.();
  }, [isPopoverSupported, onClose]);

  const togglePopover = useCallback(() => {
    if (popoverRef.current?.matches(":popover-open") || isVisible) {
      closePopover();
    } else {
      openPopover();
    }
  }, [closePopover, isVisible, openPopover]);

  useImperativeHandle(
    forwardedRef,
    () => ({
      open: openPopover,
      close: closePopover,
      toggle: togglePopover,
      isOpen: () => {
        if (isPopoverSupported && popoverRef.current) {
          return popoverRef.current.matches(":popover-open");
        }
        return isVisible;
      },
    }),
    [openPopover, closePopover, togglePopover, isPopoverSupported, isVisible],
  );

  /*
   * Keep popover position and native open state in sync when isVisible changes.
   */
  useEffect(() => {
    if (isVisible) {
      const doc = getOwnerDocument();
      if (doc?.body && doc.body !== mountTarget) {
        setMountTarget(doc.body);
      }

      updatePosition();
      const raf1 = requestAnimationFrame(() => {
        updatePosition();
        const raf2 = requestAnimationFrame(() => {
          updatePosition();
        });
        return () => cancelAnimationFrame(raf2);
      });

      const popover = popoverRef.current;
      if (popover && isPopoverSupported) {
        if (!popover.matches(":popover-open")) {
          try {
            popover.showPopover();
          } catch {
            // Fallback
          }
        }
      }
      return () => cancelAnimationFrame(raf1);
    } else {
      const popover = popoverRef.current;
      if (popover && isPopoverSupported) {
        if (popover.matches(":popover-open")) {
          try {
            popover.hidePopover();
          } catch {
            // Fallback
          }
        }
      }
    }
  }, [isVisible, updatePosition, isPopoverSupported, getOwnerDocument, mountTarget]);

  /*
   * Keep popover attached to trigger while scrolling/resizing.
   */
  useEffect(() => {
    if (!isVisible) return;

    const win = getOwnerWindow();
    const handleUpdate = () => {
      updatePosition();
    };

    win.addEventListener("resize", handleUpdate);
    win.addEventListener("scroll", handleUpdate, true);

    return () => {
      win.removeEventListener("resize", handleUpdate);
      win.removeEventListener("scroll", handleUpdate, true);
    };
  }, [isVisible, updatePosition, getOwnerWindow]);

  /*
   * Observe anchor resizing/layout changes for dynamic elements.
   */
  useEffect(() => {
    if (!isVisible) return;
    const anchor = getAnchor();
    if (!anchor) return;

    if (typeof ResizeObserver !== "undefined") {
      const ro = new ResizeObserver(() => {
        updatePosition();
      });
      ro.observe(anchor);
      if (anchor.parentElement) {
        ro.observe(anchor.parentElement);
      }
      return () => ro.disconnect();
    }
  }, [isVisible, getAnchor, updatePosition]);

  /*
   * Browser dismissal / escape / click-outside toggle event for popover="auto".
   */
  useEffect(() => {
    const popover = popoverRef.current;
    if (!popover) return;

    const handleToggle = (event: Event) => {
      const toggleEvt = event as ToggleEvent;
      const isNowOpen = toggleEvt.newState === "open";
      setOpen(isNowOpen);
      if (!isNowOpen) {
        // If controlled, only invoke onClose when closed externally by browser/click-outside
        // (i.e. isOpen was still true in props when dismissed)
        if (isControlled) {
          if (isOpen) {
            onClose?.();
          }
        } else {
          onClose?.();
        }
      } else {
        updatePosition();
      }
    };

    popover.addEventListener("toggle", handleToggle);
    return () => {
      popover.removeEventListener("toggle", handleToggle);
    };
  }, [isControlled, isOpen, onClose, updatePosition]);

  /*
   * Fallback Escape and Click-Outside for non-popover environments (e.g. jsdom in Vitest).
   */
  useEffect(() => {
    if (!isVisible || isPopoverSupported) return;

    const win = getOwnerWindow();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closePopover();
      }
    };

    const handlePointerDown = (event: PointerEvent | MouseEvent) => {
      const popover = popoverRef.current;
      const anchor = getAnchor();
      const target = event.target as Node | null;
      if (!target || !popover) return;

      if (!popover.contains(target) && !anchor?.contains(target)) {
        closePopover();
      }
    };

    win.addEventListener("keydown", handleKeyDown);
    const timer = setTimeout(() => {
      win.addEventListener("pointerdown", handlePointerDown);
    }, 10);

    return () => {
      win.removeEventListener("keydown", handleKeyDown);
      clearTimeout(timer);
      win.removeEventListener("pointerdown", handlePointerDown);
    };
  }, [isVisible, isPopoverSupported, getOwnerWindow, getAnchor, closePopover]);

  const triggerElement = trigger
    ? cloneElement(trigger, {
        ref: (node: HTMLElement | null) => {
          triggerRef.current = node;
          const originalRef = (trigger as any).ref || (trigger as any).props?.ref;
          if (typeof originalRef === "function") {
            originalRef(node);
          } else if (originalRef && typeof originalRef === "object") {
            originalRef.current = node;
          }
        },
        onClick: (event: React.MouseEvent) => {
          trigger.props.onClick?.(event);
          if (!isControlled) {
            togglePopover();
          }
        },
      })
    : null;

  const hasPosition = position.top > 0 || position.left > 0;

  const popoverStyle: CSSProperties = {
    position: "fixed",
    inset: "unset",
    top: `${position.top}px`,
    left: `${position.left}px`,
    right: "auto",
    bottom: "auto",
    width: width ?? "auto",
    minWidth: minWidth ?? undefined,
    maxHeight: maxHeight ?? "auto",
    boxSizing: "border-box",
    zIndex: 999999,
    margin: 0,
    visibility: hasPosition ? "visible" : "hidden",
    ...(!isPopoverSupported ? { display: isVisible ? "block" : "none" } : {}),
    ...customStyle,
  };

  const popoverElement = (
    <div
      ref={popoverRef}
      id={popoverId}
      {...({ popover: "auto" } as any)}
      role="dialog"
      className={`corex-native-popover ${isVisible ? "corex-native-popover-open" : ""} ${className}`}
      style={popoverStyle}
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
        {isVisible ? children : null}
      </Box>
    </div>
  );

  const renderedPopover = mountTarget
    ? createPortal(popoverElement, mountTarget)
    : popoverElement;

  return (
    <>
      <span ref={containerMarkerRef} style={{ display: "none" }} aria-hidden="true" />
      {triggerElement}
      {renderedPopover}

      <style>{`
        .corex-native-popover {
          position: fixed;
          inset: unset;
          margin: 0;
          padding: 0;
          border: 1px solid #e1e3e5;
          border-radius: 8px;
          background: #fff;
          box-shadow:
            0 4px 8px rgba(0, 0, 0, 0.06),
            0 12px 30px rgba(0, 0, 0, 0.10);
          z-index: 999999;
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

        .corex-native-popover::backdrop {
          background: transparent;
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
      `}</style>
    </>
  );
});

FilterPortalPopover.displayName = "FilterPortalPopover";

export { FilterPortalPopover as FilterPopover };


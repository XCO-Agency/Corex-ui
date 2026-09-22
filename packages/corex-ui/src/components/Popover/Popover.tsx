import {
  cloneElement,
  createContext,
  forwardRef,
  isValidElement,
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type ReactElement,
} from "react";
import { createWebComponent } from "../../core/createWebComponent";
import { mergeRefs } from "../../core/mergeRefs";
import type {
  PopoverComponentType,
  PopoverContentPropsType,
  PopoverContextType,
  PopoverPropsType,
  PopoverTriggerPropsType,
} from "./Popover.types";

const SPopover = createWebComponent<HTMLElement>("s-popover", {
  events: { onClick: "click" },
});

type InternalPopoverContextType = PopoverContextType & {
  setContentRef: (node: HTMLElement | null) => void;
  setTriggerRef: (node: HTMLElement | null) => void;
  updateTriggerWidth: () => void;
};

const PopoverContext = createContext<InternalPopoverContextType | null>(null);

export function usePopover(): PopoverContextType {
  const ctx = useContext(PopoverContext);
  if (!ctx) {
    throw new Error("Popover compound components must be used within a <Popover />");
  }
  return {
    popoverId: ctx.popoverId,
    close: ctx.close,
    triggerWidth: ctx.triggerWidth,
    triggerRef: ctx.triggerRef,
  };
}

export const usePopoverContext = usePopover;

/**
 * Trigger component for Popover. Injects `commandFor` onto child activator (e.g. Button)
 * and captures the trigger DOM element for dimension measurements.
 */
export const PopoverTrigger = forwardRef<HTMLElement, PopoverTriggerPropsType>(
  function PopoverTrigger({ children, ...props }, forwardedRef) {
    const { popoverId } = usePopover();
    const ctx = useContext(PopoverContext);
    const setTriggerRef = ctx?.setTriggerRef;

    if (isValidElement(children)) {
      const childRef = (children as any).props?.ref ?? (children as any).ref;
      const mergedRef = mergeRefs(setTriggerRef, childRef, forwardedRef);

      return cloneElement(children as ReactElement<any>, {
        commandFor: popoverId,
        command: (children.props as any)?.command ?? "--toggle",
        ref: mergedRef,
        ...props,
      });
    }

    return null;
  },
);
PopoverTrigger.displayName = "PopoverTrigger";

/**
 * Content container for Popover. Renders `<s-popover>` bound to the Trigger ID.
 * When `fitTrigger` is true, automatically matches `inlineSize` to the trigger width.
 */
export const PopoverContent = forwardRef<HTMLElement, PopoverContentPropsType>(
  function PopoverContent(
    { children, id, fitTrigger, inlineSize, onToggle, onShow, ...props },
    forwardedRef,
  ) {
    const ctx = useContext(PopoverContext);
    const popoverId = ctx?.popoverId;
    const setContentRef = ctx?.setContentRef;
    const triggerWidth = ctx?.triggerWidth;

    const handleToggle = useCallback(
      (e: any) => {
        ctx?.updateTriggerWidth();
        onToggle?.(e);
      },
      [ctx, onToggle],
    );

    const handleShow = useCallback(
      (e: any) => {
        ctx?.updateTriggerWidth();
        onShow?.(e);
      },
      [ctx, onShow],
    );

    const resolvedInlineSize =
      fitTrigger && triggerWidth !== undefined ? `${triggerWidth}px` : inlineSize;

    const mergedRef = useMemo(
      () => (setContentRef ? mergeRefs(setContentRef, forwardedRef) : forwardedRef),
      [setContentRef, forwardedRef],
    );

    return (
      <SPopover
        ref={mergedRef}
        id={popoverId}
        inlineSize={resolvedInlineSize}
        onToggle={handleToggle}
        onShow={handleShow}
        {...props}
      >
        {children}
      </SPopover>
    );
  },
);
PopoverContent.displayName = "PopoverContent";

function getTriggerTarget(node: HTMLElement | null): HTMLElement | null {
  if (!node) return null;
  if (node.shadowRoot) {
    const candidate =
      (node.shadowRoot.firstElementChild as HTMLElement | null) ??
      (node.shadowRoot.querySelector("button, a, div, [part]") as HTMLElement | null);
    if (candidate) return candidate;
  }
  if (node.firstElementChild instanceof HTMLElement && node.offsetWidth === 0) {
    return node.firstElementChild;
  }
  return node;
}

function measureElementWidth(node: HTMLElement | null): number {
  if (!node) return 0;
  const target = getTriggerTarget(node) ?? node;
  const rect = target.getBoundingClientRect();
  if (rect.width > 0) return rect.width;
  if (target.offsetWidth > 0) return target.offsetWidth;
  if (node.offsetWidth > 0) return node.offsetWidth;
  return 0;
}

/**
 * Root Popover component providing compound state/ID binding and trigger measurements.
 */
export const Popover = forwardRef<HTMLElement, PopoverPropsType>(function Popover(
  { children, id },
  _ref,
) {
  const generatedId = useId();
  const popoverId = id ?? `corex-popover-${generatedId.replace(/:/g, "")}`;
  const contentRef = useRef<HTMLElement | null>(null);
  const triggerRef = useRef<HTMLElement | null>(null);
  const [triggerEl, setTriggerEl] = useState<HTMLElement | null>(null);
  const [triggerWidth, setTriggerWidth] = useState<number | undefined>(undefined);

  const setContentRef = useCallback((node: HTMLElement | null) => {
    contentRef.current = node;
  }, []);

  const updateTriggerWidth = useCallback(() => {
    if (triggerRef.current) {
      const w = measureElementWidth(triggerRef.current);
      if (w > 0) {
        setTriggerWidth(w);
      }
    }
  }, []);

  const setTriggerRef = useCallback((node: HTMLElement | null) => {
    triggerRef.current = node;
    setTriggerEl(node);
    if (node) {
      const w = measureElementWidth(node);
      if (w > 0) {
        setTriggerWidth(w);
      }
    }
  }, []);

  useEffect(() => {
    if (!triggerEl) return;

    let observer: ResizeObserver | null = null;
    let cancelled = false;

    const measureAndObserve = () => {
      if (cancelled) return;
      const target = getTriggerTarget(triggerEl);
      if (target) {
        const width = measureElementWidth(triggerEl);
        if (width > 0) {
          setTriggerWidth(width);
        }

        if (typeof ResizeObserver !== "undefined") {
          if (observer) observer.disconnect();
          observer = new ResizeObserver(() => {
            const nextWidth = measureElementWidth(triggerEl);
            if (nextWidth > 0) {
              setTriggerWidth(nextWidth);
            }
          });
          observer.observe(target);
          try {
            if (
              target !== triggerEl &&
              typeof window !== "undefined" &&
              !window.getComputedStyle(triggerEl).display.includes("contents")
            ) {
              observer.observe(triggerEl);
            }
          } catch {
            // Ignore style read errors
          }
        }
      }
    };

    measureAndObserve();
    const rafId = requestAnimationFrame(measureAndObserve);

    const tagName = triggerEl.tagName?.toLowerCase();
    if (tagName && tagName.includes("-") && typeof customElements !== "undefined") {
      customElements.whenDefined(tagName).then(() => {
        if (!cancelled) {
          requestAnimationFrame(measureAndObserve);
        }
      });
    }

    const handleInteraction = () => {
      measureAndObserve();
    };

    triggerEl.addEventListener("pointerdown", handleInteraction);
    triggerEl.addEventListener("focus", handleInteraction);
    triggerEl.addEventListener("click", handleInteraction);

    return () => {
      cancelled = true;
      cancelAnimationFrame(rafId);
      if (observer) observer.disconnect();
      triggerEl.removeEventListener("pointerdown", handleInteraction);
      triggerEl.removeEventListener("focus", handleInteraction);
      triggerEl.removeEventListener("click", handleInteraction);
    };
  }, [triggerEl]);

  const close = useCallback(() => {
    const el =
      contentRef.current ??
      (typeof document !== "undefined" ? document.getElementById(popoverId) : null);

    if (el) {
      if (typeof (el as any).hideOverlay === "function") {
        (el as any).hideOverlay();
      } else if (typeof (el as any).hide === "function") {
        (el as any).hide();
      }

      try {
        el.dispatchEvent(
          new CustomEvent("command", {
            bubbles: true,
            composed: true,
            detail: { command: "--hide" },
          }),
        );
      } catch {
        // Ignore
      }
    }

    if (typeof document !== "undefined") {
      try {
        const btn = document.createElement("button");
        btn.setAttribute("command", "--hide");
        btn.setAttribute("commandfor", popoverId);
        btn.style.display = "none";
        document.body.appendChild(btn);
        btn.click();
        btn.remove();
      } catch {
        // Ignore
      }
    }
  }, [popoverId]);

  const contextValue = useMemo(
    () => ({
      popoverId,
      close,
      setContentRef,
      setTriggerRef,
      updateTriggerWidth,
      triggerWidth,
      triggerRef,
    }),
    [popoverId, close, setContentRef, setTriggerRef, updateTriggerWidth, triggerWidth],
  );

  return (
    <PopoverContext.Provider value={contextValue}>{children}</PopoverContext.Provider>
  );
}) as unknown as PopoverComponentType;

Popover.Trigger = PopoverTrigger;
Popover.Content = PopoverContent;

import {
  cloneElement,
  createContext,
  forwardRef,
  isValidElement,
  useCallback,
  useContext,
  useId,
  useMemo,
  useRef,
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
  };
}

export const usePopoverContext = usePopover;

/**
 * Trigger component for Popover. Injects `commandFor` onto child activator (e.g. Button).
 */
export const PopoverTrigger = forwardRef<HTMLElement, PopoverTriggerPropsType>(
  function PopoverTrigger({ children, ...props }, ref) {
    const { popoverId } = usePopover();

    if (isValidElement(children)) {
      return cloneElement(children as ReactElement<any>, {
        commandFor: popoverId,
        command: (children.props as any)?.command ?? "--toggle",
        ref: (children as any).ref ?? ref,
        ...props,
      });
    }

    return null;
  },
);
PopoverTrigger.displayName = "PopoverTrigger";

/**
 * Content container for Popover. Renders `<s-popover>` bound to the Trigger ID.
 */
export const PopoverContent = forwardRef<HTMLElement, PopoverContentPropsType>(
  function PopoverContent({ children, id, ...props }, forwardedRef) {
    const ctx = useContext(PopoverContext);
    const popoverId = ctx?.popoverId;
    const setContentRef = ctx?.setContentRef;

    const mergedRef = useMemo(
      () => (setContentRef ? mergeRefs(setContentRef, forwardedRef) : forwardedRef),
      [setContentRef, forwardedRef],
    );

    return (
      <SPopover ref={mergedRef} id={popoverId} {...props}>
        {children}
      </SPopover>
    );
  },
);
PopoverContent.displayName = "PopoverContent";

/**
 * Root Popover component providing compound state/ID binding.
 */
export const Popover = forwardRef<HTMLElement, PopoverPropsType>(function Popover(
  { children, id },
  _ref,
) {
  const generatedId = useId();
  const popoverId = id ?? `corex-popover-${generatedId.replace(/:/g, "")}`;
  const contentRef = useRef<HTMLElement | null>(null);

  const setContentRef = useCallback((node: HTMLElement | null) => {
    contentRef.current = node;
  }, []);

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
    }),
    [popoverId, close, setContentRef],
  );

  return (
    <PopoverContext.Provider value={contextValue}>{children}</PopoverContext.Provider>
  );
}) as unknown as PopoverComponentType;

Popover.Trigger = PopoverTrigger;
Popover.Content = PopoverContent;

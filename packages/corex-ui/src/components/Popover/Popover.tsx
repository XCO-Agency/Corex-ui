import {
  cloneElement,
  createContext,
  forwardRef,
  isValidElement,
  useContext,
  useId,
  type ReactElement,
} from "react";
import { createWebComponent } from "../../core/createWebComponent";
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

const PopoverContext = createContext<PopoverContextType | null>(null);

export function usePopoverContext(): PopoverContextType {
  const ctx = useContext(PopoverContext);
  if (!ctx) {
    throw new Error("Popover compound components must be used within a <Popover />");
  }
  return ctx;
}

/**
 * Trigger component for Popover. Injects `commandFor` onto child activator (e.g. Button).
 */
export const PopoverTrigger = forwardRef<HTMLElement, PopoverTriggerPropsType>(
  function PopoverTrigger({ children, ...props }, ref) {
    const { popoverId } = usePopoverContext();

    if (isValidElement(children)) {
      return cloneElement(children as ReactElement<any>, {
        commandFor: popoverId,
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
  function PopoverContent({ children, id, ...props }, ref) {
    const { popoverId } = usePopoverContext();

    return (
      <SPopover ref={ref} id={popoverId} {...props}>
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

  return (
    <PopoverContext.Provider value={{ popoverId }}>{children}</PopoverContext.Provider>
  );
}) as unknown as PopoverComponentType;

Popover.Trigger = PopoverTrigger;
Popover.Content = PopoverContent;

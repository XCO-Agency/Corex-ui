import type { ForwardRefExoticComponent, ReactNode, RefAttributes } from "react";

export type PopoverContextType = {
  popoverId: string;
  close: () => void;
  /** Current measured pixel width of the trigger element, if available. */
  triggerWidth?: number;
  /** Ref to the trigger DOM element. */
  triggerRef?: React.RefObject<HTMLElement | null>;
};

export type PopoverPropsType = {
  /** Custom ID for the popover element. Auto-generated if omitted. */
  id?: string;
  children?: ReactNode;
  /**
   * Controlled open state. Left undefined, the popover is driven entirely by the
   * native invoker API, which is what the trigger wires up. Set it when the page
   * has to keep the popover open itself — during an in-flight save, say.
   */
  active?: boolean;
  /** Called when the popover closes, however it was closed. */
  onClose?: () => void;
};

export type PopoverTriggerPropsType = {
  children: ReactNode;
};

export type PopoverContentPropsType = {
  children?: ReactNode;
  id?: string;
  blockSize?: string | number;
  inlineSize?: string | number;
  maxBlockSize?: string | number;
  maxInlineSize?: string | number;
  minBlockSize?: string | number;
  minInlineSize?: string | number;
  /** Automatically match the inlineSize of the popover content to the measured width of the trigger activator. */
  fitTrigger?: boolean;
  onHide?: (event?: any) => void;
  onShow?: (event?: any) => void;
  onAfterHide?: (event?: any) => void;
  onAfterShow?: (event?: any) => void;
  onToggle?: (event?: any) => void;
  onAfterToggle?: (event?: any) => void;
  [key: string]: any;
};

export type PopoverComponentType = ForwardRefExoticComponent<
  PopoverPropsType & RefAttributes<HTMLElement>
> & {
  Trigger: ForwardRefExoticComponent<
    PopoverTriggerPropsType & RefAttributes<HTMLElement>
  >;
  Content: ForwardRefExoticComponent<
    PopoverContentPropsType & RefAttributes<HTMLElement>
  >;
};

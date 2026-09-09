import type { ForwardRefExoticComponent, ReactNode, RefAttributes } from "react";

export type PopoverContextType = {
  popoverId: string;
  close: () => void;
};

export type PopoverPropsType = {
  /** Custom ID for the popover element. Auto-generated if omitted. */
  id?: string;
  children?: ReactNode;
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

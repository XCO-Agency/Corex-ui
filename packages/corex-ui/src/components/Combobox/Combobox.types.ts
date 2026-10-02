import type {
  CSSProperties,
  ForwardRefExoticComponent,
  ReactNode,
  RefAttributes,
} from "react";
import type { TextField } from "../TextField";

export type ComboboxPopoverPropsType = {
  children?: ReactNode;
};

export type ComboboxPropsType = {
  /** The field. `Combobox.TextField` is the usual one. */
  activator?: ReactNode;
  /** The `Listbox` of suggestions, `Combobox.Popover`, or in-flow elements (like tags). */
  children?: ReactNode;
  allowMultiple?: boolean;
  /** Controlled open state. If omitted, open state is managed automatically based on user interaction. */
  open?: boolean;
  active?: boolean;
  /** Callback fired when the popover closes. */
  onClose?: () => void;
  preferredPosition?: "above" | "below" | "mostSpace";
  willLoadMoreOptions?: boolean;
  onScrolledToBottom?: () => void;
  id?: string;
  className?: string;
  style?: CSSProperties;
};

export type ComboboxComponentType = ForwardRefExoticComponent<
  ComboboxPropsType & RefAttributes<HTMLDivElement>
> & {
  TextField: typeof TextField;
  Popover: ForwardRefExoticComponent<
    ComboboxPopoverPropsType & RefAttributes<HTMLDivElement>
  >;
};

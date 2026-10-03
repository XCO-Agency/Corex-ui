import type {
  CSSProperties,
  ForwardRefExoticComponent,
  KeyboardEvent,
  ReactNode,
  RefAttributes,
  RefObject,
} from "react";

export type ComboboxContextType<T = any> = {
  items?: readonly T[];
  itemToString: (item: T) => string;
  value: any;
  isSelected: (valueOrItem: any) => boolean;
  selectItem: (valueOrItem: any) => void;
  removeTag: (valueOrItem: any) => void;
  clearValue: () => void;
  open: boolean;
  setOpen: (open: boolean) => void;
  inputValue: string;
  setInputValue: (value: string) => void;
  filteredItems: readonly T[];
  highlightedIndex: number;
  setHighlightedIndex: (index: number | ((prev: number) => number)) => void;
  multiple: boolean;
  disabled: boolean;
  readOnly: boolean;
  comboboxId: string;
  anchorRef: RefObject<any>;
};

export type ComboboxPropsType<T = any> = {
  /** The collection of items for combobox suggestions. */
  items?: readonly T[];
  /** Convert item to string representation for display and search. */
  itemToStringValue?: (item: T) => string;

  /** Controlled value (or array of values if multiple). */
  value?: any;
  /** Initial uncontrolled value. */
  defaultValue?: any;
  /** Callback when selection changes. */
  onValueChange?: (value: any) => void;

  /** Enable multi-selection (displays tags). */
  multiple?: boolean;

  /** Controlled open state. */
  open?: boolean;
  /** Initial uncontrolled open state. */
  defaultOpen?: boolean;
  /** Callback when open state changes. */
  onOpenChange?: (open: boolean) => void;
  /** Callback when popover closes. */
  onClose?: () => void;

  /** Controlled search input query. */
  inputValue?: string;
  /** Callback when input query changes. */
  onInputValueChange?: (inputValue: string) => void;

  /** Custom filter function, or false to disable built-in filtering. */
  filter?: ((item: T, query: string) => boolean) | false | null;

  /** Highlight first matching suggestion automatically. */
  autoHighlight?: boolean;

  /** Whether the combobox is disabled. */
  disabled?: boolean;
  /** Whether the combobox is read-only. */
  readOnly?: boolean;

  id?: string;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
};

export type ComboboxInputPropsType = {
  placeholder?: string;
  value?: string;
  onChange?: (value: string, id?: string) => void;
  onFocus?: (event: any) => void;
  onBlur?: (event: any) => void;
  onKeyDown?: (event: KeyboardEvent<any>) => void;
  showClear?: boolean;
  onClear?: () => void;
  disabled?: boolean;
  readOnly?: boolean;
  /** Browser autocomplete behavior for the input. Defaults to 'off'. */
  autoComplete?: string;
  /** Browser autocorrect attribute (e.g. 'off' for search). Defaults to 'off'. */
  autoCorrect?: string;
  /** Browser autocapitalize attribute (e.g. 'none' for search). Defaults to 'none'. */
  autoCapitalize?: string;
  /** Whether spellcheck is enabled on the input. Defaults to false. */
  spellCheck?: boolean;
  /** ARIA autocomplete mode. Defaults to 'list'. */
  "aria-autocomplete"?: "none" | "inline" | "list" | "both";
  label?: string;
  helpText?: string;
  prefix?: string;
  suffix?: string;
  error?: string;
  id?: string;
  className?: string;
  style?: CSSProperties;
};

export type ComboboxContentPropsType = {
  children?: ReactNode;
  maxHeight?: string | number;
  matchAnchorWidth?: boolean;
  offset?: number;
  className?: string;
  style?: CSSProperties;
};

export type ComboboxListPropsType<T = any> = {
  children?: ReactNode | ((item: T, index: number) => ReactNode);
  className?: string;
  style?: CSSProperties;
  "aria-label"?: string;
};

export type ComboboxItemPropsType = {
  value: any;
  disabled?: boolean;
  children?: ReactNode;
  onSelect?: () => void;
  className?: string;
  style?: CSSProperties;
};

export type ComboboxEmptyPropsType = {
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
};

export type ComboboxComponentType = ForwardRefExoticComponent<
  ComboboxPropsType & RefAttributes<HTMLDivElement>
> & {
  Input: ForwardRefExoticComponent<ComboboxInputPropsType & RefAttributes<HTMLElement>>;
  Content: ForwardRefExoticComponent<
    ComboboxContentPropsType & RefAttributes<HTMLDivElement>
  >;
  List: ForwardRefExoticComponent<ComboboxListPropsType & RefAttributes<HTMLDivElement>>;
  Item: ForwardRefExoticComponent<ComboboxItemPropsType & RefAttributes<HTMLElement>>;
  Empty: ForwardRefExoticComponent<
    ComboboxEmptyPropsType & RefAttributes<HTMLDivElement>
  >;
};

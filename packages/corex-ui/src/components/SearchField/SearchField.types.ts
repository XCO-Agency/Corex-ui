import type { CSSProperties, ReactNode } from "react";
import type { PolarisPropsType } from "../../types/common";

type NativeSearchFieldProps = PolarisPropsType<"s-search-field">;

export type SearchFieldPropsType = Omit<
  NativeSearchFieldProps,
  "label" | "value" | "onChange" | "onBlur" | "onFocus" | "details" | "prefix" | "suffix"
> & {
  /** Label for the search field. If not provided, defaults to "Search". */
  label?: ReactNode;
  /** Value of the search field. */
  value?: string;
  /** Default value for uncontrolled usage. */
  defaultValue?: string;
  /** Placeholder text. Defaults to "Search". */
  placeholder?: string;
  /** Callback fired on every input change. */
  onChange?: (value: string, id?: string) => void;
  /** Callback fired with debounced value. */
  onDebouncedChange?: (value: string) => void;
  /** Debounce delay in ms for onDebouncedChange. Defaults to 300ms. */
  debounceDelay?: number;
  /** Callback fired when search is cleared. */
  onClear?: () => void;
  onBlur?: (event: Event) => void;
  onFocus?: (event: Event) => void;
  disabled?: boolean;
  readOnly?: boolean;
  error?: ReactNode;
  helpText?: ReactNode;
  details?: ReactNode;
  prefix?: ReactNode;
  suffix?: ReactNode;
  autoComplete?: string;
  id?: string;
  name?: string;
  maxLength?: number;
  minLength?: number;
  requiredIndicator?: boolean;
  labelAccessibilityVisibility?: "visible" | "exclusive" | "hidden";
  className?: string;
  style?: CSSProperties;
};

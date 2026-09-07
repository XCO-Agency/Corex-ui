import type { ReactNode } from "react";
import type { PolarisPropsType } from "../../types/common";

type NativeNumberFieldProps = PolarisPropsType<"s-number-field">;

export type NumberFieldPropsType = Omit<
  NativeNumberFieldProps,
  "label" | "value" | "onChange" | "onBlur" | "onFocus" | "details" | "prefix" | "suffix"
> & {
  label: ReactNode;
  value?: string;
  defaultValue?: string;
  min?: number;
  max?: number;
  step?: number;
  inputMode?: "decimal" | "numeric";
  /** Legacy signature: fires on every keystroke, mirroring `s-number-field`'s `onInput`. */
  onChange?: (value: string, id: string) => void;
  onBlur?: (event: Event) => void;
  onFocus?: (event: Event) => void;
  placeholder?: string;
  disabled?: boolean;
  readOnly?: boolean;
  error?: ReactNode;
  helpText?: ReactNode;
  details?: ReactNode;
  prefix?: ReactNode;
  suffix?: ReactNode;
  autoComplete?: string;
  labelAccessibilityVisibility?: "visible" | "exclusive";
  id?: string;
  name?: string;
  requiredIndicator?: boolean;
  className?: string;
};

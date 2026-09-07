import type { ReactNode } from "react";
import type { PolarisPropsType } from "../../types/common";

type NativeColorFieldProps = PolarisPropsType<"s-color-field">;

export type ColorFieldPropsType = Omit<
  NativeColorFieldProps,
  "label" | "value" | "onChange" | "onBlur" | "onFocus" | "details" | "prefix" | "suffix"
> & {
  label: ReactNode;
  value?: string;
  defaultValue?: string;
  alpha?: boolean;
  /** Legacy signature: fires on every change, mirroring `s-color-field`'s `onInput`. */
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

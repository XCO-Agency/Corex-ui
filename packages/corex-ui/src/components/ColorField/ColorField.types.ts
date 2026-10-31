import type { ReactNode } from "react";

export type ColorFieldPropsType = {
  label: ReactNode;
  value?: string;
  defaultValue?: string;
  /** Allow selecting an alpha (transparency) value in the picker. */
  alpha?: boolean;
  /** Fires on every text or picker change with the current color string. */
  onChange?: (value: string, id: string) => void;
  onBlur?: (event: Event) => void;
  onFocus?: (event: Event) => void;
  placeholder?: string;
  disabled?: boolean;
  readOnly?: boolean;
  error?: ReactNode;
  helpText?: ReactNode;
  details?: ReactNode;
  /** Replaces the default color swatch prefix when provided. */
  prefix?: ReactNode;
  suffix?: ReactNode;
  autoComplete?: string;
  labelAccessibilityVisibility?: "visible" | "exclusive";
  id?: string;
  name?: string;
  requiredIndicator?: boolean;
  className?: string;
};

import type { ReactNode } from "react";

export interface TextFieldProps {
  label: ReactNode;
  value?: string;
  /** Legacy signature: fires on every keystroke, mirroring `s-text-field`'s `onInput`. */
  onChange?: (value: string, id: string) => void;
  onBlur?: (event: Event) => void;
  onFocus?: (event: Event) => void;
  placeholder?: string;
  disabled?: boolean;
  error?: ReactNode;
  helpText?: ReactNode;
  type?: "text" | "email" | "number" | "password" | "url" | "tel";
  /** `true`/a row count renders `s-text-area` instead of `s-text-field`. */
  multiline?: boolean | number;
  prefix?: ReactNode;
  suffix?: ReactNode;
  autoComplete?: string;
  id?: string;
  name?: string;
  maxLength?: number;
  minLength?: number;
  requiredIndicator?: boolean;
  className?: string;
}

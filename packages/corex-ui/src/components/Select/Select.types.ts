import type { ReactNode } from "react";

export interface SelectOption {
  label: string;
  value: string;
  disabled?: boolean;
}

export interface SelectProps {
  label: ReactNode;
  options: Array<SelectOption | string>;
  value?: string;
  onChange?: (value: string, id: string) => void;
  disabled?: boolean;
  error?: ReactNode;
  helpText?: ReactNode;
  placeholder?: string;
  id?: string;
  name?: string;
  className?: string;
}

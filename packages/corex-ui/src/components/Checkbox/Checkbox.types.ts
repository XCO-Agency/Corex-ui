import type { ReactNode } from "react";

export interface CheckboxProps {
  label: ReactNode;
  checked?: boolean;
  onChange?: (checked: boolean, id: string) => void;
  disabled?: boolean;
  error?: ReactNode;
  helpText?: ReactNode;
  id?: string;
  name?: string;
  className?: string;
}

import type { ReactNode } from "react";

export interface DateFieldProps {
  label: ReactNode;
  value?: string;
  onChange?: (value: string, id: string) => void;
  disabled?: boolean;
  error?: ReactNode;
  helpText?: ReactNode;
  id?: string;
  name?: string;
  className?: string;
}

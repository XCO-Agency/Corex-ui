import type { ReactNode } from "react";

export interface ChoiceListOption {
  label: string;
  value: string;
  helpText?: string;
  disabled?: boolean;
}

export interface ChoiceListProps {
  title?: ReactNode;
  choices: ChoiceListOption[];
  selected: string[];
  onChange?: (selected: string[], name: string) => void;
  allowMultiple?: boolean;
  name?: string;
  error?: ReactNode;
  id?: string;
  className?: string;
}

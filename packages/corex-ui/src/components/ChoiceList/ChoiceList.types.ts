import type { ReactNode } from "react";

export type ChoiceListOptionType = {
  label: string;
  value: string;
  helpText?: string;
  disabled?: boolean;
};

export type ChoiceListPropsType = {
  title?: ReactNode;
  choices: ChoiceListOptionType[];
  selected: string[];
  onChange?: (selected: string[], name: string) => void;
  allowMultiple?: boolean;
  name?: string;
  error?: ReactNode;
  id?: string;
  className?: string;
};

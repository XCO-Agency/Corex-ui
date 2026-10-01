import type { CSSProperties, ReactNode } from "react";

export type AutocompleteOptionType = {
  value: string;
  label?: ReactNode;
  disabled?: boolean;
};

export type AutocompletePropsType = {
  options?: AutocompleteOptionType[];
  selected?: string[];
  onSelect?: (selected: string[]) => void;
  /** The field. `Autocomplete.TextField` is the usual one. */
  textField?: ReactNode;
  allowMultiple?: boolean;
  loading?: boolean;
  /** Shown in place of the list when there are no options. */
  emptyState?: ReactNode;
  id?: string;
  className?: string;
  style?: CSSProperties;
};

import type { CSSProperties, ReactNode } from "react";

/**
 * v12's auto-selection modes. Only `None` is honoured — the others moved focus
 * into the list as the user typed, which this list does not do.
 */
export const AutoSelection = {
  None: "NONE",
  First: "FIRST",
  FirstSelected: "FIRST_SELECTED",
} as const;

export type AutoSelectionType = (typeof AutoSelection)[keyof typeof AutoSelection];

export type ListboxPropsType = {
  children?: ReactNode;
  onSelect?: (value: string) => void;
  autoSelection?: AutoSelectionType | string;
  accessibilityLabel?: string;
  id?: string;
  className?: string;
  style?: CSSProperties;
};

export type ListboxOptionPropsType = {
  children?: ReactNode;
  value: string;
  selected?: boolean;
  disabled?: boolean;
  accessibilityLabel?: string;
};

export type ListboxSectionPropsType = {
  children?: ReactNode;
  title?: ReactNode;
  /** v12 drew a rule above the heading. */
  divider?: boolean;
};

export type ListboxHeaderPropsType = {
  children?: ReactNode;
};

export type ListboxActionPropsType = {
  children?: ReactNode;
  value?: string;
  onAction?: () => void;
};

export type ListboxLoadingPropsType = {
  accessibilityLabel?: string;
};

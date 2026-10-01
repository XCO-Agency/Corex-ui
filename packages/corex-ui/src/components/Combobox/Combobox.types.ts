import type { CSSProperties, ReactNode } from "react";

export type ComboboxPropsType = {
  /** The field. `Combobox.TextField` is the usual one. */
  activator?: ReactNode;
  /** The `Listbox` of suggestions. */
  children?: ReactNode;
  allowMultiple?: boolean;
  id?: string;
  className?: string;
  style?: CSSProperties;
};

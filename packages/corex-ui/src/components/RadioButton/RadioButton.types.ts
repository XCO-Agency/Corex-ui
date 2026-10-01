import type { CSSProperties, ReactNode } from "react";

export type RadioButtonPropsType = {
  label?: ReactNode;
  checked?: boolean;
  /** The value this radio contributes to its group. Defaults to the `id`. */
  value?: string;
  /** Radios sharing a `name` form one group. */
  name?: string;
  disabled?: boolean;
  helpText?: ReactNode;
  onChange?: (checked: boolean, id: string) => void;
  id?: string;
  className?: string;
  style?: CSSProperties;
};

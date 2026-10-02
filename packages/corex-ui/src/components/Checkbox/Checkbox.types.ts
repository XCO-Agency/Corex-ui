import type { ReactNode } from "react";
import type { PolarisPropsType } from "../../types/common";

type NativeCheckboxProps = PolarisPropsType<"s-checkbox">;

export type CheckboxPropsType = Omit<
  NativeCheckboxProps,
  "label" | "checked" | "onChange" | "details"
> & {
  label: ReactNode;
  checked?: boolean;
  indeterminate?: boolean;
  labelHidden?: boolean;
  labelAccessibilityVisibility?: "visible" | "exclusive" | "hidden";
  onChange?: (checked: boolean, id: string) => void;
  helpText?: ReactNode;
  details?: ReactNode;
  id?: string;
  className?: string;
};

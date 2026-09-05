import type { ReactNode } from "react";
import type { PolarisPropsType } from "../../types/common";

type NativeSelectProps = PolarisPropsType<"s-select">;

export type SelectOptionType = {
  label: string;
  value: string;
  disabled?: boolean;
};

export type SelectPropsType = Omit<
  NativeSelectProps,
  "label" | "value" | "onChange" | "details"
> & {
  label: ReactNode;
  options: Array<SelectOptionType | string>;
  value?: string;
  onChange?: (value: string, id: string) => void;
  helpText?: ReactNode;
  details?: ReactNode;
  placeholder?: string;
  id?: string;
  className?: string;
};

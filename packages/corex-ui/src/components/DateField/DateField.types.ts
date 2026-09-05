import type { ReactNode } from "react";
import type { PolarisPropsType } from "../../types/common";

type NativeDateFieldProps = PolarisPropsType<"s-date-field">;

export type DateFieldPropsType = Omit<
  NativeDateFieldProps,
  "label" | "value" | "details"
> & {
  label: ReactNode;
  value?: string;
  onChange?: (value: string, id: string) => void;
  helpText?: ReactNode;
  details?: ReactNode;
  id?: string;
  className?: string;
};

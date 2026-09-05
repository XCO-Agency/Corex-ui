import type { PolarisPropsType } from "../../types/common";

type NativeDatePickerProps = PolarisPropsType<"s-date-picker">;

export type DatePickerPropsType = Omit<
  NativeDatePickerProps,
  "selected" | "onChange"
> & {
  /** Selected date, as an ISO date string (`"2026-01-01"`). Single-date only in this release. */
  selected?: string;
  onChange?: (date: string) => void;
  disabled?: boolean;
  id?: string;
  className?: string;
};

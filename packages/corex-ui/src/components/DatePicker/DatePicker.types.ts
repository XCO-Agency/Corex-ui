export interface DatePickerProps {
  /** Selected date, as an ISO date string (`"2026-01-01"`). Single-date only in this release — no range support yet. */
  selected?: string;
  onChange?: (date: string) => void;
  disabled?: boolean;
  id?: string;
  className?: string;
}

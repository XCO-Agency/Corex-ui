import type * as React from "react";
import { PolarisPropsType } from "../../types/common";

export type DateRangeType = {
  start: string;
  end: string;
};

export type DatePresetItemType = {
  id: string;
  label: string;
  range?: DateRangeType | (() => DateRangeType);
  children?: DatePresetItemType[];
};

export type NativeDatePickerProps = PolarisPropsType<"s-date-picker">;

export type DatePickerPropsType = NativeDatePickerProps & {
  /**
   * Selected single date (`"2026-09-05"`) or date range object (`{ start: "2026-01-01", end: "2026-09-05" }`).
   */
  selected?: string | DateRangeType;

  /**
   * Callback fired when date or range changes.
   */
  onChange?: (value: string | DateRangeType) => void;

  /**
   * Callback fired when user clicks the "Apply" button.
   */
  onApply?: (range: DateRangeType) => void;

  /**
   * Callback fired when user clicks the "Cancel" button.
   */
  onCancel?: () => void;

  /**
   * Whether to display the left presets sidebar.
   * If `true`, standard presets are used. If an array of `DatePresetItemType`, custom presets are rendered.
   * If `false` or omitted/empty, the left presets sidebar is hidden.
   */
  presets?: boolean | DatePresetItemType[];

  /**
   * If `true`, the date picker panel is rendered inline.
   * If `false` (default), renders an activator button that opens the date picker in a Popover.
   */
  inline?: boolean;

  /**
   * children element when rendered as a popover.
   * @param formattedRange - Formatted date range display.
   * @param id - Date picker popover id.
   */
  children?: (formattedRange: string, id: string) => React.ReactNode;
  /** @deprecated use children */
  activator?: React.ReactNode;

  /** Whether range selection is allowed (default: true). */
  allowRange?: boolean;

  disabled?: boolean;
  id?: string;
  className?: string;
  style?: React.CSSProperties;
};

import type { CSSProperties, ReactNode } from "react";

/** Single-handle value. */
export type RangeSliderValueType = number;

/** Action rendered next to the label (e.g. a "Reset" link). */
export type RangeSliderLabelActionType = {
  content: ReactNode;
  onAction: () => void;
  accessibilityLabel?: string;
};

export type RangeSliderPropsType = {
  /** Label for the range input. */
  label: ReactNode;
  /** Adds an action next to the label. */
  labelAction?: RangeSliderLabelActionType;
  /** Visually hide the label (it stays in the accessibility tree). */
  labelHidden?: boolean;
  /** ID for the range input. */
  id?: string;
  /** Current value. */
  value: number;
  /** Minimum possible value. @default 0 */
  min?: number;
  /** Maximum possible value. @default 100 */
  max?: number;
  /** Increment value for changes. @default 1 */
  step?: number;
  /** Shows a tooltip with the current value while dragging/focused. */
  output?: boolean;
  /** Additional text to aid in use. */
  helpText?: ReactNode;
  /** Displays an error message and switches the control to a critical tone. */
  error?: ReactNode;
  /** Disables the control. */
  disabled?: boolean;
  /** Element to display before the input. */
  prefix?: ReactNode;
  /** Element to display after the input. */
  suffix?: ReactNode;
  /** Callback when the value changes. */
  onChange: (value: number, id: string) => void;
  /** Callback when a handle is focused. */
  onFocus?: () => void;
  /** Callback when focus leaves the handle. */
  onBlur?: () => void;
  className?: string;
  style?: CSSProperties;
};

export type RangeSliderSingleThumbPropsType = Omit<
  RangeSliderPropsType,
  "value" | "id"
> & {
  value: number;
  id: string;
  min: number;
  max: number;
  step: number;
};

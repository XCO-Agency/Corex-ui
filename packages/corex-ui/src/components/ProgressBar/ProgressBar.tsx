import { forwardRef } from "react";
import { createWebComponent } from "../../core/createWebComponent";

export type ProgressBarToneType =
  "info" | "success" | "warning" | "critical" | "auto" | "neutral" | "caution";

export type ProgressToneType = ProgressBarToneType;

export type ProgressBarPropsType = {
  /**
   * A label that describes the purpose or content of the component for assistive
   * technologies like screen readers. Use this to provide additional context
   * when the visible content alone doesn't clearly convey what is progressing.
   */
  accessibilityLabel?: string;
  /**
   * How much work the task requires in total. Must be greater than 0.
   * @default 1
   */
  max?: number;
  /**
   * The semantic meaning and color treatment of the component.
   * @default 'auto'
   */
  tone?: ProgressBarToneType;
  /**
   * How much of the task has been completed, as a number between 0 and max.
   * Without a value the progress is indeterminate: the task is ongoing with no
   * indication of how long it is expected to take.
   * @default 0
   */
  value?: number;
  /** Element ID */
  id?: string;
  /** CSS class name */
  className?: string;
  /** Element slot name */
  slot?: string;
};

export type ProgressPropsType = ProgressBarPropsType;

const SProgress = createWebComponent<HTMLElement>("s-progress");

/**
 * The progress component displays a horizontal bar showing how far a task or
 * goal has advanced. Use progress to communicate measurable work like uploads,
 * imports, checkout steps, and shipping thresholds.
 *
 * Progress is determinate when you set a `value`, and indeterminate when you
 * leave it off. For loading with no measurable end, use the `Spinner` component
 * instead.
 */
export const ProgressBar = forwardRef<HTMLElement, ProgressBarPropsType>(
  function ProgressBar({ accessibilityLabel, max, tone, value, ...rest }, ref) {
    return (
      <SProgress
        ref={ref}
        accessibilityLabel={accessibilityLabel}
        max={max}
        tone={tone}
        value={value}
        {...rest}
      />
    );
  },
);

export const Progress = ProgressBar;

import { forwardRef } from "react";
import type { CSSProperties } from "react";

type ProgressBarToneType = "success" | "neutral" | "subdued" | "caution" | "critical";

type ProgressBarSizeType = "xs" | "sm" | "base" | "lg";

type ProgressBarBorderRadiusType = "none" | "small" | "base" | "large" | "full";

export type ProgressBarPropsType = {
  /** Progress percentage between 0 and 100 */
  progress: number;
  /** Visual color tone for the bar and track */
  tone?: ProgressBarToneType;
  /** Height size of the progress bar ('xs' | 'sm' | 'base' | 'lg') */
  size?: ProgressBarSizeType;
  /** Rounded corners style */
  borderRadius?: ProgressBarBorderRadiusType;
  /** Custom track background color override */
  trackColor?: string;
  /** Custom progress bar fill color override */
  barColor?: string;
  /** Whether width changes animate with a smooth transition (default: true) */
  animated?: boolean;
  /** Inline styles for the outer track element */
  style?: CSSProperties;
  /** CSS class name */
  className?: string;
  /** Element ID */
  id?: string;
  /** Accessibility label */
  "aria-label"?: string;
  /** ID of an element that labels the progressbar */
  "aria-labelledby"?: string;
  role?: string;
  slot?: string;
};

const TONE_STYLES: Record<ProgressBarToneType, { barColor: string; trackColor: string }> =
  {
    success: {
      barColor: "#059669",
      trackColor: "#f3f4f6",
    },
    neutral: {
      barColor: "#111827",
      trackColor: "#f3f4f6",
    },
    subdued: {
      barColor: "#9ca3af",
      trackColor: "#f3f4f6",
    },
    caution: {
      barColor: "#d97706",
      trackColor: "#fef3c7",
    },
    critical: {
      barColor: "#dc2626",
      trackColor: "#fee2e2",
    },
  };

const SIZE_STYLES: Record<ProgressBarSizeType, { height: string }> = {
  xs: { height: "0.25rem" },
  sm: { height: "0.3125rem" },
  base: { height: "0.375rem" },
  lg: { height: "0.5rem" },
};

const BORDER_RADIUS_STYLES: Record<
  ProgressBarBorderRadiusType,
  { borderRadius: string }
> = {
  none: { borderRadius: "0px" },
  small: { borderRadius: "0.25rem" },
  base: { borderRadius: "0.375rem" },
  large: { borderRadius: "0.5rem" },
  full: { borderRadius: "9999px" },
};

/**
 * ProgressBar component displaying progress between 0 and 100%.
 * Supports various tones, sizes, border radii, and custom colors.
 */
export const ProgressBar = forwardRef<HTMLDivElement, ProgressBarPropsType>(
  function ProgressBar(
    {
      progress,
      tone = "success",
      size = "base",
      borderRadius = "full",
      trackColor,
      barColor,
      animated = true,
      style,
      className,
      role = "progressbar",
      ...rest
    },
    ref,
  ) {
    const toneStyle = TONE_STYLES[tone] ?? TONE_STYLES.success;
    const sizeStyle = SIZE_STYLES[size] ?? SIZE_STYLES.base;
    const radiusStyle = BORDER_RADIUS_STYLES[borderRadius] ?? BORDER_RADIUS_STYLES.full;
    const clampedProgress = Math.min(100, Math.max(0, isNaN(progress) ? 0 : progress));

    return (
      <div
        ref={ref}
        className={className}
        role={role}
        aria-valuenow={clampedProgress}
        aria-valuemin={0}
        aria-valuemax={100}
        style={{
          width: "100%",
          overflow: "hidden",
          backgroundColor: trackColor ?? toneStyle.trackColor,
          ...sizeStyle,
          ...radiusStyle,
          ...style,
        }}
        {...rest}
      >
        <div
          style={{
            height: "100%",
            width: `${clampedProgress}%`,
            backgroundColor: barColor ?? toneStyle.barColor,
            borderRadius: "inherit",
            transition: animated ? "all 500ms ease-out" : "none",
          }}
        />
      </div>
    );
  },
);

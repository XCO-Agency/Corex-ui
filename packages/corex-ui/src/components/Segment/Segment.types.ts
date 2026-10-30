import type { CSSProperties, ReactNode } from "react";

export type SegmentVariantType = "default" | "primary";
export type SegmentSizeType = "small" | "base" | "large";
export type SegmentInlineSizeType = "auto" | "fill";

export type SegmentOptionType<TValue extends string = string> = {
  /** Visible label for the segment. */
  label: ReactNode;
  /** Unique value used for selection. */
  value: TValue;
  /** Disables this option only. */
  disabled?: boolean;
  /** Accessible name when `label` is not plain text. */
  accessibilityLabel?: string;
};

export type SegmentPropsType<TValue extends string = string> = {
  /** Options rendered as mutually exclusive segments. */
  options: SegmentOptionType<TValue>[];
  /** Controlled selected value. */
  value?: TValue;
  /** Uncontrolled initial selected value. */
  defaultValue?: TValue;
  /** Fires when the selected value changes. */
  onChange?: (value: TValue) => void;
  /**
   * Optional visible label above the control.
   * Hidden by default — only render when this prop is provided.
   */
  label?: ReactNode;
  /**
   * Visual style of the active pill.
   * - `default`: white elevated pill on a light track
   * - `primary`: dark filled pill with light text
   */
  variant?: SegmentVariantType;
  /** Control height and type scale. */
  size?: SegmentSizeType;
  /** Stretch the track to fill available width. */
  inlineSize?: SegmentInlineSizeType;
  /** Disables the entire control. */
  disabled?: boolean;
  /** Native form field name. */
  name?: string;
  /** Element id for the root. */
  id?: string;
  /** Accessible name for the radiogroup when no visible label is set. */
  accessibilityLabel?: string;
  className?: string;
  style?: CSSProperties;
};

export type SegmentComponentType = {
  <TValue extends string = string>(
    props: SegmentPropsType<TValue> & { ref?: React.Ref<HTMLDivElement> },
  ): React.ReactElement | null;
  displayName?: string;
};

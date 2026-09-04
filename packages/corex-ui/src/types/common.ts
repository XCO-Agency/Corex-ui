/** Shared prop unions reused across multiple legacy-compatible components. */

export type IconType = JSX.IntrinsicElements["s-icon"]["type"];

export type ToneType =
  | "auto"
  | "info"
  | "success"
  | "warning"
  | "critical"
  | "neutral"
  | "caution"
  | undefined;
export type Tone = ToneType;

export type SparklineColorType = ToneType | (string & {});

export type ButtonVariantType = "primary" | "secondary" | "tertiary" | "plain";
export type ButtonVariant = ButtonVariantType;

export type SizeType = "small" | "medium" | "large";
export type Size = SizeType;

/** Polaris web-component spacing values. Standard for new code. */
export type PolarisSpacingType =
  | "none"
  | "small-500"
  | "small-400"
  | "small-300"
  | "small-200"
  | "small-100"
  | "small"
  | "base"
  | "large"
  | "large-100"
  | "large-200"
  | "large-300"
  | "large-400"
  | "large-500";
export type PolarisSpacing = PolarisSpacingType;

/** @deprecated Kept for backward compatibility. Use `PolarisSpacingType` values such as `small-200` or `base`. */
export type LegacySpacingType =
  | "0"
  | "025"
  | "050"
  | "100"
  | "150"
  | "200"
  | "300"
  | "400"
  | "500"
  | "600"
  | "800"
  | "1000"
  | "1200"
  | "1600"
  | "2000"
  | "2400"
  | "3200";
export type LegacySpacing = LegacySpacingType;

/**
 * Stack gap type: prioritizes the new PolarisSpacingType tokens and pairs,
 * while keeping legacy numeric values for backward compatibility.
 */
export type StackGapType =
  | PolarisSpacingType
  | `${PolarisSpacingType} ${PolarisSpacingType}`
  | (LegacySpacingType & {})
  | (`${LegacySpacingType} ${LegacySpacingType}` & {});
export type StackGap = StackGapType;

export type AlignmentType = "start" | "center" | "end";
export type Alignment = AlignmentType;

export type TextVariantType =
  | "headingXl"
  | "headingLg"
  | "headingMd"
  | "headingSm"
  | "headingXs"
  | "bodyLg"
  | "bodyMd"
  | "bodySm";
export type TextVariant = TextVariantType;

export type TargetType =
  | "_blank"
  | "_self"
  | "_parent"
  | "_top"
  | (string & {});
export type Target = TargetType;

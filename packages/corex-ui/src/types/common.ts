/** Shared prop unions reused across multiple legacy-compatible components. */

export type Tone = "success" | "warning" | "critical" | "info" | "neutral";

export type ButtonVariant = "primary" | "secondary" | "tertiary" | "plain";

export type Size = "small" | "medium" | "large";

/** Polaris web-component spacing values. Prefer these for new code. */
export type PolarisSpacing =
  | "none" | "small-500" | "small-400" | "small-300" | "small-200" | "small-100"
  | "small" | "base" | "large" | "large-100" | "large-200" | "large-300" | "large-400" | "large-500";

/** @deprecated Use `PolarisSpacing` values such as `small` or `base`. */
export type LegacySpacing =
  | "0" | "025" | "050" | "100" | "150" | "200" | "300" | "400" | "500"
  | "600" | "800" | "1000" | "1200" | "1600" | "2000" | "2400" | "3200";

export type StackGap = PolarisSpacing | LegacySpacing | `${PolarisSpacing} ${PolarisSpacing}` | `${LegacySpacing} ${LegacySpacing}`;

export type Alignment = "start" | "center" | "end";

export type TextVariant =
  | "headingXl"
  | "headingLg"
  | "headingMd"
  | "headingSm"
  | "headingXs"
  | "bodyLg"
  | "bodyMd"
  | "bodySm";

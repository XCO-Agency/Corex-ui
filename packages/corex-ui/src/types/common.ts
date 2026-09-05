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

export type SparklineColorType = ToneType | (string & {});

export type ButtonVariantType = "primary" | "secondary" | "tertiary" | "plain";

export type SizeType = "small" | "medium" | "large";

/** Size tokens supported by Polaris web components. */
export type SizeKeywordType =
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

/** Color treatment keyword supported by Polaris web components. */
export type ColorKeywordType = "subdued" | "base" | "strong";

/** Padding keyword: any SizeKeyword token or 'none'. */
export type PaddingKeywordType = SizeKeywordType | "none";

/** Polaris web-component spacing values. Standard for new code. */
export type PolarisSpacingType = PaddingKeywordType;

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
  | "2800"
  | "3200";

/** All accepted single-spacing token inputs. */
export type SpacingTokenType = PolarisSpacingType | LegacySpacingType;

/**
 * Modern Box padding type: accepts 1 to 4 space-separated tokens
 * (block-start inline-end block-end inline-start flow-relative order).
 */
export type BoxPaddingType =
  | SpacingTokenType
  | `${SpacingTokenType} ${SpacingTokenType}`
  | (string & {})
  | number;

/** Directional padding type (1-to-2 value shorthand or single token). */
export type BoxPaddingDirectionType =
  | SpacingTokenType
  | `${SpacingTokenType} ${SpacingTokenType}`
  | ""
  | (string & {})
  | number;

/**
 * Stack gap type: prioritizes the new PolarisSpacingType tokens and pairs,
 * while keeping legacy numeric values for backward compatibility.
 */
export type StackGapType =
  | PolarisSpacingType
  | `${PolarisSpacingType} ${PolarisSpacingType}`
  | (LegacySpacingType & {})
  | (`${LegacySpacingType} ${LegacySpacingType}` & {})
  | number;

export type AlignmentType = "start" | "center" | "end";

export type TextVariantType =
  | "headingXl"
  | "headingLg"
  | "headingMd"
  | "headingSm"
  | "headingXs"
  | "bodyLg"
  | "bodyMd"
  | "bodySm";

export type TargetType = "_blank" | "_self" | "_parent" | "_top" | (string & {});

/** Extracts the native JSX props of any Polaris web component (e.g. 's-grid', 's-box', 's-button'). */
export type PolarisPropsType<TTag extends keyof JSX.IntrinsicElements> =
  Omit<JSX.IntrinsicElements[TTag], "ref" | "key">;

/** Extracts the native DOM element instance of any Polaris custom element. */
export type PolarisElementType<TTag extends keyof HTMLElementTagNameMap> =
  HTMLElementTagNameMap[TTag];


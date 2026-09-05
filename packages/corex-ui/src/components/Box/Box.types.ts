import type { CSSProperties, ElementType, ReactNode } from "react";
import type {
  BoxPaddingDirectionType,
  BoxPaddingType,
  PolarisPropsType,
} from "../../types/common";

type NativeBoxProps = PolarisPropsType<"s-box">;

export type BoxBackgroundType =
  | NonNullable<NativeBoxProps["background"]>
  | "bg"
  | "bg-surface"
  | "bg-surface-secondary"
  | "bg-surface-tertiary"
  | "bg-surface-brand"
  | "bg-surface-strong"
  | "bg-subdued"
  | "bg-fill-transparent"
  | (string & {});

export type BoxBorderWidthType =
  | NonNullable<NativeBoxProps["borderWidth"]>
  | "0165"
  | "025"
  | "050"
  | "100"
  | "200"
  | "400"
  | ""
  | (string & {});

export type BoxBorderStyleType =
  | NonNullable<NativeBoxProps["borderStyle"]>
  | (string & {});

export type BoxBorderColorType =
  | NonNullable<NativeBoxProps["borderColor"]>
  | "border"
  | "border-subdued"
  | "border-hover"
  | "border-disabled"
  | ""
  | (string & {});

export type BoxBorderRadiusType =
  | NonNullable<NativeBoxProps["borderRadius"]>
  | "050"
  | "100"
  | "200"
  | "300"
  | "400"
  | "500"
  | (string & {});

export type BoxOverflowType =
  | NonNullable<NativeBoxProps["overflow"]>
  | (string & {});

export type BoxDisplayType =
  | NonNullable<NativeBoxProps["display"]>
  | (string & {});

export type BoxAccessibilityVisibilityType =
  | NonNullable<NativeBoxProps["accessibilityVisibility"]>
  | (string & {});

export type BoxAccessibilityRoleType =
  | NonNullable<NativeBoxProps["accessibilityRole"]>
  | (string & {});

export type BoxPositionType =
  "relative" | "absolute" | "fixed" | "sticky" | (string & {});

export type BoxAsType =
  "div" | "span" | "section" | "legend" | "ul" | "li" | ElementType | (string & {});

export type ResponsivePropType<T> = T | Record<string, T>;

export type NativeBoxOverridesType = {
  children?: ReactNode;

  // Modern Polaris web component (s-box) properties with legacy token support
  /** Adjust the background of the component ('transparent' | 'base' | 'subdued' | 'strong' or legacy Polaris alias). */
  background?: BoxBackgroundType;
  /** Adjust the width of the border ('small-100' | 'small' | 'base' | 'large' | 'large-100' | 'none' | legacy token). */
  borderWidth?: BoxBorderWidthType;
  /** Adjust the style of the border ('solid' | 'dashed' | 'dotted' | 'none' | ''). */
  borderStyle?: BoxBorderStyleType;
  /** Adjust the color of the border ('subdued' | 'base' | 'strong' | 'transparent' | legacy token). */
  borderColor?: BoxBorderColorType;
  /** Adjust the radius of the border ('none' | 'small-100' | 'small' | 'base' | 'large' | 'large-100' | 'max' | 'full' | legacy token). */
  borderRadius?: BoxBorderRadiusType;

  /**
   * Adjust the padding of all edges using 1-to-4-value flow-relative syntax or responsive keyword.
   * Order: block-start inline-end block-end inline-start.
   * Accepts modern SizeKeyword tokens ('small-200', 'base') as well as legacy Polaris numeric tokens ('200', '400').
   */
  padding?: ResponsivePropType<BoxPaddingType>;
  /** Adjust the block-padding (overrides block value of padding). */
  paddingBlock?: ResponsivePropType<BoxPaddingDirectionType>;
  /** Adjust the block-start padding (overrides block-start of paddingBlock). */
  paddingBlockStart?: ResponsivePropType<BoxPaddingDirectionType>;
  /** Adjust the block-end padding (overrides block-end of paddingBlock). */
  paddingBlockEnd?: ResponsivePropType<BoxPaddingDirectionType>;
  /** Adjust the inline padding (overrides inline value of padding). */
  paddingInline?: ResponsivePropType<BoxPaddingDirectionType>;
  /** Adjust the inline-start padding (overrides inline-start of paddingInline). */
  paddingInlineStart?: ResponsivePropType<BoxPaddingDirectionType>;
  /** Adjust the inline-end padding (overrides inline-end of paddingInline). */
  paddingInlineEnd?: ResponsivePropType<BoxPaddingDirectionType>;
};

export type LegacyBoxPropsType = {
  // Legacy Polaris React compatibility properties (marked @deprecated for modern code)
  /**
   * @deprecated HTML Element type in legacy Polaris React. In Polaris web components, the element is always `<s-box>`.
   */
  as?: BoxAsType;
  /**
   * @deprecated Color of children text.
   */
  color?: string;
  /**
   * @deprecated Vertical start border width.
   */
  borderBlockStartWidth?: BoxBorderWidthType;
  /**
   * @deprecated Vertical end border width.
   */
  borderBlockEndWidth?: BoxBorderWidthType;
  /**
   * @deprecated Horizontal start border width.
   */
  borderInlineStartWidth?: BoxBorderWidthType;
  /**
   * @deprecated Horizontal end border width.
   */
  borderInlineEndWidth?: BoxBorderWidthType;
  /**
   * @deprecated Vertical start horizontal start border radius.
   */
  borderStartStartRadius?: BoxBorderRadiusType;
  /**
   * @deprecated Vertical start horizontal end border radius.
   */
  borderStartEndRadius?: BoxBorderRadiusType;
  /**
   * @deprecated Vertical end horizontal start border radius.
   */
  borderEndStartRadius?: BoxBorderRadiusType;
  /**
   * @deprecated Vertical end horizontal end border radius.
   */
  borderEndEndRadius?: BoxBorderRadiusType;
  /**
   * @deprecated Horizontal content clipping ('hidden' | 'scroll' | 'clip').
   */
  overflowX?: BoxOverflowType;
  /**
   * @deprecated Vertical content clipping ('hidden' | 'scroll' | 'clip').
   */
  overflowY?: BoxOverflowType;
  /**
   * @deprecated Box shadow alias or CSS box-shadow.
   */
  shadow?: string;
  /**
   * @deprecated CSS positioning mode ('relative' | 'absolute' | 'fixed' | 'sticky').
   */
  position?: BoxPositionType;
  /**
   * @deprecated Top position offset.
   */
  insetBlockStart?: ResponsivePropType<string>;
  /**
   * @deprecated Bottom position offset.
   */
  insetBlockEnd?: ResponsivePropType<string>;
  /**
   * @deprecated Left position offset.
   */
  insetInlineStart?: ResponsivePropType<string>;
  /**
   * @deprecated Right position offset.
   */
  insetInlineEnd?: ResponsivePropType<string>;
  /**
   * @deprecated Opacity of box.
   */
  opacity?: string;
  /**
   * @deprecated Outline color.
   */
  outlineColor?: string;
  /**
   * @deprecated Outline style ('solid' | 'dashed').
   */
  outlineStyle?: "solid" | "dashed" | (string & {});
  /**
   * @deprecated Outline width.
   */
  outlineWidth?: string;
  /**
   * @deprecated Visually hides content during print.
   */
  printHidden?: boolean;
  /**
   * @deprecated Visually hides the content while keeping it accessible to screen readers.
   * In modern Polaris web components, this maps directly to `accessibilityVisibility="exclusive"`.
   */
  visuallyHidden?: boolean;
  /**
   * @deprecated Z-index layer of box.
   */
  zIndex?: string | number;

  /**
   * @deprecated Legacy dimension alias. Use `inlineSize` in modern code.
   */
  width?: string;
  /**
   * @deprecated Legacy dimension alias. Use `minInlineSize` in modern code.
   */
  minWidth?: string;
  /**
   * @deprecated Legacy dimension alias. Use `maxInlineSize` in modern code.
   */
  maxWidth?: string;
  /**
   * @deprecated Legacy dimension alias. Use `blockSize` in modern code.
   */
  height?: string;
  /**
   * @deprecated Legacy dimension alias. Use `minBlockSize` in modern code.
   */
  minHeight?: string;
  /**
   * @deprecated Legacy dimension alias. Use `maxBlockSize` in modern code.
   */
  maxHeight?: string;
};

export type BoxPropsType = Omit<
  NativeBoxProps,
  keyof NativeBoxOverridesType | "slot"
> &
  NativeBoxOverridesType &
  LegacyBoxPropsType & {
    role?: string;
    tabIndex?: number;
    id?: string;
    className?: string;
    style?: CSSProperties;
    slot?: string;
    [key: `aria-${string}`]: unknown;
    [key: `data-${string}`]: unknown;
  };

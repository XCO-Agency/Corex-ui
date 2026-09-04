import type { CSSProperties, ElementType, ReactNode } from "react";
import {
  LegacySpacingType,
  PolarisSpacingType,
  StackGapType,
} from "../../types/common";

export type BoxBackgroundType =
  | "transparent"
  | "base"
  | "subdued"
  | "strong"
  | (string & {});

export type BoxBorderWidthType =
  | "small-100"
  | "small"
  | "base"
  | "large"
  | "large-100"
  | "none"
  | ""
  | (string & {});

export type BoxBorderStyleType =
  | "solid"
  | "dashed"
  | "dotted"
  | "none"
  | ""
  | (string & {});

export type BoxBorderColorType =
  | "subdued"
  | "base"
  | "strong"
  | "transparent"
  | ""
  | (string & {});

export type BoxBorderRadiusType =
  | "none"
  | "small-100"
  | "small"
  | "base"
  | "large"
  | "large-100"
  | "full"
  | (string & {});

export type BoxOverflowType =
  | "hidden"
  | "visible"
  | "scroll"
  | "auto"
  | "clip"
  | (string & {});

export type BoxDisplayType = "auto" | "none" | (string & {});

export type BoxAccessibilityVisibilityType =
  | "exclusive"
  | "hidden"
  | "visible"
  | (string & {});

export type BoxAccessibilityRoleType =
  | "main"
  | "header"
  | "footer"
  | "section"
  | "aside"
  | "navigation"
  | "ordered-list"
  | "list-item"
  | "list-item-separator"
  | "unordered-list"
  | "separator"
  | "status"
  | "alert"
  | "generic"
  | "presentation"
  | "none"
  | (string & {});

export type BoxPositionType =
  | "relative"
  | "absolute"
  | "fixed"
  | "sticky"
  | (string & {});

export type BoxAsType =
  | "div"
  | "span"
  | "section"
  | "legend"
  | "ul"
  | "li"
  | ElementType
  | (string & {});

export type ResponsivePropType<T> = T | Record<string, T>;

export type BoxPropsType = {
  children?: ReactNode;

  // Modern Polaris web component (s-box) properties
  /** Adjust the background of the component ('transparent' | 'base' | 'subdued' | 'strong' or CSS/token string). */
  background?: BoxBackgroundType;
  /** Adjust the width of the border ('small-100' | 'small' | 'base' | 'large' | 'large-100' | 'none' | ''). */
  borderWidth?: BoxBorderWidthType;
  /** Adjust the style of the border ('solid' | 'dashed' | 'dotted' | 'none' | ''). */
  borderStyle?: BoxBorderStyleType;
  /** Adjust the color of the border ('subdued' | 'base' | 'strong' | 'transparent' | ''). */
  borderColor?: BoxBorderColorType;
  /** Adjust the radius of the border ('none' | 'small-100' | 'small' | 'base' | 'large' | 'large-100' | 'full'). */
  borderRadius?: BoxBorderRadiusType;
  /** Border shorthand or override. */
  border?: string;
  /**
   * Adjust the padding of all edges using 1-to-4-value flow-relative syntax or responsive keyword.
   * Order: block-start inline-end block-end inline-start.
   */
  padding?: StackGapType;
  /** Adjust the block-padding (overrides block value of padding). */
  paddingBlock?: ResponsivePropType<string>;
  /** Adjust the block-start padding (overrides block-start of paddingBlock). */
  paddingBlockStart?: ResponsivePropType<string>;
  /** Adjust the block-end padding (overrides block-end of paddingBlock). */
  paddingBlockEnd?: ResponsivePropType<string>;
  /** Adjust the inline padding (overrides inline value of padding). */
  paddingInline?: ResponsivePropType<string>;
  /** Adjust the inline-start padding (overrides inline-start of paddingInline). */
  paddingInlineStart?: ResponsivePropType<string>;
  /** Adjust the inline-end padding (overrides inline-end of paddingInline). */
  paddingInlineEnd?: ResponsivePropType<string>;
  /** Sets the outer display type of the component ('auto' | 'none'). */
  display?: BoxDisplayType;
  /** Adjust the block size (CSS block-size / height). */
  blockSize?: string;
  /** Adjust the minimum block size. */
  minBlockSize?: string;
  /** Adjust the maximum block size. */
  maxBlockSize?: string;
  /** Adjust the inline size (CSS inline-size / width). */
  inlineSize?: string;
  /** Adjust the minimum inline size. */
  minInlineSize?: string;
  /** Adjust the maximum inline size. */
  maxInlineSize?: string;
  /** Adjust the overflow behavior ('hidden' | 'visible' | 'scroll' | 'auto' | 'clip'). */
  overflow?: BoxOverflowType;
  /** Accessibility label for screen readers. */
  accessibilityLabel?: string;
  /** Accessibility role (e.g. 'generic', 'presentation', 'navigation', 'status', 'alert'). */
  accessibilityRole?: BoxAccessibilityRoleType;
  /** Accessibility visibility ('exclusive' | 'hidden' | 'visible'). */
  accessibilityVisibility?: BoxAccessibilityVisibilityType;

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

  role?: string;
  tabIndex?: number;
  id?: string;
  className?: string;
  style?: CSSProperties;
  slot?: string;
  [key: `aria-${string}`]: unknown;
  [key: `data-${string}`]: unknown;
};

export type BoxProps = BoxPropsType;

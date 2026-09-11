import type { CSSProperties, ElementType, HTMLAttributes, ReactNode } from "react";
import type {
  BlockAlignmentType,
  BoxPaddingDirectionType,
  BoxPaddingType,
  InlineAlignmentType,
  StackGapType,
} from "../../types/common";

export type StackDirectionType =
  "row" | "row-reverse" | "column" | "column-reverse" | "inline" | "block";

export type InlineStackPropsType = Omit<
  HTMLAttributes<HTMLDivElement>,
  "children" | "className" | "style" | "id" | "direction"
> & {
  children?: ReactNode;
  /**
   * HTML element or custom component to render as.
   * @default "div"
   */
  as?: ElementType;
  /**
   * Spacing between children.
   * Uses Polaris spacing tokens (e.g. `"small-200"`, `"base"`).
   * Legacy numeric values such as `"200"` and standard CSS length values are supported.
   */
  gap?: StackGapType;
  /** Spacing between rows. */
  rowGap?: StackGapType;
  /** Spacing between columns. */
  columnGap?: StackGapType;
  /**
   * Horizontal alignment (main axis in row direction).
   * @deprecated Use `justifyContent` instead.
   */
  align?: InlineAlignmentType;
  /**
   * Vertical alignment (cross axis in row direction).
   * @deprecated Use `alignItems` instead.
   */
  blockAlign?: BlockAlignmentType;
  /** CSS `justifyContent` property. Takes precedence over `align`. */
  justifyContent?: CSSProperties["justifyContent"];
  /** CSS `alignItems` property. Takes precedence over `blockAlign`. */
  alignItems?: CSSProperties["alignItems"];
  /** CSS `alignContent` property. */
  alignContent?: CSSProperties["alignContent"];

  /**
   * Wrap stack elements to additional rows as needed.
   * Accepts boolean (`true` -> "wrap", `false` -> "nowrap") or standard CSS `flexWrap` keywords.
   */
  wrap?: boolean;
  /**
   * Flex grow factor. When `true`, expands to fill available space (`flex-grow: 1`).
   */
  grow?: boolean | number | CSSProperties["flexGrow"];
  /**
   * Flex shrink factor. When `false`, prevents shrinking (`flex-shrink: 0`).
   */
  shrink?: boolean;
  /** Flex shorthand property. */
  flex?: CSSProperties["flex"] | number;
  /** Flex order. */
  order?: CSSProperties["order"];
  /** CSS display property. Defaults to "flex", or "inline-flex" if `inline` is true. */

  /** Render as an inline flex container (`display: inline-flex`). */
  inline?: boolean;
  /** Padding around the stack. Supports Polaris spacing tokens. */
  padding?: BoxPaddingType;
  paddingBlock?: BoxPaddingDirectionType;
  paddingBlockStart?: BoxPaddingDirectionType;
  paddingBlockEnd?: BoxPaddingDirectionType;
  paddingInline?: BoxPaddingDirectionType;
  paddingInlineStart?: BoxPaddingDirectionType;
  paddingInlineEnd?: BoxPaddingDirectionType;
  /** Width or inlineSize. */

  inlineSize?: CSSProperties["inlineSize"];
  minInlineSize?: CSSProperties["minInlineSize"];
  maxInlineSize?: CSSProperties["maxInlineSize"];
  /** Height or blockSize. */
  blockSize?: CSSProperties["blockSize"];
  minBlockSize?: CSSProperties["minBlockSize"];
  maxBlockSize?: CSSProperties["maxBlockSize"];
  /** Overflow behavior. */
  overflow?: CSSProperties["overflow"];
  overflowX?: CSSProperties["overflowX"];
  overflowY?: CSSProperties["overflowY"];
  /** Position. */
  position?: CSSProperties["position"];
  /** Additional CSS class names. */
  className?: string;
  /** Inline CSS styles. */
  style?: CSSProperties;
  /** Unique identifier. */
  id?: string;
};

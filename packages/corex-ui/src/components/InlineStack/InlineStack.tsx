import {
  forwardRef,
  type CSSProperties,
  type ForwardRefExoticComponent,
  type RefAttributes,
} from "react";
import { mapAlignment, resolveSpacing } from "../../core/stackUtils";
import type { InlineStackPropsType } from "./InlineStack.types";

/**
 * Layout primitive for organizing items horizontally in a row.
 * Renders as a standard `<div>` with flexbox styles, fully compatible with Polaris spacing tokens.
 */
export const InlineStack: ForwardRefExoticComponent<
  InlineStackPropsType & RefAttributes<HTMLDivElement>
> = forwardRef<HTMLDivElement, InlineStackPropsType>(function InlineStack(
  {
    as,
    children,
    gap,
    rowGap,
    columnGap,
    align,
    blockAlign,
    justifyContent,
    alignItems,
    alignContent,
    wrap,
    grow,
    shrink,
    flex,
    order,
    inline,
    padding,
    paddingBlock,
    paddingBlockStart,
    paddingBlockEnd,
    paddingInline,
    paddingInlineStart,
    paddingInlineEnd,

    blockSize,
    minBlockSize,
    maxBlockSize,
    inlineSize,
    minInlineSize,
    maxInlineSize,
    overflow,
    overflowX,
    overflowY,
    position,
    className,
    style,
    id,
    ...rest
  },
  ref,
) {
  const resolvedJustifyContent = mapAlignment(justifyContent ?? align);
  const resolvedAlignItems = mapAlignment(alignItems ?? blockAlign);
  const resolvedAlignContent = mapAlignment(alignContent);

  const resolvedGap = resolveSpacing(gap);
  const resolvedRowGap = resolveSpacing(rowGap);
  const resolvedColumnGap = resolveSpacing(columnGap);

  const computedStyles: CSSProperties = {
    display: "flex",
    flexDirection: "row",
  };

  if (resolvedGap) computedStyles.gap = resolvedGap;
  if (resolvedRowGap) computedStyles.rowGap = resolvedRowGap;
  if (resolvedColumnGap) computedStyles.columnGap = resolvedColumnGap;
  if (resolvedJustifyContent) {
    computedStyles.justifyContent =
      resolvedJustifyContent as CSSProperties["justifyContent"];
  }
  if (resolvedAlignItems) {
    computedStyles.alignItems = resolvedAlignItems as CSSProperties["alignItems"];
  }
  if (resolvedAlignContent) {
    computedStyles.alignContent = resolvedAlignContent as CSSProperties["alignContent"];
  }

  if (wrap !== undefined) {
    computedStyles.flexWrap = wrap ? "wrap" : "nowrap";
  }
  if (grow !== undefined) {
    computedStyles.flexGrow = typeof grow === "boolean" ? (grow ? 1 : 0) : grow;
  }
  if (shrink !== undefined) {
    computedStyles.flexShrink = shrink ? 1 : 0;
  }
  if (flex !== undefined) computedStyles.flex = flex;
  if (order !== undefined) computedStyles.order = order;

  if (padding) computedStyles.padding = resolveSpacing(padding);
  if (paddingBlock) computedStyles.paddingBlock = resolveSpacing(paddingBlock);
  if (paddingBlockStart) {
    computedStyles.paddingBlockStart = resolveSpacing(paddingBlockStart);
  }
  if (paddingBlockEnd) {
    computedStyles.paddingBlockEnd = resolveSpacing(paddingBlockEnd);
  }
  if (paddingInline) computedStyles.paddingInline = resolveSpacing(paddingInline);
  if (paddingInlineStart) {
    computedStyles.paddingInlineStart = resolveSpacing(paddingInlineStart);
  }
  if (paddingInlineEnd) {
    computedStyles.paddingInlineEnd = resolveSpacing(paddingInlineEnd);
  }

  if (inlineSize !== undefined) computedStyles.width = inlineSize;
  if (minInlineSize !== undefined) computedStyles.minWidth = minInlineSize;
  if (maxInlineSize !== undefined) computedStyles.maxWidth = maxInlineSize;
  if (blockSize !== undefined) computedStyles.height = blockSize;
  if (minBlockSize !== undefined) computedStyles.minHeight = minBlockSize;
  if (maxBlockSize !== undefined) computedStyles.maxHeight = maxBlockSize;

  if (overflow) computedStyles.overflow = overflow;
  if (overflowX) computedStyles.overflowX = overflowX;
  if (overflowY) computedStyles.overflowY = overflowY;
  if (position) computedStyles.position = position;

  const finalStyle: CSSProperties = style
    ? { ...computedStyles, ...style }
    : computedStyles;

  const Component = (as || "div") as "div";

  return (
    <Component ref={ref} id={id} className={className} style={finalStyle} {...rest}>
      {children}
    </Component>
  );
});

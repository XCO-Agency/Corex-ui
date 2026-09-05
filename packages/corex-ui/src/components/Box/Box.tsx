import {
  forwardRef,
  type ForwardRefExoticComponent,
  type RefAttributes,
} from "react";
import type { CSSProperties } from "react";
import { createWebComponent } from "../../core/createWebComponent";
import type { BoxPropsType } from "./Box.types";
import {
  mapLegacyBackground,
  mapLegacyBorderColor,
  mapLegacyBorderRadius,
  mapLegacyBorderWidth,
  mapLegacySpacing,
} from "../../core/legacySpacing";

export const BOX_DOM_PROPS = [
  "padding",
  "paddingBlock",
  "paddingBlockStart",
  "paddingBlockEnd",
  "paddingInline",
  "paddingInlineStart",
  "paddingInlineEnd",
  "background",
  "border",
  "borderWidth",
  "borderStyle",
  "borderColor",
  "borderRadius",
  "blockSize",
  "minBlockSize",
  "maxBlockSize",
  "inlineSize",
  "minInlineSize",
  "maxInlineSize",
  "accessibilityRole",
  "accessibilityLabel",
  "accessibilityVisibility",
  "display",
  "overflow",
] as const;

const SBox = createWebComponent<HTMLElement>("s-box", {
  domProps: [...BOX_DOM_PROPS],
});

/**
 * Box component wrapping Polaris `<s-box>`.
 * Supports modern `<s-box>` props (`blockSize`, `inlineSize`, `accessibilityVisibility`, etc.)
 * as well as legacy `@shopify/polaris` Box props for full backward compatibility.
 */
export const Box: ForwardRefExoticComponent<
  BoxPropsType & RefAttributes<HTMLElement>
> = forwardRef<HTMLElement, BoxPropsType>(function Box(
  {
    children,
    as: _as,
    color,
    shadow,
    position,
    insetBlockStart,
    insetBlockEnd,
    insetInlineStart,
    insetInlineEnd,
    opacity,
    outlineColor,
    outlineStyle,
    outlineWidth,
    printHidden,
    visuallyHidden,
    zIndex,
    width,
    minWidth,
    maxWidth,
    height,
    minHeight,
    maxHeight,
    overflowX,
    overflowY,
    blockSize,
    minBlockSize,
    maxBlockSize,
    inlineSize,
    minInlineSize,
    maxInlineSize,
    accessibilityVisibility,
    style,
    className,
    padding,
    paddingBlock,
    paddingBlockStart,
    paddingBlockEnd,
    paddingInline,
    paddingInlineStart,
    paddingInlineEnd,
    background,
    borderColor,
    borderRadius,
    borderWidth,
    ...rest
  },
  ref,
) {
  // Translate legacy `visuallyHidden` to Polaris web component `accessibilityVisibility="exclusive"`
  const resolvedAccessibilityVisibility =
    accessibilityVisibility ?? (visuallyHidden ? "exclusive" : undefined);

  // Resolve dimensions: modern props take precedence, fallback to legacy width/height props
  const resolvedBlockSize = blockSize ?? height;
  const resolvedMinBlockSize = minBlockSize ?? minHeight;
  const resolvedMaxBlockSize = maxBlockSize ?? maxHeight;
  const resolvedInlineSize = inlineSize ?? width;
  const resolvedMinInlineSize = minInlineSize ?? minWidth;
  const resolvedMaxInlineSize = maxInlineSize ?? maxWidth;

  // Resolve legacy styling mappings
  const resolvedBackground = mapLegacyBackground(background);
  const resolvedBorderColor = mapLegacyBorderColor(borderColor);
  const resolvedBorderRadius = mapLegacyBorderRadius(borderRadius);
  const resolvedBorderWidth = mapLegacyBorderWidth(borderWidth);

  // Resolve padding props
  const resolvedPadding = mapLegacySpacing(padding);
  const resolvedPaddingBlock = mapLegacySpacing(paddingBlock);
  const resolvedPaddingBlockStart = mapLegacySpacing(paddingBlockStart);
  const resolvedPaddingBlockEnd = mapLegacySpacing(paddingBlockEnd);
  const resolvedPaddingInline = mapLegacySpacing(paddingInline);
  const resolvedPaddingInlineStart = mapLegacySpacing(paddingInlineStart);
  const resolvedPaddingInlineEnd = mapLegacySpacing(paddingInlineEnd);

  // Merge legacy layout and styling properties into inline styles for seamless rendering
  const legacyStyles: CSSProperties = {};
  if (color) legacyStyles.color = color;
  if (shadow) legacyStyles.boxShadow = shadow;
  if (position) legacyStyles.position = position as CSSProperties["position"];
  if (typeof insetBlockStart === "string") legacyStyles.top = insetBlockStart;
  if (typeof insetBlockEnd === "string") legacyStyles.bottom = insetBlockEnd;
  if (typeof insetInlineStart === "string") legacyStyles.left = insetInlineStart;
  if (typeof insetInlineEnd === "string") legacyStyles.right = insetInlineEnd;
  if (opacity) legacyStyles.opacity = opacity;
  if (outlineColor) legacyStyles.outlineColor = outlineColor;
  if (outlineStyle)
    legacyStyles.outlineStyle = outlineStyle as CSSProperties["outlineStyle"];
  if (outlineWidth) legacyStyles.outlineWidth = outlineWidth;
  if (zIndex !== undefined) legacyStyles.zIndex = zIndex;
  if (overflowX) legacyStyles.overflowX = overflowX as CSSProperties["overflowX"];
  if (overflowY) legacyStyles.overflowY = overflowY as CSSProperties["overflowY"];

  const resolvedStyle: CSSProperties | undefined =
    Object.keys(legacyStyles).length > 0 || style
      ? { ...legacyStyles, ...style }
      : undefined;

  const resolvedClassName = printHidden
    ? className
      ? `${className} print:hidden`
      : "print:hidden"
    : className;

  return (
    <SBox
      ref={ref}
      blockSize={resolvedBlockSize}
      minBlockSize={resolvedMinBlockSize}
      maxBlockSize={resolvedMaxBlockSize}
      inlineSize={resolvedInlineSize}
      minInlineSize={resolvedMinInlineSize}
      maxInlineSize={resolvedMaxInlineSize}
      accessibilityVisibility={resolvedAccessibilityVisibility}
      style={resolvedStyle}
      className={resolvedClassName}
      padding={resolvedPadding}
      paddingBlock={resolvedPaddingBlock}
      paddingBlockStart={resolvedPaddingBlockStart}
      paddingBlockEnd={resolvedPaddingBlockEnd}
      paddingInline={resolvedPaddingInline}
      paddingInlineStart={resolvedPaddingInlineStart}
      paddingInlineEnd={resolvedPaddingInlineEnd}
      background={resolvedBackground}
      borderColor={resolvedBorderColor}
      borderRadius={resolvedBorderRadius}
      borderWidth={resolvedBorderWidth}
      {...rest}
    >
      {children}
    </SBox>
  );
});

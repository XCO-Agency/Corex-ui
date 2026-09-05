import {
  forwardRef,
  type ForwardRefExoticComponent,
  type RefAttributes,
} from "react";
import type { CSSProperties } from "react";
import { createWebComponent } from "../../core/createWebComponent";
import {
  mapLegacyBackground,
  mapLegacyBorderColor,
  mapLegacyBorderRadius,
  mapLegacyBorderWidth,
  mapLegacySpacing,
} from "../../core/legacySpacing";
import { BOX_DOM_PROPS } from "../Box";
import type {
  GridComponentType,
  GridItemPropsType,
  GridPropsType,
} from "./Grid.types";

const SGrid = createWebComponent<HTMLElement>("s-grid", {
  domProps: [
    ...BOX_DOM_PROPS,
    "gridTemplateColumns",
    "gridTemplateRows",
    "justifyItems",
    "alignItems",
    "placeItems",
    "justifyContent",
    "alignContent",
    "placeContent",
    "gap",
    "rowGap",
    "columnGap",
  ],
});

const SGridItem = createWebComponent<HTMLElement>("s-grid-item", {
  domProps: [
    ...BOX_DOM_PROPS,
    "gridColumn",
    "gridRow",
  ],
});

function resolveGridColumns(
  gridTemplateColumns?: unknown,
  columns?: unknown,
): string | undefined {
  if (gridTemplateColumns) return String(gridTemplateColumns);
  if (columns === undefined || columns === null) return undefined;
  if (typeof columns === "number") return `repeat(${columns}, minmax(0, 1fr))`;
  return String(columns);
}

function resolveGridRows(
  gridTemplateRows?: unknown,
  rows?: unknown,
): string | undefined {
  if (gridTemplateRows) return String(gridTemplateRows);
  if (rows === undefined || rows === null) return undefined;
  if (typeof rows === "number") return `repeat(${rows}, minmax(0, 1fr))`;
  return String(rows);
}

function resolveGridColumn(
  gridColumn?: unknown,
  columnSpan?: unknown,
  column?: unknown,
): string | undefined {
  if (gridColumn !== undefined && gridColumn !== null) return String(gridColumn);
  if (columnSpan !== undefined && columnSpan !== null) return `span ${columnSpan}`;
  if (column !== undefined && column !== null) return String(column);
  return undefined;
}

function resolveGridRow(
  gridRow?: unknown,
  rowSpan?: unknown,
  row?: unknown,
): string | undefined {
  if (gridRow !== undefined && gridRow !== null) return String(gridRow);
  if (rowSpan !== undefined && rowSpan !== null) return `span ${rowSpan}`;
  if (row !== undefined && row !== null) return String(row);
  return undefined;
}

/**
 * Grid.Item component wrapping Polaris `<s-grid-item>`.
 * Extends `BoxElement` props with `gridColumn`, `gridRow`, and span aliases.
 */
export const GridItem: ForwardRefExoticComponent<
  GridItemPropsType & RefAttributes<HTMLElement>
> = forwardRef<HTMLElement, GridItemPropsType>(
  function GridItem(
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
      gridColumn,
      gridRow,
      columnSpan,
      rowSpan,
      column,
      row,
      area,
      ...rest
    },
    ref,
  ) {
    const resolvedAccessibilityVisibility =
      accessibilityVisibility ?? (visuallyHidden ? "exclusive" : undefined);

    const resolvedBlockSize = blockSize ?? height;
    const resolvedMinBlockSize = minBlockSize ?? minHeight;
    const resolvedMaxBlockSize = maxBlockSize ?? maxHeight;
    const resolvedInlineSize = inlineSize ?? width;
    const resolvedMinInlineSize = minInlineSize ?? minWidth;
    const resolvedMaxInlineSize = maxInlineSize ?? maxWidth;

    const resolvedBackground = mapLegacyBackground(background);
    const resolvedBorderColor = mapLegacyBorderColor(borderColor);
    const resolvedBorderRadius = mapLegacyBorderRadius(borderRadius);
    const resolvedBorderWidth = mapLegacyBorderWidth(borderWidth);

    const resolvedPadding = mapLegacySpacing(padding);
    const resolvedPaddingBlock = mapLegacySpacing(paddingBlock);
    const resolvedPaddingBlockStart = mapLegacySpacing(paddingBlockStart);
    const resolvedPaddingBlockEnd = mapLegacySpacing(paddingBlockEnd);
    const resolvedPaddingInline = mapLegacySpacing(paddingInline);
    const resolvedPaddingInlineStart = mapLegacySpacing(paddingInlineStart);
    const resolvedPaddingInlineEnd = mapLegacySpacing(paddingInlineEnd);

    const resolvedGridColumn = resolveGridColumn(gridColumn, columnSpan, column);
    const resolvedGridRow = resolveGridRow(gridRow, rowSpan, row);

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
    if (area) legacyStyles.gridArea = area;

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
      <SGridItem
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
        gridColumn={resolvedGridColumn}
        gridRow={resolvedGridRow}
        {...rest}
      >
        {children}
      </SGridItem>
    );
  },
);

/**
 * Grid component wrapping Polaris `<s-grid>`.
 * Extends `BoxElement` props with grid-template sizing, alignments, and spacing gaps.
 * Provides `<Grid.Item>` compound component.
 */
const GridRoot = forwardRef<HTMLElement, GridPropsType>(function Grid(
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
    gridTemplateColumns,
    gridTemplateRows,
    justifyItems,
    alignItems,
    placeItems,
    justifyContent,
    alignContent,
    placeContent,
    gap,
    rowGap,
    columnGap,
    columns,
    rows,
    areas,
    ...rest
  },
  ref,
) {
  const resolvedAccessibilityVisibility =
    accessibilityVisibility ?? (visuallyHidden ? "exclusive" : undefined);

  const resolvedBlockSize = blockSize ?? height;
  const resolvedMinBlockSize = minBlockSize ?? minHeight;
  const resolvedMaxBlockSize = maxBlockSize ?? maxHeight;
  const resolvedInlineSize = inlineSize ?? width;
  const resolvedMinInlineSize = minInlineSize ?? minWidth;
  const resolvedMaxInlineSize = maxInlineSize ?? maxWidth;

  const resolvedBackground = mapLegacyBackground(background);
  const resolvedBorderColor = mapLegacyBorderColor(borderColor);
  const resolvedBorderRadius = mapLegacyBorderRadius(borderRadius);
  const resolvedBorderWidth = mapLegacyBorderWidth(borderWidth);

  const resolvedPadding = mapLegacySpacing(padding);
  const resolvedPaddingBlock = mapLegacySpacing(paddingBlock);
  const resolvedPaddingBlockStart = mapLegacySpacing(paddingBlockStart);
  const resolvedPaddingBlockEnd = mapLegacySpacing(paddingBlockEnd);
  const resolvedPaddingInline = mapLegacySpacing(paddingInline);
  const resolvedPaddingInlineStart = mapLegacySpacing(paddingInlineStart);
  const resolvedPaddingInlineEnd = mapLegacySpacing(paddingInlineEnd);

  const resolvedColumns = resolveGridColumns(gridTemplateColumns, columns);
  const resolvedRows = resolveGridRows(gridTemplateRows, rows);
  const resolvedGap = mapLegacySpacing(gap);
  const resolvedRowGap = mapLegacySpacing(rowGap);
  const resolvedColumnGap = mapLegacySpacing(columnGap);

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
  if (areas) legacyStyles.gridTemplateAreas = areas;

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
    <SGrid
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
      gridTemplateColumns={resolvedColumns}
      gridTemplateRows={resolvedRows}
      justifyItems={justifyItems}
      alignItems={alignItems}
      placeItems={placeItems}
      justifyContent={justifyContent}
      alignContent={alignContent}
      placeContent={placeContent}
      gap={resolvedGap}
      rowGap={resolvedRowGap}
      columnGap={resolvedColumnGap}
      {...rest}
    >
      {children}
    </SGrid>
  );
});

export const Grid = Object.assign(GridRoot, {
  Item: GridItem,
}) as GridComponentType;

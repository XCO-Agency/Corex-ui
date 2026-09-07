import { forwardRef, type ForwardRefExoticComponent, type RefAttributes } from "react";
import type { CSSProperties, Ref } from "react";
import { createWebComponent } from "../../core/createWebComponent";
import {
  mapLegacyBackground,
  mapLegacyBorderColor,
  mapLegacyBorderRadius,
  mapLegacyBorderWidth,
  mapLegacySpacing,
} from "../../core/legacySpacing";
import {
  useDimension,
  resolveResponsiveValue,
  type BreakpointType,
  type ResponsivePropType,
} from "../../hooks/useDimension";
import { BOX_DOM_PROPS } from "../Box";
import type { GridComponentType, GridItemPropsType, GridPropsType } from "./Grid.types";

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
  domProps: [...BOX_DOM_PROPS, "gridColumn", "gridRow"],
});

function formatTrackValue(val: unknown): string {
  if (typeof val === "number") {
    if (val <= 0) return "1fr";
    return Array.from({ length: val }, () => "1fr").join(" ");
  }
  if (typeof val === "string") {
    const trimmed = val.trim();
    if (!isNaN(Number(trimmed)) && trimmed !== "") {
      const num = Number(trimmed);
      if (num <= 0) return "1fr";
      return Array.from({ length: num }, () => "1fr").join(" ");
    }
    return trimmed;
  }
  return String(val);
}

function resolveGridTrack(
  templateTrack?: unknown,
  trackProp?: unknown,
  breakpoint: BreakpointType = "lg",
): string | undefined {
  if (templateTrack !== undefined && templateTrack !== null) {
    if (typeof templateTrack === "object") {
      const resolved = resolveResponsiveValue(
        templateTrack as ResponsivePropType<string | number>,
        breakpoint,
      );
      return resolved !== undefined ? formatTrackValue(resolved) : undefined;
    }
    return String(templateTrack);
  }

  if (trackProp === undefined || trackProp === null) return undefined;

  if (typeof trackProp === "object") {
    const resolved = resolveResponsiveValue(
      trackProp as ResponsivePropType<string | number>,
      breakpoint,
    );
    return resolved !== undefined ? formatTrackValue(resolved) : undefined;
  }

  return formatTrackValue(trackProp);
}

function resolveGridColumns(
  gridTemplateColumns?: unknown,
  columns?: unknown,
  breakpoint: BreakpointType = "lg",
): string | undefined {
  return resolveGridTrack(gridTemplateColumns, columns, breakpoint);
}

function resolveGridRows(
  gridTemplateRows?: unknown,
  rows?: unknown,
  breakpoint: BreakpointType = "lg",
): string | undefined {
  return resolveGridTrack(gridTemplateRows, rows, breakpoint);
}

function resolveGridColumn(
  gridColumn?: unknown,
  columnSpan?: unknown,
  column?: unknown,
  breakpoint: BreakpointType = "lg",
): string | undefined {
  if (gridColumn !== undefined && gridColumn !== null) {
    if (typeof gridColumn === "object") {
      const resolved = resolveResponsiveValue(
        gridColumn as ResponsivePropType<string | number>,
        breakpoint,
      );
      return resolved !== undefined ? String(resolved) : undefined;
    }
    return String(gridColumn);
  }
  if (columnSpan !== undefined && columnSpan !== null) {
    if (typeof columnSpan === "object") {
      const resolved = resolveResponsiveValue(
        columnSpan as ResponsivePropType<string | number>,
        breakpoint,
      );
      return resolved !== undefined ? `span ${resolved}` : undefined;
    }
    return `span ${columnSpan}`;
  }
  if (column !== undefined && column !== null) {
    if (typeof column === "object") {
      const resolved = resolveResponsiveValue(
        column as ResponsivePropType<string | number>,
        breakpoint,
      );
      return resolved !== undefined ? String(resolved) : undefined;
    }
    return String(column);
  }
  return undefined;
}

function resolveGridRow(
  gridRow?: unknown,
  rowSpan?: unknown,
  row?: unknown,
  breakpoint: BreakpointType = "lg",
): string | undefined {
  if (gridRow !== undefined && gridRow !== null) {
    if (typeof gridRow === "object") {
      const resolved = resolveResponsiveValue(
        gridRow as ResponsivePropType<string | number>,
        breakpoint,
      );
      return resolved !== undefined ? String(resolved) : undefined;
    }
    return String(gridRow);
  }
  if (rowSpan !== undefined && rowSpan !== null) {
    if (typeof rowSpan === "object") {
      const resolved = resolveResponsiveValue(
        rowSpan as ResponsivePropType<string | number>,
        breakpoint,
      );
      return resolved !== undefined ? `span ${resolved}` : undefined;
    }
    return `span ${rowSpan}`;
  }
  if (row !== undefined && row !== null) {
    if (typeof row === "object") {
      const resolved = resolveResponsiveValue(
        row as ResponsivePropType<string | number>,
        breakpoint,
      );
      return resolved !== undefined ? String(resolved) : undefined;
    }
    return String(row);
  }
  return undefined;
}

function mergeRefs<T>(...refs: (Ref<T> | undefined)[]) {
  return (node: T) => {
    for (const ref of refs) {
      if (typeof ref === "function") {
        ref(node);
      } else if (ref && typeof ref === "object" && "current" in ref) {
        (ref as React.MutableRefObject<T | null>).current = node;
      }
    }
  };
}

/**
 * Grid.Item component wrapping Polaris `<s-grid-item>`.
 * Extends `BoxElement` props with `gridColumn`, `gridRow`, and span aliases.
 */
export const GridItem: ForwardRefExoticComponent<
  GridItemPropsType & RefAttributes<HTMLElement>
> = forwardRef<HTMLElement, GridItemPropsType>(function GridItem(
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
  const { breakpoint } = useDimension();

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

  const resolvedGridColumn = resolveGridColumn(gridColumn, columnSpan, column, breakpoint);
  const resolvedGridRow = resolveGridRow(gridRow, rowSpan, row, breakpoint);

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
});

/**
 * Grid component wrapping Polaris `<s-grid>`.
 * Extends `BoxElement` props with grid-template sizing, alignments, and spacing gaps.
 * Provides `<Grid.Item>` compound component and dynamic responsive layout via `useDimension`.
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
    gap = "base",
    rowGap,
    columnGap,
    columns,
    rows,
    areas,
    ...rest
  },
  forwardedRef,
) {
  const { breakpoint, ref: measureRef } = useDimension();
  const mergedRef = forwardedRef ? mergeRefs(forwardedRef, measureRef) : measureRef;

  const resolvedAccessibilityVisibility =
    accessibilityVisibility ?? (visuallyHidden ? "exclusive" : undefined);

  const resolvedBlockSize = blockSize ?? height;
  const resolvedMinBlockSize = minBlockSize ?? minHeight;
  const resolvedMaxBlockSize = maxBlockSize ?? maxHeight;
  const resolvedInlineSize = inlineSize ?? width ?? "100%";
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

  const resolvedColumns = resolveGridColumns(gridTemplateColumns, columns, breakpoint);
  const resolvedRows = resolveGridRows(gridTemplateRows, rows, breakpoint);
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
      ref={mergedRef}
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

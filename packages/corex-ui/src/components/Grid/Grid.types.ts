import type {
  CSSProperties,
  ForwardRefExoticComponent,
  RefAttributes,
} from "react";
import type {
  BoxPaddingDirectionType,
  BoxPaddingType,
  PolarisPropsType,
} from "../../types/common";
import type {
  LegacyBoxPropsType,
  NativeBoxOverridesType,
  ResponsivePropType,
} from "../Box/Box.types";

type NativeGridProps = PolarisPropsType<"s-grid">;
type NativeGridItemProps = PolarisPropsType<"s-grid-item">;

// Keyword type aliases extracted directly from Polaris web-component definitions
export type GridJustifyItemsKeywordType = NonNullable<NativeGridProps["justifyItems"]>;
export type GridAlignItemsKeywordType = NonNullable<NativeGridProps["alignItems"]>;
export type GridPlaceItemsKeywordType = NonNullable<NativeGridProps["placeItems"]>;
export type GridJustifyContentKeywordType = NonNullable<NativeGridProps["justifyContent"]>;
export type GridAlignContentKeywordType = NonNullable<NativeGridProps["alignContent"]>;
export type GridPlaceContentKeywordType = NonNullable<NativeGridProps["placeContent"]>;

export type GridPropsType = Omit<
  NativeGridProps,
  keyof NativeBoxOverridesType | "gap" | "rowGap" | "columnGap" | "slot"
> &
  NativeBoxOverridesType &
  LegacyBoxPropsType & {
    /**
     * Adjust spacing between grid elements across both axes or responsive query.
     * Accepts modern SizeKeyword tokens ('small-200', 'base', 'none') and legacy Polaris tokens ('200', '400').
     */
    gap?: ResponsivePropType<BoxPaddingType>;

    /**
     * Adjust spacing between elements along the block (row) axis. Overrides the row value of `gap`.
     */
    rowGap?: ResponsivePropType<BoxPaddingDirectionType>;

    /**
     * Adjust spacing between elements along the inline (column) axis. Overrides the column value of `gap`.
     */
    columnGap?: ResponsivePropType<BoxPaddingDirectionType>;

    /**
     * Shorthand / convenience alias for columns.
     * If a number `n` is provided, maps to `repeat(${n}, minmax(0, 1fr))`.
     * If a string is provided, sets `gridTemplateColumns`.
     */
    columns?: ResponsivePropType<number | string>;

    /**
     * Shorthand / convenience alias for rows.
     * If a number `n` is provided, maps to `repeat(${n}, minmax(0, 1fr))`.
     * If a string is provided, sets `gridTemplateRows`.
     */
    rows?: ResponsivePropType<number | string>;

    /**
     * Named grid areas specification.
     */
    areas?: string;

    role?: string;
    tabIndex?: number;
    id?: string;
    className?: string;
    style?: CSSProperties;
    slot?: string;
    [key: `aria-${string}`]: unknown;
    [key: `data-${string}`]: unknown;
  };

export type GridItemPropsType = Omit<
  NativeGridItemProps,
  keyof NativeBoxOverridesType | "gridColumn" | "gridRow" | "slot"
> &
  NativeBoxOverridesType &
  LegacyBoxPropsType & {
    /**
     * Number of columns the item spans across or track placement.
     *
     * @see https://developer.mozilla.org/en-US/docs/Web/CSS/grid-column
     */
    gridColumn?: NativeGridItemProps["gridColumn"] | number | (string & {});

    /**
     * Number of rows the item spans across or track placement.
     *
     * @see https://developer.mozilla.org/en-US/docs/Web/CSS/grid-row
     */
    gridRow?: NativeGridItemProps["gridRow"] | number | (string & {});

    /**
     * Convenience alias: number of columns to span (e.g. `2` -> `span 2`).
     */
    columnSpan?: ResponsivePropType<number>;

    /**
     * Convenience alias: number of rows to span (e.g. `2` -> `span 2`).
     */
    rowSpan?: ResponsivePropType<number>;

    /**
     * Convenience alias for `gridColumn`.
     */
    column?: ResponsivePropType<string | number>;

    /**
     * Convenience alias for `gridRow`.
     */
    row?: ResponsivePropType<string | number>;

    /**
     * Name of the grid area the item belongs to.
     */
    area?: string;

    role?: string;
    tabIndex?: number;
    id?: string;
    className?: string;
    style?: CSSProperties;
    slot?: string;
    [key: `aria-${string}`]: unknown;
    [key: `data-${string}`]: unknown;
  };

export type GridComponentType = ForwardRefExoticComponent<
  GridPropsType & RefAttributes<HTMLElement>
> & {
  Item: ForwardRefExoticComponent<GridItemPropsType & RefAttributes<HTMLElement>>;
};

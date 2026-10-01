import { forwardRef } from "react";
import { Grid } from "../Grid";
import { resolveResponsiveValue, useDimension } from "../../hooks/useDimension";
import type {
  InlineGridColumnsType,
  InlineGridPropsType,
  InlineGridTrackType,
} from "./InlineGrid.types";

/**
 * v12's fraction names, as fr units. `["oneThird", "twoThirds"]` is the shape
 * call sites use most, and it has to come out as `1fr 2fr` rather than as two
 * literal words CSS will drop.
 */
const FRACTION_TRACK: Record<string, string> = {
  oneFourth: "1fr",
  oneThird: "1fr",
  oneHalf: "1fr",
  twoThirds: "2fr",
  threeFourths: "3fr",
};

function resolveTrack(value: InlineGridTrackType | undefined): string | number | undefined {
  if (value === undefined) return undefined;
  if (typeof value === "number") return value;
  if (Array.isArray(value)) {
    return value.map((entry) => FRACTION_TRACK[entry] ?? entry).join(" ");
  }
  return FRACTION_TRACK[value] ?? value;
}

/**
 * Equal (or explicitly tracked) columns on one row, on `Grid`.
 *
 * The responsive object is resolved here rather than handed to `Grid`, because a
 * track list may contain v12 fraction names at any breakpoint.
 */
export const InlineGrid = forwardRef<HTMLElement, InlineGridPropsType>(
  function InlineGrid({ children, columns, gap = "base", ...rest }, ref) {
    const { breakpoint } = useDimension();

    const resolved = isResponsive(columns)
      ? resolveTrack(resolveResponsiveValue(columns, breakpoint))
      : resolveTrack(columns);

    return (
      <Grid ref={ref} columns={resolved} gap={gap} {...rest}>
        {children}
      </Grid>
    );
  },
);

function isResponsive(
  columns: InlineGridColumnsType | undefined,
): columns is Exclude<InlineGridColumnsType, InlineGridTrackType> {
  return (
    typeof columns === "object" && columns !== null && !Array.isArray(columns)
  );
}

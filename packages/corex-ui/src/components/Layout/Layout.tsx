import { forwardRef } from "react";
import { Grid } from "../Grid";
import { useDimension } from "../../hooks/useDimension";
import type { LayoutPropsType, LayoutSectionPropsType } from "./Layout.types";

/** Twelve columns, so halves, thirds and quarters all land on a track boundary. */
const COLUMN_COUNT = 12;

const SECTION_SPAN: Record<string, number> = {
  fullWidth: COLUMN_COUNT,
  oneHalf: 6,
  oneThird: 4,
  oneFourth: 3,
};

/**
 * v12's page grid, on `Grid`.
 *
 * A section is full width unless it asks for a fraction, and everything stacks
 * below the `md` breakpoint rather than squeezing several columns onto a phone.
 */
export const LayoutSection = forwardRef<HTMLElement, LayoutSectionPropsType>(
  function LayoutSection(
    { children, variant, fullWidth, oneThird, oneHalf, ...rest },
    ref,
  ) {
    const { breakpoint } = useDimension();

    const resolvedVariant =
      variant ??
      (fullWidth ? "fullWidth" : oneThird ? "oneThird" : oneHalf ? "oneHalf" : undefined);

    const span = resolvedVariant ? SECTION_SPAN[resolvedVariant] : undefined;
    const stacked = breakpoint === "xs" || breakpoint === "sm";

    return (
      <Grid.Item
        ref={ref}
        gridColumn={`span ${stacked || span === undefined ? COLUMN_COUNT : span}`}
        {...rest}
      >
        {children}
      </Grid.Item>
    );
  },
);

const LayoutRoot = forwardRef<HTMLElement, LayoutPropsType>(function Layout(
  { children, gap = "base", ...rest },
  ref,
) {
  return (
    <Grid ref={ref} columns={COLUMN_COUNT} gap={gap} {...rest}>
      {children}
    </Grid>
  );
});

export const Layout = Object.assign(LayoutRoot, { Section: LayoutSection });

import { useDimension, BREAKPOINT_WIDTHS } from "./useDimension";
import type { BreakpointType } from "./useDimension";

export type UseBreakpointsResultType = {
  smUp: boolean;
  smDown: boolean;
  mdUp: boolean;
  mdDown: boolean;
  lgUp: boolean;
  lgDown: boolean;
};

/**
 * v12's "is this a phone" hook, on `useDimension` so it reports the same
 * breakpoints as `Grid`, `Layout` and `InlineGrid` — a layout that branches on
 * this and a grid that collapses should change at the same width.
 *
 * Polaris's `xl` has no equivalent in that scale, so it is not reported; `lgUp`
 * is the widest question this answers.
 */
export function useBreakpoints(): UseBreakpointsResultType {
  const { width } = useDimension();

  const up = (breakpoint: BreakpointType) => width >= BREAKPOINT_WIDTHS[breakpoint];

  return {
    smUp: up("sm"),
    smDown: !up("sm"),
    mdUp: up("md"),
    mdDown: !up("md"),
    lgUp: up("lg"),
    lgDown: !up("lg"),
  };
}

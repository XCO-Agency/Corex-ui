import {
  Children,
  Fragment,
  cloneElement,
  forwardRef,
  isValidElement,
  useMemo,
  type ReactElement,
  type ReactNode,
} from "react";
import { Grid } from "../Grid";
import type { LayoutPropsType, LayoutSectionPropsType } from "./Layout.types";

/** Twelve columns, so halves, thirds and quarters all land on a track boundary. */
const COLUMN_COUNT = 12;

const SECTION_SPAN: Record<string, number> = {
  fullWidth: COLUMN_COUNT,
  threeFourths: 9,
  twoThirds: 8,
  oneHalf: 6,
  oneThird: 4,
  secondary: 4,
  oneFourth: 3,
};

function flattenChildren(children: ReactNode): ReactNode[] {
  const result: ReactNode[] = [];
  Children.forEach(children, (child) => {
    if (isValidElement(child) && child.type === Fragment) {
      result.push(...flattenChildren((child.props as { children?: ReactNode }).children));
    } else if (child !== null && child !== undefined && typeof child !== "boolean") {
      result.push(child);
    }
  });
  return result;
}

function getDeclaredSpan(child: ReactNode): number | undefined {
  if (!isValidElement(child)) return undefined;
  const props = child.props as LayoutSectionPropsType;

  if (props.columnSpan !== undefined && typeof props.columnSpan === "number") {
    return props.columnSpan;
  }

  const variant =
    props.variant ??
    (props.fullWidth
      ? "fullWidth"
      : props.oneThird || props.secondary
        ? "oneThird"
        : props.oneHalf
          ? "oneHalf"
          : props.oneFourth
            ? "oneFourth"
            : undefined);

  if (variant && variant in SECTION_SPAN) {
    return SECTION_SPAN[variant];
  }

  return undefined;
}

/**
 * Computes the column spans (out of 12) for each section.
 * When a section is given a fractional variant (like oneThird, oneFourth, oneHalf),
 * and another section has no variant, the unvarianted section automatically fills
 * the rest of the 12 columns in that row.
 */
function computeSectionSpans(children: ReactNode[]): number[] {
  const count = children.length;
  const spans: number[] = new Array(count);

  let i = 0;
  while (i < count) {
    const child = children[i];
    if (!isValidElement(child)) {
      spans[i] = COLUMN_COUNT;
      i++;
      continue;
    }

    const span_i = getDeclaredSpan(child);

    if (span_i !== undefined) {
      if (span_i >= COLUMN_COUNT) {
        spans[i] = COLUMN_COUNT;
        i++;
      } else {
        let currentFixedSum = span_i;
        const rowIndices: number[] = [i];
        let autoIndex = -1;
        let j = i + 1;

        while (j < count) {
          const nextChild = children[j];
          if (!isValidElement(nextChild)) break;
          const nextSpan = getDeclaredSpan(nextChild);

          if (nextSpan !== undefined) {
            if (autoIndex !== -1) {
              break;
            }
            if (currentFixedSum + nextSpan <= COLUMN_COUNT) {
              currentFixedSum += nextSpan;
              rowIndices.push(j);
              j++;
              if (currentFixedSum === COLUMN_COUNT) {
                break;
              }
            } else {
              break;
            }
          } else {
            // nextChild is auto (no variant)
            if (autoIndex !== -1) {
              break;
            }
            if (currentFixedSum < COLUMN_COUNT) {
              autoIndex = j;
              rowIndices.push(j);
              j++;
              // Auto section fills the rest of the row, completing this row.
              break;
            } else {
              break;
            }
          }
        }

        for (const idx of rowIndices) {
          if (idx === autoIndex) {
            spans[idx] = COLUMN_COUNT - currentFixedSum;
          } else {
            spans[idx] = getDeclaredSpan(children[idx]) ?? COLUMN_COUNT;
          }
        }

        i = j;
      }
    } else {
      // Child i has no variant (auto)
      // Check if subsequent child has a declared fraction
      let pairedWithSubsequent = false;

      if (i + 1 < count) {
        const nextChild = children[i + 1];
        if (isValidElement(nextChild)) {
          const nextSpan = getDeclaredSpan(nextChild);
          if (nextSpan !== undefined && nextSpan < COLUMN_COUNT) {
            // Check if the subsequent sections already form a full row among themselves (e.g. [auto, oneHalf, oneHalf])
            let nextRowComplete = false;
            if (i + 2 < count) {
              const nextNextChild = children[i + 2];
              if (isValidElement(nextNextChild)) {
                const nextNextSpan = getDeclaredSpan(nextNextChild);
                if (
                  nextNextSpan !== undefined &&
                  nextSpan + nextNextSpan === COLUMN_COUNT
                ) {
                  nextRowComplete = true;
                }
              }
            }

            if (!nextRowComplete) {
              let fixedSum = nextSpan;
              const fixedIndices: number[] = [i + 1];
              let k = i + 2;
              while (k < count) {
                const c = children[k];
                if (!isValidElement(c)) break;
                const s = getDeclaredSpan(c);
                if (s === nextSpan && fixedSum + s < COLUMN_COUNT) {
                  fixedSum += s;
                  fixedIndices.push(k);
                  k++;
                } else {
                  break;
                }
              }

              spans[i] = COLUMN_COUNT - fixedSum;
              for (const fIdx of fixedIndices) {
                spans[fIdx] = getDeclaredSpan(children[fIdx])!;
              }
              pairedWithSubsequent = true;
              i = i + 1 + fixedIndices.length;
            }
          }
        }
      }

      if (!pairedWithSubsequent) {
        spans[i] = COLUMN_COUNT;
        i++;
      }
    }
  }

  return spans;
}

/**
 * v12's page grid, on `Grid`.
 *
 * A section auto-fills the remaining columns of the row when paired with fractional
 * sections (oneThird, oneFourth, oneHalf), or spans full width (12 columns) if alone.
 * Below the `md` breakpoint, all sections automatically stack vertically.
 */
export const LayoutSection = forwardRef<HTMLElement, LayoutSectionPropsType>(
  function LayoutSection(
    {
      children,
      variant,
      fullWidth,
      oneThird,
      oneHalf,
      oneFourth,
      secondary,
      columnSpan,
      _calculatedSpan,
      ...rest
    },
    ref,
  ) {
    const resolvedVariant =
      variant ??
      (fullWidth
        ? "fullWidth"
        : oneThird || secondary
          ? "oneThird"
          : oneHalf
            ? "oneHalf"
            : oneFourth
              ? "oneFourth"
              : undefined);

    const span =
      resolvedVariant && SECTION_SPAN[resolvedVariant]
        ? SECTION_SPAN[resolvedVariant]
        : (_calculatedSpan ?? COLUMN_COUNT);

    const resolvedColumnSpan = columnSpan ?? {
      xs: 1,
      sm: 1,
      md: span,
      lg: span,
    };

    return (
      <Grid.Item ref={ref} columnSpan={resolvedColumnSpan} {...rest}>
        {children}
      </Grid.Item>
    );
  },
);

LayoutSection.displayName = "LayoutSection";

const LayoutRoot = forwardRef<HTMLElement, LayoutPropsType>(function Layout(
  {
    children,
    gap = "base",
    columns = { xs: 1, sm: 1, md: COLUMN_COUNT, lg: COLUMN_COUNT },
    ...rest
  },
  ref,
) {
  const childrenArray = useMemo(() => flattenChildren(children), [children]);
  const spans = useMemo(() => computeSectionSpans(childrenArray), [childrenArray]);

  return (
    <Grid ref={ref} columns={columns} gap={gap} {...rest}>
      {childrenArray.map((child, index) => {
        if (isValidElement(child)) {
          return cloneElement(child as ReactElement<LayoutSectionPropsType>, {
            key: child.key ?? index,
            _calculatedSpan: spans[index],
          });
        }
        return child;
      })}
    </Grid>
  );
});

LayoutRoot.displayName = "Layout";

export const Layout = Object.assign(LayoutRoot, { Section: LayoutSection });

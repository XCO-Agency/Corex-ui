import { forwardRef, Fragment } from "react";
import { resolveSpacing } from "../../core/stackUtils";
import { Text } from "../Text";
import type { DescriptionListPropsType } from "./DescriptionList.types";

const GAP_TOKEN = { tight: "small-200", loose: "base" } as const;

/**
 * Term/description pairs in two columns, as a real `dl` so the pairing lives in
 * the markup rather than only in the layout. `dt` and `dd` stay direct children
 * of the `dl`, which is both what the spec wants and what the grid needs to line
 * the columns up.
 */
export const DescriptionList = forwardRef<HTMLDListElement, DescriptionListPropsType>(
  function DescriptionList({ items = [], gap = "loose", style, ...rest }, ref) {
    return (
      <dl
        ref={ref}
        style={{
          display: "grid",
          gridTemplateColumns: "max-content 1fr",
          columnGap: resolveSpacing("base"),
          rowGap: resolveSpacing(GAP_TOKEN[gap]),
          margin: 0,
          ...style,
        }}
        {...rest}
      >
        {items.map((item, index) => (
          <Fragment key={index}>
            <dt style={{ margin: 0 }}>
              <Text fontWeight="medium">{item.term}</Text>
            </dt>
            <dd style={{ margin: 0 }}>
              <Text color="subdued">{item.description}</Text>
            </dd>
          </Fragment>
        ))}
      </dl>
    );
  },
);

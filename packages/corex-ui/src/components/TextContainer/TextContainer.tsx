import { forwardRef } from "react";
import { BlockStack } from "../BlockStack";
import type { TextContainerPropsType } from "./TextContainer.types";

/**
 * v12's spacing for a run of prose.
 *
 * On the scale in `core/stackUtils.ts` the `small-*` names run the other way
 * from the numeric ones: `small-400` is 2px and `small` is 12px. The previous
 * map was therefore tight=2px and loose=12px, tighter than the 16px base and
 * with no rhythm between paragraphs. Loose is `base` (16px); tight is
 * `small-200` (8px). Those tokens emit the `--p-space-400` / `--p-space-200`
 * values the tests assert.
 */
const SPACING_GAP = { tight: "small-200", loose: "base" } as const;

/**
 * A column of prose at v12's rhythm. Thin by design: the spacing is the whole
 * component, and `BlockStack` already owns the Polaris space scale.
 */
export const TextContainer = forwardRef<HTMLDivElement, TextContainerPropsType>(
  function TextContainer({ children, spacing = "loose", ...rest }, ref) {
    return (
      <BlockStack ref={ref} gap={SPACING_GAP[spacing]} {...rest}>
        {children}
      </BlockStack>
    );
  },
);

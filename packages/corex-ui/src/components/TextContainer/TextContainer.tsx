import { forwardRef } from "react";
import { BlockStack } from "../BlockStack";
import type { TextContainerPropsType } from "./TextContainer.types";

/**
 * v12's spacing for a run of prose.
 *
 * By the scale in `core/stackUtils.ts` the `small-*` names run the other way
 * from the numeric ones: `small-400` is 2px, not 16px, and `small` is 12px.
 * So this read tight=2px and loose=12px - no rhythm at all between paragraphs,
 * and a "loose" default tighter than the 16px base. The numeric tokens are
 * what the test asks for and what v12 uses.
 */
const SPACING_GAP = { tight: "200", loose: "400" } as const;

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

import { forwardRef } from "react";
import { BlockStack } from "../BlockStack";
import type { TextContainerPropsType } from "./TextContainer.types";

/** v12's spacing for a run of prose. */
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

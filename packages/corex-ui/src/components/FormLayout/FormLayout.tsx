import { forwardRef } from "react";
import { BlockStack } from "../BlockStack";
import { InlineStack } from "../InlineStack";
import { devWarning } from "../../utils/devWarning";
import type {
  FormLayoutGroupPropsType,
  FormLayoutPropsType,
} from "./FormLayout.types";

/**
 * Fields in a column; a `Group` puts them on one row that wraps rather than
 * overflowing, which is what v12 did at narrow widths.
 */
export const FormLayoutGroup = forwardRef<HTMLDivElement, FormLayoutGroupPropsType>(
  function FormLayoutGroup({ children, condensed, title, helpText, ...rest }, ref) {
    if (title !== undefined || helpText !== undefined) {
      devWarning(
        "FormLayout.Group",
        "`title` and `helpText` are not rendered; wrap the group in a `BlockStack` with a `Text` instead.",
      );
    }

    return (
      <InlineStack
        ref={ref}
        gap={condensed ? "small-200" : "base"}
        wrap
        blockAlign="end"
        {...rest}
      >
        {children}
      </InlineStack>
    );
  },
);

const FormLayoutRoot = forwardRef<HTMLDivElement, FormLayoutPropsType>(
  function FormLayout({ children, gap = "base", ...rest }, ref) {
    return (
      <BlockStack ref={ref} gap={gap} {...rest}>
        {children}
      </BlockStack>
    );
  },
);

export const FormLayout = Object.assign(FormLayoutRoot, { Group: FormLayoutGroup });

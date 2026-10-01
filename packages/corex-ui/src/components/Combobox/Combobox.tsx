import { forwardRef } from "react";
import { BlockStack } from "../BlockStack";
import { TextField } from "../TextField";
import type { ComboboxPropsType } from "./Combobox.types";

/**
 * A field with its suggestions beneath it.
 *
 * The list renders in flow rather than in a popover. v12 floated it, but a popover
 * here would have to own open state, and the one thing this control must not do is
 * swallow a keystroke or lose focus mid-type. Call sites already render the list
 * only when there are matches, which is the same behaviour without the risk.
 */
const ComboboxRoot = forwardRef<HTMLDivElement, ComboboxPropsType>(function Combobox(
  { activator, children, allowMultiple, ...rest },
  ref,
) {
  return (
    <BlockStack ref={ref} gap="small-200" {...rest}>
      {activator}
      {children}
    </BlockStack>
  );
});

export const Combobox = Object.assign(ComboboxRoot, { TextField });

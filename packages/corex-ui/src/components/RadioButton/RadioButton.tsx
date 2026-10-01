import { forwardRef } from "react";
import { childrenText } from "../../core/childrenText";
import { ChoiceList } from "../ChoiceList";
import type { RadioButtonPropsType } from "./RadioButton.types";

/**
 * One radio, as a single-choice `s-choice-list`.
 *
 * Built on `ChoiceList` rather than on a bare `input type="radio"` so the control
 * is the admin's own: a set of these sharing a `name` behaves as one group, and a
 * single one still looks like every other choice in the admin.
 */
export const RadioButton = forwardRef<HTMLElement, RadioButtonPropsType>(
  function RadioButton(
    { label, checked, value, name, disabled, helpText, onChange, id, ...rest },
    ref,
  ) {
    const resolvedValue = value ?? id ?? "";
    // `s-choice` takes its label as text, so a node label is flattened the same
    // way a button's accessible name is.
    const labelText = childrenText(label);

    return (
      <ChoiceList
        ref={ref}
        id={id}
        name={name}
        label={labelText}
        labelAccessibilityVisibility="exclusive"
        choices={[{ label: labelText, value: resolvedValue, helpText, disabled }]}
        selected={checked ? [resolvedValue] : []}
        onChange={(values) => onChange?.(values.includes(resolvedValue), id ?? "")}
        {...rest}
      />
    );
  },
);

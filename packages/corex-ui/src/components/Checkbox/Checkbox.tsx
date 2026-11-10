import { forwardRef } from "react";
import { childrenText } from "../../core/childrenText";
import { createWebComponent } from "../../core/createWebComponent";
import type { CheckboxPropsType } from "./Checkbox.types";

const SCheckbox = createWebComponent<HTMLElement, { onChange: "change" }>("s-checkbox", {
  events: { onChange: "change" },
  domProps: ["checked", "indeterminate", "labelAccessibilityVisibility"],
});

/** Controlled-form-input pattern: `checked` is set as a live DOM property, see `assignDomProp`. */
export const Checkbox = forwardRef<HTMLElement, CheckboxPropsType>(function Checkbox(
  {
    label,
    checked,
    indeterminate,
    labelHidden,
    labelAccessibilityVisibility,
    onChange,
    helpText,
    details,
    id,
    accessibilityLabel,
    ...rest
  },
  ref,
) {
  const resolvedLabelAccessibilityVisibility =
    labelAccessibilityVisibility ?? (labelHidden ? "exclusive" : undefined);
  const labelText = typeof label === "string" ? label.trim() : childrenText(label);
  const resolvedAccessibilityLabel =
    accessibilityLabel || (labelText ? undefined : "Checkbox");

  const handleChange = (event: Event) => {
    const target = event.currentTarget as (EventTarget & { checked?: boolean }) | null;
    onChange?.(Boolean(target?.checked), id ?? "");
  };

  return (
    <SCheckbox
      ref={ref}
      id={id}
      label={label}
      checked={checked}
      indeterminate={indeterminate}
      accessibilityLabel={resolvedAccessibilityLabel}
      labelAccessibilityVisibility={resolvedLabelAccessibilityVisibility}
      details={details ?? helpText}
      onChange={handleChange}
      {...rest}
    />
  );
});

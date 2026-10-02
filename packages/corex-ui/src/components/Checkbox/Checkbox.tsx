import { forwardRef } from "react";
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
    ...rest
  },
  ref,
) {
  const resolvedLabelAccessibilityVisibility =
    labelAccessibilityVisibility ?? (labelHidden ? "exclusive" : undefined);

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
      labelAccessibilityVisibility={resolvedLabelAccessibilityVisibility}
      details={details ?? helpText}
      onChange={handleChange}
      {...rest}
    />
  );
});

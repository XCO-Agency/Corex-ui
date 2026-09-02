import { forwardRef } from "react";
import { createWebComponent } from "../../core/createWebComponent";
import type { CheckboxProps } from "./Checkbox.types";

const SCheckbox = createWebComponent<HTMLElement, { onChange: "change" }>("s-checkbox", {
  events: { onChange: "change" },
  domProps: ["checked"],
});

/** Controlled-form-input pattern: `checked` is set as a live DOM property, see `assignDomProp`. */
export const Checkbox = forwardRef<HTMLElement, CheckboxProps>(function Checkbox(
  { label, checked, onChange, helpText, id, ...rest },
  ref,
) {
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
      details={helpText}
      onChange={handleChange}
      {...rest}
    />
  );
});

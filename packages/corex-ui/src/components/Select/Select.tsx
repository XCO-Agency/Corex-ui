import { forwardRef } from "react";
import { createWebComponent } from "../../core/createWebComponent";
import type { SelectOption, SelectProps } from "./Select.types";

const SSelect = createWebComponent<HTMLElement, { onChange: "change" }>("s-select", {
  events: { onChange: "change" },
  domProps: ["value"],
});
const SOption = createWebComponent<HTMLElement>("s-option");

function normalizeOption(option: SelectOption | string): SelectOption {
  return typeof option === "string" ? { label: option, value: option } : option;
}

/**
 * Controlled-form-input pattern: legacy `options` (string[] or
 * `{label, value}[]`) is rendered as native `<option>` children, since
 * `s-select` (like a native `<select>`) reads its options from light-DOM
 * `<option>` elements rather than a structured prop.
 */
export const Select = forwardRef<HTMLElement, SelectProps>(function Select(
  { label, options, onChange, helpText, id, ...rest },
  ref,
) {
  const handleChange = (event: Event) => {
    const target = event.currentTarget as (EventTarget & { value?: string }) | null;
    onChange?.(target?.value ?? "", id ?? "");
  };

  return (
    <SSelect ref={ref} id={id} label={label} details={helpText} onChange={handleChange} {...rest}>
      {options.map(normalizeOption).map((option) => (
        <SOption key={option.value} value={option.value} disabled={option.disabled} selected={rest.value === option.value}>
          {option.label}
        </SOption>
      ))}
    </SSelect>
  );
});

import { forwardRef } from "react";
import { createWebComponent } from "../../core/createWebComponent";
import type { SelectOptionType, SelectPropsType } from "./Select.types";

const SSelect = createWebComponent<HTMLElement, { onChange: "change" }>("s-select", {
  events: { onChange: "change" },
  domProps: ["value"],
});
const SOption = createWebComponent<HTMLElement>("s-option");

function normalizeOption(option: SelectOptionType | string): SelectOptionType {
  return typeof option === "string" ? { label: option, value: option } : option;
}

/**
 * Controlled-form-input pattern: legacy `options` (string[] or
 * `{label, value}[]`) is rendered as native `<s-option>` children, since
 * `s-select` reads its options from `<s-option>` elements.
 */
export const Select = forwardRef<HTMLElement, SelectPropsType>(function Select(
  { label, options, onChange, helpText, details, id, ...rest },
  ref,
) {
  const handleChange = (event: Event) => {
    const target = event.currentTarget as (EventTarget & { value?: string }) | null;
    onChange?.(target?.value ?? "", id ?? "");
  };

  return (
    <SSelect
      ref={ref}
      id={id}
      label={label}
      details={details ?? helpText}
      onChange={handleChange}
      {...rest}
    >
      {options.map(normalizeOption).map((option) => (
        <SOption
          key={option.value}
          value={option.value}
          disabled={option.disabled}
        >
          {option.label}
        </SOption>
      ))}
    </SSelect>
  );
});

import { forwardRef } from "react";
import { createWebComponent } from "../../core/createWebComponent";
import type { ChoiceListPropsType } from "./ChoiceList.types";

const SChoiceList = createWebComponent<HTMLElement, { onChange: "change" }>(
  "s-choice-list",
  {
    events: { onChange: "change" },
    domProps: ["values"],
  },
);
const SChoice = createWebComponent<HTMLElement>("s-choice");

/**
 * Controlled-form-input pattern, like `Select`. `choices`/`selected` are
 * non-primitive, so they're declared as `domProps` and assigned as live DOM
 * properties rather than JSX attributes.
 */
export const ChoiceList = forwardRef<HTMLElement, ChoiceListPropsType>(
  function ChoiceList(
    { label, choices, values, selected, onChange, multiple, name, children, ...rest },
    ref,
  ) {
    const handleChange = (event: Event) => {
      const target = event.currentTarget as (EventTarget & { values?: string[] }) | null;
      onChange?.(target?.values ?? [], name ?? "");
    };

    return (
      <SChoiceList
        ref={ref}
        label={label ?? name}
        values={selected ?? values}
        multiple={multiple}
        name={name}
        onChange={handleChange}
        labelAccessibilityVisibility={label ? undefined : "exclusive"}
        {...rest}
      >
        {choices?.map((choice, index) => {
          // Choices are often mapped straight off optional backend fields, so a
          // missing label or value is coerced here instead of at every call site.
          const value = choice.value ?? "";
          const choiceLabel = choice.label ?? "";
          return (
            <SChoice
              key={`${value}-${index}`}
              value={value}
              selected={selected?.includes(value)}
              accessibilityLabel={choiceLabel}
              disabled={choice.disabled}
            >
              {choiceLabel}
              {choice.helpText ? <span slot="details">{choice.helpText}</span> : null}
            </SChoice>
          );
        }) ?? children}
      </SChoiceList>
    );
  },
);

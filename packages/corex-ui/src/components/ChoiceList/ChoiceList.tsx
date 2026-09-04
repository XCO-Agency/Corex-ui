import { forwardRef } from "react";
import { createWebComponent } from "../../core/createWebComponent";
import type { ChoiceListProps } from "./ChoiceList.types";

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
 * properties rather than JSX attributes — the exact property/attribute
 * names are best-effort (no full API reference was available); verify
 * against your installed polaris-1.js.
 */
export const ChoiceList = forwardRef<HTMLElement, ChoiceListProps>(function ChoiceList(
  { title, choices, selected, onChange, allowMultiple, name, ...rest },
  ref,
) {
  const handleChange = (event: Event) => {
    const target = event.currentTarget as (EventTarget & { values?: string[] }) | null;
    onChange?.(target?.values ?? [], name ?? "");
  };

  return (
    <SChoiceList
      ref={ref}
      label={title}
      values={selected}
      multiple={allowMultiple}
      name={name}
      onChange={handleChange}
      {...rest}
    >
      {choices.map((choice) => (
        <SChoice
          key={choice.value}
          value={choice.value}
          selected={selected.includes(choice.value)}
          disabled={choice.disabled}
        >
          {choice.label}
          {choice.helpText ? <span slot="details">{choice.helpText}</span> : null}
        </SChoice>
      ))}
    </SChoiceList>
  );
});

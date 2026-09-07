import { forwardRef } from "react";
import { createWebComponent } from "../../core/createWebComponent";
import type { UrlFieldPropsType } from "./UrlField.types";

type FieldEvents = { onInput: "input"; onBlur: "blur"; onFocus: "focus" };
const fieldEvents: FieldEvents = { onInput: "input", onBlur: "blur", onFocus: "focus" };

const SUrlField = createWebComponent<HTMLElement, FieldEvents>("s-url-field", {
  events: fieldEvents,
  domProps: ["value"],
});

/** Controlled-form-input pattern for URL field wrapping `s-url-field`. */
export const UrlField = forwardRef<HTMLElement, UrlFieldPropsType>(function UrlField(
  {
    label,
    value,
    defaultValue,
    minLength,
    maxLength,
    onChange,
    onBlur,
    onFocus,
    helpText,
    details,
    prefix,
    suffix,
    requiredIndicator,
    id,
    ...rest
  },
  ref,
) {
  const handleInput = (event: Event) => {
    const target = event.currentTarget as (EventTarget & { value?: string }) | null;
    onChange?.(target?.value ?? "", id ?? "");
  };

  const slots = (
    <>
      {prefix ? <span slot="prefix">{prefix}</span> : null}
      {suffix ? <span slot="suffix">{suffix}</span> : null}
    </>
  );

  return (
    <SUrlField
      ref={ref}
      id={id}
      label={label}
      value={value ?? ""}
      defaultValue={defaultValue}
      minlength={minLength}
      maxlength={maxLength}
      details={details ?? helpText}
      required={requiredIndicator}
      onInput={handleInput}
      onBlur={onBlur}
      onFocus={onFocus}
      {...rest}
    >
      {slots}
    </SUrlField>
  );
});

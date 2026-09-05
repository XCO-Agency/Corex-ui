import { forwardRef } from "react";
import { createWebComponent } from "../../core/createWebComponent";
import type { TextFieldPropsType } from "./TextField.types";

type FieldEvents = { onInput: "input"; onBlur: "blur"; onFocus: "focus" };
const fieldEvents: FieldEvents = { onInput: "input", onBlur: "blur", onFocus: "focus" };

const STextField = createWebComponent<HTMLElement, FieldEvents>("s-text-field", {
  events: fieldEvents,
  domProps: ["value"],
});
const STextArea = createWebComponent<HTMLElement, FieldEvents>("s-text-area", {
  events: fieldEvents,
  domProps: ["value"],
});

/**
 * Controlled-form-input pattern: legacy `TextField.onChange` fires on every
 * keystroke, which is what the new element's `onInput` does. `multiline`
 * switches the rendered element to `s-text-area`.
 */
export const TextField = forwardRef<HTMLElement, TextFieldPropsType>(function TextField(
  {
    label,
    value,
    onChange,
    onBlur,
    onFocus,
    helpText,
    details,
    multiline,
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

  const sharedProps = {
    ref,
    id,
    label,
    value: value ?? "",
    details: details ?? helpText,
    required: requiredIndicator,
    onInput: handleInput,
    onBlur,
    onFocus,
    ...rest,
  };

  if (multiline) {
    const rows = typeof multiline === "number" ? multiline : undefined;
    return (
      <STextArea rows={rows} {...sharedProps}>
        {slots}
      </STextArea>
    );
  }

  return <STextField {...sharedProps}>{slots}</STextField>;
});

import { forwardRef } from "react";
import { createWebComponent } from "../../core/createWebComponent";
import type { TextFieldProps } from "./TextField.types";

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
 * keystroke, which is what the new element's `onInput` does — the new
 * element's own `onChange` only fires on blur/commit, so it is intentionally
 * *not* used here to preserve legacy per-keystroke behavior. `multiline`
 * switches the rendered element to `s-text-area`, since there is no single
 * element that covers both single- and multi-line legacy `TextField` usage.
 */
export const TextField = forwardRef<HTMLElement, TextFieldProps>(function TextField(
  {
    label,
    value,
    onChange,
    onBlur,
    onFocus,
    helpText,
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
    details: helpText,
    required: requiredIndicator,
    onInput: handleInput,
    onBlur,
    onFocus,
    ...rest,
  };

  if (multiline) {
    return (
      <STextArea
        {...sharedProps}
        rows={typeof multiline === "number" ? multiline : undefined}
      >
        {slots}
      </STextArea>
    );
  }

  return <STextField {...sharedProps}>{slots}</STextField>;
});

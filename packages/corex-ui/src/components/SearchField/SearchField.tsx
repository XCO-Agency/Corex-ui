import { forwardRef, useEffect, useState } from "react";
import { createWebComponent } from "../../core/createWebComponent";
import { useDebounce } from "../../hooks/useDebounce";
import type { SearchFieldPropsType } from "./SearchField.types";

type FieldEvents = { onInput: "input"; onBlur: "blur"; onFocus: "focus" };
const fieldEvents: FieldEvents = { onInput: "input", onBlur: "blur", onFocus: "focus" };

const SSearchField = createWebComponent<HTMLElement, FieldEvents>("s-search-field", {
  events: fieldEvents,
  domProps: ["value"],
});

/**
 * SearchField component wrapping Polaris `<s-search-field>`.
 * Features optional debounced changes, clear action, and full Polaris form field styling.
 */
export const SearchField = forwardRef<HTMLElement, SearchFieldPropsType>(
  function SearchField(
    {
      onChange,
      onDebouncedChange,
      debounceDelay = 300,
      helpText,
      details,
      value,
      defaultValue,
      id,
      ...rest
    },
    ref,
  ) {
    const isControlled = value !== undefined;
    const [localValue, setLocalValue] = useState(value ?? defaultValue);

    useEffect(() => {
      if (isControlled) {
        setLocalValue(value ?? "");
      }
    }, [value, isControlled]);

    const debouncedValue = useDebounce(localValue, debounceDelay);

    useEffect(() => {
      onDebouncedChange?.(debouncedValue ?? "");
    }, [debouncedValue, onDebouncedChange]);

    const handleInput = (event: Event) => {
      const target = event.currentTarget as (EventTarget & { value?: string }) | null;
      const nextVal = target?.value ?? "";
      setLocalValue(nextVal);
      onChange?.(nextVal, id);
    };

    return (
      <SSearchField
        ref={ref}
        id={id}
        value={isControlled ? (value ?? "") : localValue}
        details={details ?? helpText}
        onInput={handleInput}
        {...rest}
      ></SSearchField>
    );
  },
);

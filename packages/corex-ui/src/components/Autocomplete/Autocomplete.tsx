import { forwardRef } from "react";
import { BlockStack } from "../BlockStack";
import { Listbox } from "../Listbox";
import { TextField } from "../TextField";
import type { AutocompletePropsType } from "./Autocomplete.types";

/**
 * Options in, selection out: the whole control in one component, as v12's
 * `Autocomplete` was.
 *
 * `allowMultiple` toggles a value in and out of `selected`; without it a pick
 * replaces the selection. The list is a `Listbox`, so selection happens on
 * pointer-down and the field keeps focus.
 */
const AutocompleteRoot = forwardRef<HTMLDivElement, AutocompletePropsType>(
  function Autocomplete(
    {
      options = [],
      selected = [],
      onSelect,
      textField,
      allowMultiple,
      loading,
      emptyState,
      ...rest
    },
    ref,
  ) {
    const pick = (value: string) => {
      if (!allowMultiple) {
        onSelect?.([value]);
        return;
      }

      onSelect?.(
        selected.includes(value)
          ? selected.filter((entry) => entry !== value)
          : [...selected, value],
      );
    };

    return (
      <BlockStack ref={ref} gap="small-200" {...rest}>
        {textField}
        {loading ? <Listbox.Loading /> : null}
        {!loading && options.length > 0 ? (
          <Listbox onSelect={pick}>
            {options.map((option) => (
              <Listbox.Option
                key={option.value}
                value={option.value}
                selected={selected.includes(option.value)}
                disabled={option.disabled}
              >
                {option.label ?? option.value}
              </Listbox.Option>
            ))}
          </Listbox>
        ) : null}
        {!loading && options.length === 0 ? emptyState : null}
      </BlockStack>
    );
  },
);

export const Autocomplete = Object.assign(AutocompleteRoot, { TextField });

import { forwardRef } from "react";
import { Box } from "../Box";
import { Combobox } from "../Combobox";
import { Listbox } from "../Listbox";
import { TextField } from "../TextField";
import type {
  AutocompleteComponentType,
  AutocompletePropsType,
} from "./Autocomplete.types";

/**
 * Options in, selection out: the whole control in one component, displaying
 * its suggestions within a floating Popover anchored to the input field.
 *
 * `allowMultiple` toggles a value in and out of `selected`; without it a pick
 * replaces the selection and automatically closes the popover.
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
      open,
      active,
      onClose,
      preferredPosition,
      willLoadMoreResults,
      onLoadMoreResults,
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

    const hasOptions = options.length > 0;
    const shouldShowEmptyState = !loading && !hasOptions && Boolean(emptyState);

    return (
      <Combobox
        ref={ref}
        activator={textField}
        allowMultiple={allowMultiple}
        open={open}
        active={active}
        onClose={onClose}
        preferredPosition={preferredPosition}
        willLoadMoreOptions={willLoadMoreResults}
        onScrolledToBottom={onLoadMoreResults}
        {...rest}
      >
        <Combobox.Popover>
          {loading ? <Listbox.Loading key="autocomplete-loading" /> : null}
          {!loading && hasOptions ? (
            <Listbox key="autocomplete-listbox" onSelect={pick}>
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
          {shouldShowEmptyState ? (
            <Box key="autocomplete-empty-state" padding="small-200">
              {emptyState}
            </Box>
          ) : null}
        </Combobox.Popover>
      </Combobox>
    );
  },
);

export const Autocomplete = Object.assign(AutocompleteRoot, {
  TextField,
}) as unknown as AutocompleteComponentType;

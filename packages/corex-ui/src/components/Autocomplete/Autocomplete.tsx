import { forwardRef, useEffect, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import { Box } from "../Box";
import { Combobox } from "../Combobox";
import { Spinner } from "../Spinner";

export type AutocompleteOptionType = {
  value: string;
  label?: ReactNode;
  disabled?: boolean;
};

export type AutocompletePropsType = {
  /** The collection of suggestion options. */
  options?: AutocompleteOptionType[];
  /** Search query or input value. */
  value?: string;
  /** Callback when search query changes. */
  onChange?: (value: string) => void;
  /** The currently selected option value. */
  selected?: string;
  /** Callback fired when an option is selected. */
  onSelect?: (value: string) => void;

  /** Input label. */
  label?: string;
  /** Input placeholder text. */
  placeholder?: string;
  /** Whether the input is disabled. */
  disabled?: boolean;

  /** Loading state showing a spinner. */
  loading?: boolean;
  /** Content shown when no options match. */
  emptyState?: ReactNode;

  /** Controlled open state of the suggestion list. */
  open?: boolean;
  /** Callback when the suggestion list closes. */
  onClose?: () => void;

  id?: string;
  className?: string;
  style?: CSSProperties;
};

/**
 * Autocomplete component: provides real-time suggestions as the user types.
 * Single-selection only, built directly on Corex Combobox.
 */
export const Autocomplete = forwardRef<HTMLDivElement, AutocompletePropsType>(
  function Autocomplete(
    {
      options = [],
      value,
      onChange,
      selected,
      onSelect,
      label,
      placeholder = "Search...",
      disabled = false,
      loading = false,
      emptyState,
      open,
      onClose,
      id,
      className,
      style,
    },
    ref,
  ) {
    const isControlledValue = value !== undefined;
    const selectedItem = options.find((opt) => opt.value === selected);
    const selectedLabel =
      typeof selectedItem?.label === "string"
        ? selectedItem.label
        : (selectedItem?.value ?? "");

    const [internalValue, setInternalValue] = useState(selectedLabel);

    useEffect(() => {
      if (!isControlledValue) {
        setInternalValue(selectedLabel);
      }
    }, [isControlledValue, selectedLabel]);

    const displayValue = isControlledValue ? value : internalValue;

    const handleInputChange = (nextVal: string) => {
      if (!isControlledValue) {
        setInternalValue(nextVal);
      }
      onChange?.(nextVal);
      if (nextVal === "" && selected) {
        onSelect?.("");
      }
    };

    const handleSelectOption = (opt: AutocompleteOptionType) => {
      const labelStr = typeof opt.label === "string" ? opt.label : opt.value;
      if (!isControlledValue) {
        setInternalValue(labelStr);
      }
      onChange?.(labelStr);
      onSelect?.(opt.value);
    };

    const handleClear = () => {
      if (!isControlledValue) {
        setInternalValue("");
      }
      onChange?.("");
      onSelect?.("");
    };

    const hasOptions = options.length > 0;

    return (
      <Combobox
        ref={ref}
        items={options}
        itemToStringValue={(opt) =>
          typeof opt?.label === "string" ? opt.label : String(opt?.value ?? opt ?? "")
        }
        value={selectedItem}
        open={open}
        onClose={onClose}
        inputValue={displayValue}
        onInputValueChange={handleInputChange}
        onValueChange={(val) => {
          if (!val) {
            handleClear();
          }
        }}
        filter={false}
        id={id}
        className={className}
        style={style}
      >
        <Combobox.Input
          label={label}
          placeholder={placeholder}
          value={displayValue}
          onChange={handleInputChange}
          onClear={handleClear}
          autoComplete="off"
          disabled={disabled}
          showClear
        />
        <Combobox.Content>
          {loading ? (
            <Box padding="base" inlineSize="100%" style={{ textAlign: "center" }}>
              <Spinner size="small" />
            </Box>
          ) : null}
          {!loading && !hasOptions && emptyState ? (
            <Combobox.Empty>{emptyState}</Combobox.Empty>
          ) : null}
          {!loading && hasOptions ? (
            <Combobox.List>
              {options.map((option) => (
                <Combobox.Item
                  key={option.value}
                  value={option}
                  disabled={option.disabled}
                  onSelect={() => handleSelectOption(option)}
                >
                  {option.label ?? option.value}
                </Combobox.Item>
              ))}
            </Combobox.List>
          ) : null}
        </Combobox.Content>
      </Combobox>
    );
  },
);

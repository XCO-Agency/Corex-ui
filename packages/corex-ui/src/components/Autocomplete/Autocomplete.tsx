import { forwardRef } from "react";
import type { CSSProperties, ReactNode } from "react";
import { Box } from "../Box";
import { Combobox } from "../Combobox";
import { Spinner } from "../Spinner";

export type AutocompleteOptionType = {
  value: string;
  label?: ReactNode;
  disabled?: boolean;
};

type AutocompletePropsType = {
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
  /** Browser autocomplete attribute. Defaults to "off". */
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
      value = "",
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
    const selectedItem = options.find((opt) => opt.value === selected);
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
        inputValue={value}
        onInputValueChange={onChange}
        filter={false}
        id={id}
        className={className}
        style={style}
      >
        <Combobox.Input
          label={label}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
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
                  onSelect={() => onSelect?.(option.value)}
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

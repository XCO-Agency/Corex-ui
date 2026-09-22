import type { PolarisPropsType } from "../../types/common";

type NativeSearchFieldProps = PolarisPropsType<"s-search-field">;

export type SearchFieldPropsType = Omit<NativeSearchFieldProps, "onChange"> & {
  /** Label for the search field. If not provided, defaults to "Search". */
  /** Callback fired on every input change. */
  onChange?: (value: string, id?: string) => void;
  /** Callback fired with debounced value. */
  onDebouncedChange?: (value: string) => void;
  /** Debounce delay in ms for onDebouncedChange. Defaults to 300ms. */
  debounceDelay?: number;
  /** Callback fired when search is cleared. */
  helpText?: string;
};
